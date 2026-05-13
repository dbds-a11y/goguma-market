create type product_status as enum ('판매중', '예약중', '판매완료');

create table products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  price integer not null check (price >= 0),
  image_url text,
  seller_name text not null,
  status product_status not null default '판매중',
  created_at timestamptz not null default now()
);

create index products_created_at_idx on products (created_at desc);
create index products_status_idx on products (status);

alter table products enable row level security;

create policy "누구나 상품을 조회할 수 있다"
  on products for select
  using (true);
