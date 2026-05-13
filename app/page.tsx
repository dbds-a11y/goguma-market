import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

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

export default async function Home() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, title, description, price, image_url, seller_name, status, created_at",
    )
    .order("created_at", { ascending: false });

  const products = (data ?? []) as Product[];

  return (
    <main className="flex-1 bg-orange-50/40">
      <header className="sticky top-0 z-10 bg-orange-500 shadow-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 sm:py-4">
          <h1 className="text-xl font-bold text-white sm:text-2xl">
            고구마마켓
          </h1>
          <button
            type="button"
            className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-orange-600 shadow-sm transition hover:bg-orange-50 active:scale-[0.98] sm:px-4 sm:py-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
              className="size-4 sm:size-5"
            >
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
            상품 등록
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-4 py-5 sm:px-6 sm:py-6">
        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            상품을 불러오지 못했습니다: {error.message}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-orange-200 bg-white px-6 py-20 text-center">
            <p className="text-base text-gray-500 sm:text-lg">
              등록된 상품이 없습니다
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-orange-100 overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">
            {products.map((product) => {
              const sold = product.status === "판매완료";
              return (
                <li key={product.id}>
                  <a
                    href="#"
                    className="flex gap-3 p-3 transition hover:bg-orange-50/70 active:bg-orange-100/60 sm:gap-4 sm:p-4"
                  >
                    <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:size-28">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.title}
                          fill
                          sizes="(max-width: 640px) 96px, 112px"
                          className={`object-cover ${sold ? "opacity-60 grayscale" : ""}`}
                        />
                      ) : null}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-1 py-0.5">
                      <div className="min-w-0">
                        <h3 className="line-clamp-2 text-sm font-medium text-gray-900 sm:text-base">
                          {product.title}
                        </h3>
                        <p className="mt-1 line-clamp-1 text-xs text-gray-500 sm:text-sm">
                          {product.seller_name} · {formatTimeAgo(product.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {product.status !== "판매중" && (
                          <span
                            className={`rounded-md px-1.5 py-0.5 text-xs font-medium ${statusStyles[product.status]}`}
                          >
                            {product.status}
                          </span>
                        )}
                        <p className="text-sm font-bold text-gray-900 sm:text-base">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
