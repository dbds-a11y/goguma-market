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
  user_id: string | null;
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

  const [{ data, error }, { data: userData }] = await Promise.all([
    supabase
      .from("products")
      .select(
        "id, title, description, price, image_url, seller_name, status, created_at, user_id",
      )
      .eq("id", id)
      .maybeSingle(),
    supabase.auth.getUser(),
  ]);

  if (error || !data) {
    notFound();
  }

  const product = data as Product;
  const sold = product.status === "판매완료";
  const isOwner = userData.user?.id != null && userData.user.id === product.user_id;

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
          {isOwner && (
            <>
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
            </>
          )}
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
          {sold ? (
            <button
              type="button"
              disabled
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-gray-300 px-5 py-2.5 text-sm font-semibold text-white sm:px-6 sm:py-3 sm:text-base"
            >
              거래완료
            </button>
          ) : (
            <Link
              href={`/checkout/${product.id}`}
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 active:scale-[0.98] sm:px-6 sm:py-3 sm:text-base"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                className="size-4 sm:size-5"
              >
                <path d="M1 1.75A.75.75 0 0 1 1.75 1h1.628a1.75 1.75 0 0 1 1.734 1.51L5.18 3a65.25 65.25 0 0 1 13.36 1.412.75.75 0 0 1 .58.875 48.645 48.645 0 0 1-1.618 6.2.75.75 0 0 1-.712.513H6a2.503 2.503 0 0 0-2.292 1.5H17.25a.75.75 0 0 1 0 1.5H2.76a.75.75 0 0 1-.748-.807 4.002 4.002 0 0 1 2.716-3.486L3.626 2.716a.25.25 0 0 0-.248-.216H1.75A.75.75 0 0 1 1 1.75ZM6 17.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM17 17.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
              </svg>
              구매하기
            </Link>
          )}
        </div>
      </footer>
    </main>
  );
}
