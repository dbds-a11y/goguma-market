export type ProductStatus = "판매중" | "예약중" | "판매완료";

export type Product = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  image_url: string | null;
  seller_name: string;
  status: ProductStatus;
  created_at: string;
};

export type ProductInsert = {
  title: string;
  description?: string | null;
  price: number;
  image_url?: string | null;
  seller_name: string;
  status?: ProductStatus;
};
