import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LoginButtons from "./login-buttons";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect(next ?? "/");
  }

  const safeNext = next && next.startsWith("/") ? next : "/";

  return (
    <main className="flex-1 bg-orange-50/40">
      <header className="sticky top-0 z-10 bg-orange-500 shadow-sm">
        <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-3.5 sm:px-6 sm:py-4">
          <Link
            href="/"
            aria-label="홈으로 돌아가기"
            className="-ml-2 inline-flex size-9 items-center justify-center rounded-full text-white transition hover:bg-white/20 active:bg-white/30"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
              className="size-5"
            >
              <path
                fillRule="evenodd"
                d="M11.78 5.22a.75.75 0 010 1.06L8.06 10l3.72 3.72a.75.75 0 11-1.06 1.06l-4.25-4.25a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 0z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
          <h1 className="text-base font-semibold text-white sm:text-lg">
            로그인
          </h1>
        </div>
      </header>

      <section className="mx-auto max-w-md px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="text-5xl">🍠</span>
          <h2 className="text-2xl font-bold text-gray-900">고구마마켓</h2>
          <p className="text-sm text-gray-500 sm:text-base">
            소셜 계정으로 간편하게 시작하세요
          </p>
        </div>

        {error && (
          <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            로그인에 실패했어요: {error}
          </p>
        )}

        <div className="mt-8">
          <LoginButtons next={safeNext} />
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          로그인하면 이용약관과 개인정보처리방침에 동의한 것으로 간주됩니다.
        </p>
      </section>
    </main>
  );
}
