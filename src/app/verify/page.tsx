"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyPage() {
  const token = useSearchParams().get("token");
  const [msg, setMsg] = useState("Verifying...");

  useEffect(() => {
    if (!token) return;

    fetch("/api/auth/verify", {
      method: "POST",
      body: JSON.stringify({ token }),
    })
      .then(res => res.json())
      .then(data => setMsg(data.message || data.error));
  }, [token]);

  return <p>{msg}</p>;
}
