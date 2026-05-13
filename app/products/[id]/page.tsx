import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DeleteButton from "./delete-button";

type ProductStatus = "판매중" | "예약중" | "판매완료";

type Product = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  image_url: string | null;
  seller_name: string;
  status: ProductStatus;
  created_at: string;
};

const statusStyles: Record<Exclude<ProductStatus, "판매중">, string> = {
  예약중: "bg-yellow-100 text-yellow-800",
  판매완료: "bg-gray-200 text-gray-600",
};

function formatPrice(price: number) {
  return `₩${price.toLocaleString("ko-KR")}`;
}

function formatTimeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}일 전`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}개월 전`;
  return `${Math.floor(months / 12)}년 전`;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, title, description, price, image_url, seller_name, status, created_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const product = data as Product;
  const sold = product.status === "판매완료";

  return (
    <main className="flex-1 bg-orange-50/40 pb-24">
      <header className="sticky top-0 z-10 bg-orange-500 shadow-sm">
        <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-3.5 sm:px-6 sm:py-4">
          <Link
            href="/"
            aria-label="목록으로 돌아가기"
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
          <h1 className="flex-1 text-base font-semibold text-white sm:text-lg">
            고구마마켓
          </h1>
          <Link
            href={`/products/${product.id}/edit`}
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-sm font-semibold text-white transition hover:bg-white/20 active:bg-white/30 sm:px-3 sm:text-base"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
              className="size-4 sm:size-5"
            >
              <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
              <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
            </svg>
            수정
          </Link>
          <DeleteButton productId={product.id} />
        </div>
      </header>

      <article className="mx-auto max-w-3xl">
        <div className="relative aspect-square w-full bg-gray-100">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className={`object-cover ${sold ? "opacity-60 grayscale" : ""}`}
            />
          ) : null}
        </div>

        <div className="bg-white">
          <div className="flex items-center gap-3 border-b border-orange-100 px-4 py-4 sm:px-6">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-orange-100 text-base font-bold text-orange-600">
              {product.seller_name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900 sm:text-base">
                {product.seller_name}
              </p>
              <p className="text-xs text-gray-500 sm:text-sm">판매자</p>
            </div>
          </div>

          <div className="px-4 py-5 sm:px-6 sm:py-6">
            <div className="flex flex-wrap items-center gap-2">
              {product.status !== "판매중" && (
                <span
                  className={`rounded-md px-1.5 py-0.5 text-xs font-medium ${statusStyles[product.status]}`}
                >
                  {product.status}
                </span>
              )}
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                {product.title}
              </h2>
            </div>
            <p className="mt-1.5 text-xs text-gray-500 sm:text-sm">
              {formatTimeAgo(product.created_at)} 등록
            </p>

            {product.description && (
              <p className="mt-6 whitespace-pre-wrap text-sm leading-relaxed text-gray-800 sm:text-base">
                {product.description}
              </p>
            )}
          </div>
        </div>
      </article>

      <footer className="fixed inset-x-0 bottom-0 z-10 border-t border-orange-100 bg-white shadow-[0_-2px_8px_rgba(0,0,0,0.04)]">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
          <div>
            <p className="text-lg font-bold text-gray-900 sm:text-xl">
              {formatPrice(product.price)}
            </p>
            <p className="text-xs text-gray-500 sm:text-sm">
              {sold ? "판매완료된 상품입니다" : "가격 제안 가능"}
            </p>
          </div>
          <button
            type="button"
            disabled={sold}
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-300 sm:px-6 sm:py-3 sm:text-base"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
              className="size-4 sm:size-5"
            >
              <path d="M3.505 2.365A41.369 41.369 0 019 2c1.863 0 3.697.124 5.495.365 1.247.167 2.18 1.108 2.435 2.268a4.45 4.45 0 00-.577-.069 43.141 43.141 0 00-4.706 0C9.229 4.696 7.5 6.727 7.5 8.998v2.24c0 1.413.67 2.735 1.76 3.562l-2.98 2.98A.75.75 0 015 17.25v-3.443c-.501-.048-1-.106-1.495-.172C2.033 13.438 1 12.162 1 10.72V5.28c0-1.441 1.033-2.717 2.505-2.914z" />
              <path d="M14 6c-.762 0-1.52.02-2.271.062C10.157 6.148 9 7.472 9 8.998v2.24c0 1.519 1.147 2.839 2.71 2.935.214.013.428.024.642.034.2.009.385.09.518.224l2.35 2.35a.75.75 0 001.28-.531v-2.07c1.453-.195 2.5-1.463 2.5-2.915V8.998c0-1.526-1.157-2.85-2.729-2.936A41.645 41.645 0 0014 6z" />
            </svg>
            {sold ? "거래완료" : "채팅하기"}
          </button>
        </div>
      </footer>
    </main>
  );
}
