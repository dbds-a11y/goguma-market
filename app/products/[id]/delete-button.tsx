"use client";

import { useTransition } from "react";
import { deleteProduct } from "./actions";

export default function DeleteButton({ productId }: { productId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm("정말 이 상품을 삭제하시겠어요?\n삭제하면 되돌릴 수 없습니다.")) {
      return;
    }
    startTransition(() => {
      deleteProduct(productId);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="-mr-1 inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-sm font-semibold text-white transition hover:bg-white/20 active:bg-white/30 disabled:cursor-not-allowed disabled:opacity-60 sm:px-3 sm:text-base"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
        className="size-4 sm:size-5"
      >
        <path
          fillRule="evenodd"
          d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482 41.03 41.03 0 0 0-2.357-.298V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
          clipRule="evenodd"
        />
      </svg>
      {isPending ? "삭제 중..." : "삭제"}
    </button>
  );
}
