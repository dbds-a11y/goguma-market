"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Provider = "google" | "kakao";

export default function LoginButtons({ next }: { next: string }) {
  const [loading, setLoading] = useState<Provider | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function signIn(provider: Provider) {
    if (loading) return;
    setLoading(provider);
    setError(null);

    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo },
    });

    if (error) {
      setError(error.message);
      setLoading(null);
    }
    // 성공 시 OAuth 제공자 페이지로 리다이렉트되어 setLoading(null) 불필요
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => signIn("kakao")}
        disabled={loading !== null}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FEE500] px-4 py-3 text-sm font-semibold text-[#000000] shadow-sm transition hover:brightness-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="size-5"
          fill="currentColor"
        >
          <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.79 1.85 5.23 4.62 6.62l-.95 3.48a.4.4 0 0 0 .6.44l4.13-2.72c.53.07 1.06.11 1.6.11 5.523 0 10-3.477 10-7.93C22 6.477 17.523 3 12 3Z" />
        </svg>
        {loading === "kakao" ? "카카오 연결 중..." : "카카오로 시작하기"}
      </button>

      <button
        type="button"
        onClick={() => signIn("google")}
        disabled={loading !== null}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          aria-hidden="true"
          className="size-5"
        >
          <path
            fill="#FFC107"
            d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
          />
          <path
            fill="#FF3D00"
            d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
          />
          <path
            fill="#4CAF50"
            d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
          />
          <path
            fill="#1976D2"
            d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
          />
        </svg>
        {loading === "google" ? "구글 연결 중..." : "구글로 시작하기"}
      </button>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
