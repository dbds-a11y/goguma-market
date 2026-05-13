"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PaymentFailPage() {
  const params = useSearchParams();
  const code = params.get("code");
  const message = params.get("message") ?? "결제가 취소되었거나 실패했어요";

  return (
    <main className="flex-1 bg-orange-50/40">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-6 px-4 py-16 text-center sm:py-24">
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
              d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">결제 실패</h1>
          <p className="mt-2 text-sm text-gray-600">{message}</p>
          {code && (
            <p className="mt-1 text-xs text-gray-400">코드 {code}</p>
          )}
        </div>
        <Link
          href="/"
          className="rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
        >
          메인으로
        </Link>
      </div>
    </main>
  );
}
