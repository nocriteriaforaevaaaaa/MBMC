import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const session = await getSessionUser();

    // Only merchants can verify QR codes
    if (!session || session.role !== "MERCHANT") {
      return NextResponse.json(
        { error: "Unauthorized - Merchant access required" },
        { status: 401 }
      );
    }

    const merchant = await prisma.merchant.findUnique({
      where: { userId: session.userId },
    });

    if (!merchant || merchant.kycStatus !== "APPROVED") {
      return NextResponse.json(
        { error: "Merchant not approved" },
        { status: 403 }
      );
    }

    const { qrData } = await req.json();

    if (!qrData) {
      return NextResponse.json(
        { error: "QR data is required" },
        { status: 400 }
      );
    }

    // Verify QR data format and hash
    const [encoded, hash] = qrData.split('.');
    if (!encoded || !hash) {
      return NextResponse.json(
        { error: "Invalid QR code format" },
        { status: 400 }
      );
    }

    // Decode the data
    const decodedData = Buffer.from(encoded, 'base64').toString('utf-8');
    const data = JSON.parse(decodedData);

    // Verify hash
    const expectedHash = crypto.createHash('sha256')
      .update(decodedData)
      .digest('hex')
      .substring(0, 16);

    if (hash !== expectedHash) {
      return NextResponse.json(
        { error: "Invalid QR code - tampered data detected" },
        { status: 400 }
      );
    }

    const { rid: redemptionId, oid: offerId } = data;

    // Find the redemption
    const redemption = await prisma.redemption.findUnique({
      where: { id: redemptionId },
      include: {
        offer: {
          include: {
            merchant: true
          }
        },
        student: {
          include: {
            user: true
          }
        }
      }
    });

    if (!redemption) {
      return NextResponse.json(
        { error: "Redemption not found" },
        { status: 404 }
      );
    }

    // Verify the offer belongs to this merchant
    if (redemption.offer.merchantId !== merchant.id) {
      return NextResponse.json(
        { error: "This offer does not belong to your store" },
        { status: 403 }
      );
    }

    // Check if already redeemed
    if (redemption.status === "REDEEMED") {
      return NextResponse.json(
        { 
          error: "Already redeemed",
          redemption: {
            id: redemption.id,
            redeemedAt: redemption.redeemedAt,
            studentName: redemption.student.user.name,
            offerTitle: redemption.offer.title,
            status: "ALREADY_USED"
          }
        },
        { status: 400 }
      );
    }

    // Check if expired
    if (redemption.offer.endAt < new Date()) {
      return NextResponse.json(
        { error: "This offer has expired" },
        { status: 400 }
      );
    }

    // Mark as redeemed and update analytics
    const updatedRedemption = await prisma.$transaction(async (tx) => {
      // Update redemption status
      const updated = await tx.redemption.update({
        where: { id: redemptionId },
        data: {
          status: "REDEEMED",
          redeemedAt: new Date(),
          verifiedBy: session.userId
        },
        include: {
          offer: true,
          student: {
            include: {
              user: true
            }
          }
        }
      });

      // Increment used count on offer
      await tx.offer.update({
        where: { id: offerId },
        data: {
          usedCount: { increment: 1 }
        }
      });

      // Create audit log
      await tx.auditLog.create({
        data: {
          actorId: session.userId,
          entity: "REDEMPTION",
          entityId: redemptionId,
          action: "QR_VERIFIED",
          meta: {
            offerId: offerId,
            merchantId: merchant.id,
            studentId: redemption.studentId,
            verifiedAt: new Date().toISOString()
          }
        }
      });

      return updated;
    });

    return NextResponse.json({
      success: true,
      message: "QR code verified successfully",
      redemption: {
        id: updatedRedemption.id,
        couponCode: updatedRedemption.couponCode,
        studentName: updatedRedemption.student.user.name || "Student",
        studentEmail: updatedRedemption.student.user.email,
        offerTitle: updatedRedemption.offer.title,
        discountPercent: updatedRedemption.offer.discountPercent,
        redeemedAt: updatedRedemption.redeemedAt,
        status: "VERIFIED"
      }
    });

  } catch (error) {
    console.error("QR verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify QR code" },
      { status: 500 }
    );
  }
}