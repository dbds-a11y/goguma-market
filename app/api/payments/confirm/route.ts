import { NextResponse } from "next/server";

type ConfirmBody = {
  paymentKey?: string;
  orderId?: string;
  amount?: number;
};

export async function POST(request: Request) {
  const { paymentKey, orderId, amount } = (await request.json()) as ConfirmBody;

  if (!paymentKey || !orderId || typeof amount !== "number") {
    return NextResponse.json(
      { code: "BAD_REQUEST", message: "paymentKey, orderId, amount는 필수입니다" },
      { status: 400 },
    );
  }

  const secretKey = process.env.TOSS_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { code: "SERVER_MISCONFIGURED", message: "TOSS_SECRET_KEY 미설정" },
      { status: 500 },
    );
  }

  const auth = Buffer.from(`${secretKey}:`).toString("base64");

  const res = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ paymentKey, orderId, amount }),
    cache: "no-store",
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
