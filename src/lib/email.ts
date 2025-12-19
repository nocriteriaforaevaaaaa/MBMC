import nodemailer from "nodemailer";

export async function sendVerificationEmail(email: string, token: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const link = `${process.env.APP_URL}/verify?token=${token}`;

  await transporter.sendMail({
    from: `EduPerks <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your student account",
    html: `
      <h2>Verify your EduPerks account</h2>
      <p>Click the link below to verify:</p>
      <a href="${link}">${link}</a>
      <p>This link expires in 24 hours.</p>
    `,
  });
}
