"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ProductFormState } from "../../_components/product-form";

export async function updateProduct(
  productId: string,
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/products/${productId}/edit`);
  }

  const { data: existing } = await supabase
    .from("products")
    .select("user_id")
    .eq("id", productId)
    .maybeSingle();

  if (!existing) {
    return { error: "상품을 찾을 수 없습니다", values: undefined };
  }
  if (existing.user_id !== user.id) {
    return { error: "본인이 등록한 상품만 수정할 수 있습니다", values: undefined };
  }

  const title = String(formData.get("title") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const imageUrl = String(formData.get("image_url") ?? "").trim();

  const values = {
    title,
    price: priceRaw,
    description,
    image_url: imageUrl,
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

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, values };
  }

  const { error } = await supabase
    .from("products")
    .update({
      title,
      price: Math.trunc(price),
      description: description || null,
      image_url: imageUrl || null,
    })
    .eq("id", productId);

  if (error) {
    return { error: `수정에 실패했습니다: ${error.message}`, values };
  }

  revalidatePath("/");
  revalidatePath(`/products/${productId}`);
  redirect(`/products/${productId}`);
}
