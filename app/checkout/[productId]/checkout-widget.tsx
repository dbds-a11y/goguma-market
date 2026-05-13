"use client";

import {
  loadTossPayments,
  type TossPaymentsWidgets,
} from "@tosspayments/tosspayments-sdk";
import { useEffect, useRef, useState } from "react";

const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!;

export default function CheckoutWidget({
  productId,
  orderName,
  amount,
  customerKey,
  customerEmail,
}: {
  productId: string;
  orderName: string;
  amount: number;
  customerKey: string;
  customerEmail?: string;
}) {
  const widgetsRef = useRef<TossPaymentsWidgets | null>(null);
  const [ready, setReady] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let canceled = false;

    (async () => {
      try {
        const tossPayments = await loadTossPayments(clientKey);
        if (canceled) return;

        const widgets = tossPayments.widgets({ customerKey });
        widgetsRef.current = widgets;

        await widgets.setAmount({ currency: "KRW", value: amount });

        await Promise.all([
          widgets.renderPaymentMethods({
            selector: "#payment-method",
            variantKey: "DEFAULT",
          }),
          widgets.renderAgreement({
            selector: "#agreement",
            variantKey: "AGREEMENT",
          }),
        ]);

        if (!canceled) setReady(true);
      } catch (e) {
        if (!canceled) {
          setError(e instanceof Error ? e.message : "위젯을 불러오지 못했어요");
        }
      }
    })();

    return () => {
      canceled = true;
    };
  }, [amount, customerKey]);

  async function handlePay() {
    const widgets = widgetsRef.current;
    if (!widgets || paying) return;
    setPaying(true);
    setError(null);

    const orderId = `order_${productId}_${Date.now()}_${crypto
      .randomUUID()
      .slice(0, 8)}`;

    try {
      await widgets.requestPayment({
        orderId,
        orderName,
        successUrl: `${window.location.origin}/payments/success`,
        failUrl: `${window.location.origin}/payments/fail`,
        customerEmail,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "결제 요청에 실패했어요");
      setPaying(false);
    }
  }

  return (
    <section className="mx-auto max-w-3xl">
      <div id="payment-method" className="mt-4 bg-white sm:rounded-lg" />
      <div id="agreement" className="mt-2 bg-white sm:rounded-lg" />

      {error && (
        <p className="mx-4 mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 sm:mx-0">
          {error}
        </p>
      )}

      <footer className="fixed inset-x-0 bottom-0 z-10 border-t border-orange-100 bg-white shadow-[0_-2px_8px_rgba(0,0,0,0.04)]">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
          <div>
            <p className="text-xs text-gray-500 sm:text-sm">결제 금액</p>
            <p className="text-lg font-bold text-gray-900 sm:text-xl">
              ₩{amount.toLocaleString("ko-KR")}
            </p>
          </div>
          <button
            type="button"
            onClick={handlePay}
            disabled={!ready || paying}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-300 sm:px-8 sm:text-base"
          >
            {paying ? "결제창 여는 중..." : ready ? "결제하기" : "준비 중..."}
          </button>
        </div>
      </footer>
    </section>
  );
}
