import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AuthNav from "./_components/auth-nav";
import ProductList, { type Product } from "./_components/product-list";

export default async function Home() {
  const supabase = await createClient();

  const [{ data: userData }, { data, error }] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from("products")
      .select(
        "id, title, description, price, image_url, seller_name, status, created_at",
      )
      .order("created_at", { ascending: false }),
  ]);

  const user = userData.user;
  const products = (data ?? []) as Product[];
  const newProductHref = user ? "/products/new" : "/login?next=/products/new";

  return (
    <main className="flex-1 bg-orange-50/40">
      <header className="sticky top-0 z-10 bg-orange-500 shadow-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6 sm:py-4">
          <h1 className="text-xl font-bold text-white sm:text-2xl">
            고구마마켓
          </h1>
          <div className="flex items-center gap-2">
            <Link
              href={newProductHref}
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
            </Link>
            <AuthNav user={user} next="/" />
          </div>
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
          <ProductList products={products} />
        )}
      </section>
    </main>
  );
}
