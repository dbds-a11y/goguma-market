"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type State =
  | { kind: "loading" }
  | { kind: "success"; orderId: string; amount: number; method?: string }
  | { kind: "error"; code?: string; message: string };

export default function PaymentSuccessPage() {
  const params = useSearchParams();
  const paymentKey = params.get("paymentKey");
  const orderId = params.get("orderId");
  const amountStr = params.get("amount");

  const missing = !paymentKey || !orderId || !amountStr;
  const [state, setState] = useState<State>(() =>
    missing
      ? { kind: "error", message: "필수 결제 정보가 누락되었어요" }
      : { kind: "loading" },
  );
  const confirmedRef = useRef(false);

  useEffect(() => {
    if (confirmedRef.current || missing) return;
    confirmedRef.current = true;

    const amount = Number(amountStr);

    (async () => {
      try {
        const res = await fetch("/api/payments/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentKey, orderId, amount }),
        });
        const data = await res.json();

        if (!res.ok) {
          setState({
            kind: "error",
            code: data?.code,
            message: data?.message ?? "결제 승인에 실패했어요",
          });
          return;
        }

        setState({
          kind: "success",
          orderId: data.orderId,
          amount: data.totalAmount ?? amount,
          method: data.method,
        });
      } catch (e) {
        setState({
          kind: "error",
          message: e instanceof Error ? e.message : "네트워크 오류",
        });
      }
    })();
  }, [paymentKey, orderId, amountStr, missing]);

  return (
    <main className="flex-1 bg-orange-50/40">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-6 px-4 py-16 text-center sm:py-24">
        {state.kind === "loading" && (
          <>
            <div className="size-12 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
            <p className="text-base font-semibold text-gray-800">
              결제를 승인하고 있어요...
            </p>
          </>
        )}

        {state.kind === "success" && (
          <>
            <div className="flex size-16 items-center justify-center rounded-full bg-orange-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                className="size-8 text-orange-600"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">결제 완료</h1>
              <p className="mt-2 text-sm text-gray-600">
                ₩{state.amount.toLocaleString("ko-KR")}
                {state.method ? ` · ${state.method}` : ""}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                주문번호 {state.orderId}
              </p>
            </div>
            <Link
              href="/"
              className="rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
            >
              메인으로
            </Link>
          </>
        )}

        {state.kind === "error" && (
          <>
            <div className="flex size-16 items-center justify-center rounded-full bg-red-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                className="size-8 text-red-600"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">결제 실패</h1>
              <p className="mt-2 text-sm text-gray-600">{state.message}</p>
              {state.code && (
                <p className="mt-1 text-xs text-gray-400">코드 {state.code}</p>
              )}
            </div>
            <Link
              href="/"
              className="rounded-full bg-gray-200 px-6 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-300"
            >
              메인으로
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
