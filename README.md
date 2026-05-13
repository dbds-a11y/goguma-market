# 고구마마켓

중고 물품을 사고팔 수 있는 웹 서비스.

## 기술 스택
- Next.js (App Router) + TypeScript
- Supabase (DB / Auth)
- Tailwind CSS

## 시작하기

```bash
cp .env.local.example .env.local
# .env.local에 Supabase URL과 anon key를 채워넣으세요.

npm install
npm run dev
```

http://localhost:3000 에서 확인.

## 디렉토리
- `app/` — App Router 페이지/레이아웃
- `lib/supabase/` — Supabase 클라이언트 (`client.ts` 브라우저용, `server.ts` 서버용)
- `middleware.ts` — Supabase 세션 자동 갱신
