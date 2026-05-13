"use client";

import Link from "next/link";
import { useActionState } from "react";

export type ProductFormValues = {
  title: string;
  price: string;
  description: string;
  image_url: string;
};

export type ProductFormState = {
  error?: string;
  fieldErrors?: {
    title?: string;
    price?: string;
  };
  values?: ProductFormValues;
};

export type ProductFormAction = (
  prev: ProductFormState,
  formData: FormData,
) => Promise<ProductFormState>;

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200 sm:text-base";

const errorClass = "border-red-300 focus:border-red-400 focus:ring-red-100";

type ProductFormProps = {
  action: ProductFormAction;
  defaultValues?: ProductFormValues;
  submitLabel: string;
  pendingLabel: string;
  cancelHref: string;
};

export default function ProductForm({
  action,
  defaultValues,
  submitLabel,
  pendingLabel,
  cancelHref,
}: ProductFormProps) {
  const [state, formAction, isPending] = useActionState(action, {});
  const values = state.values ?? defaultValues;
  const fieldErrors = state.fieldErrors;

  return (
    <form action={formAction} className="space-y-5 pb-24">
      {state.error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.error}
        </div>
      )}

      <div className="space-y-1.5">
        <label
          htmlFor="title"
          className="block text-sm font-semibold text-gray-800"
        >
          상품명 <span className="text-orange-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={120}
          defaultValue={values?.title}
          placeholder="예) 아이폰 14 Pro 256GB 딥퍼플"
          className={`${inputClass} ${fieldErrors?.title ? errorClass : ""}`}
        />
        {fieldErrors?.title && (
          <p className="text-xs text-red-600">{fieldErrors.title}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="price"
          className="block text-sm font-semibold text-gray-800"
        >
          가격 <span className="text-orange-500">*</span>
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 sm:text-base">
            ₩
          </span>
          <input
            id="price"
            name="price"
            type="number"
            min={0}
            step={1}
            required
            inputMode="numeric"
            defaultValue={values?.price}
            placeholder="0"
            className={`${inputClass} pl-8 ${fieldErrors?.price ? errorClass : ""}`}
          />
        </div>
        {fieldErrors?.price && (
          <p className="text-xs text-red-600">{fieldErrors.price}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="description"
          className="block text-sm font-semibold text-gray-800"
        >
          상품 설명
        </label>
        <textarea
          id="description"
          name="description"
          rows={6}
          maxLength={2000}
          defaultValue={values?.description}
          placeholder="상품의 상태, 구매 시점, 거래 방식 등을 자세히 적어주세요."
          className={`${inputClass} resize-y`}
        />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="image_url"
          className="block text-sm font-semibold text-gray-800"
        >
          이미지 URL
        </label>
        <input
          id="image_url"
          name="image_url"
          type="url"
          defaultValue={values?.image_url}
          placeholder="https://..."
          className={inputClass}
        />
        <p className="text-xs text-gray-500">
          비워두면 이미지 없이 저장됩니다.
        </p>
      </div>

      <footer className="fixed inset-x-0 bottom-0 z-10 border-t border-orange-100 bg-white shadow-[0_-2px_8px_rgba(0,0,0,0.04)]">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <Link
            href={cancelHref}
            className="flex-1 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50 sm:py-3 sm:text-base"
          >
            취소
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-orange-300 sm:py-3 sm:text-base"
          >
            {isPending ? pendingLabel : submitLabel}
          </button>
        </div>
      </footer>
    </form>
  );
}
