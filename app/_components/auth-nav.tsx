import Link from "next/link";
import type { User } from "@supabase/supabase-js";

function displayName(user: User) {
  const meta = user.user_metadata as
    | { name?: string; full_name?: string; user_name?: string; preferred_username?: string }
    | undefined;
  return (
    meta?.name ??
    meta?.full_name ??
    meta?.user_name ??
    meta?.preferred_username ??
    user.email ??
    "사용자"
  );
}

export default function AuthNav({
  user,
  next = "/",
}: {
  user: User | null;
  next?: string;
}) {
  if (!user) {
    return (
      <Link
        href={`/login?next=${encodeURIComponent(next)}`}
        className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-orange-600 shadow-sm transition hover:bg-orange-50 active:scale-[0.98] sm:px-4 sm:py-2"
      >
        로그인
      </Link>
    );
  }

  const name = displayName(user);

  return (
    <div className="flex shrink-0 items-center gap-2">
      <span
        title={user.email ?? undefined}
        className="hidden max-w-[10rem] truncate text-sm font-medium text-white sm:block"
      >
        {name}
      </span>
      <form action="/auth/signout" method="post">
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-white/25 active:scale-[0.98] sm:px-3.5"
        >
          로그아웃
        </button>
      </form>
    </div>
  );
}
