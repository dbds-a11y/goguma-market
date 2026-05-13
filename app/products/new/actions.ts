"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ProductFormState } from "../_components/product-form";

export async function createProduct(
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const title = String(formData.get("title") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const imageUrl = String(formData.get("image_url") ?? "").trim();
  const sellerName = String(formData.get("seller_name") ?? "").trim();

  const values = {
    title,
    price: priceRaw,
    description,
    image_url: imageUrl,
    seller_name: sellerName,
  };

  const fieldErrors: NonNullable<ProductFormState["fieldErrors"]> = {};

  if (!title) {
    fieldErrors.title = "상품명을 입력해주세요";
  }

  const price = Number(priceRaw);
  if (!priceRaw) {
    fieldErrors.price = "가격을 입력해주세요";
  } else if (!Number.isFinite(price) || price < 0) {
    fieldErrors.price = "0 이상의 숫자를 입력해주세요";
  }

  if (!sellerName) {
    fieldErrors.seller_name = "판매자 이름을 입력해주세요";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, values };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("products").insert({
    title,
    price: Math.trunc(price),
    description: description || null,
    image_url: imageUrl || null,
    seller_name: sellerName,
  });

  if (error) {
    return { error: `등록에 실패했습니다: ${error.message}`, values };
  }

  revalidatePath("/");
  redirect("/");
}
