# 고구마마켓

중고 물품을 사고팔 수 있는 웹 서비스.

## 기술 스택
- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (PostCSS 플러그인 `@tailwindcss/postcss`)
- Supabase — `@supabase/supabase-js`, `@supabase/ssr`
- 폰트: Geist Sans / Geist Mono (`next/font/google`)

## MCP
- Supabase MCP 연결됨 — DB 스키마 조회, 쿼리, 마이그레이션은 MCP 도구로 직접 수행

## 프로젝트 구조
- `app/` — App Router 페이지/레이아웃 (루트에 위치, `src/` 미사용)
  - `layout.tsx` — `<html lang="ko">`, 메타데이터, Geist 폰트 변수 주입
  - `globals.css` — Tailwind v4 진입점 (`@import "tailwindcss"`)
- `lib/supabase/` — Supabase 클라이언트 유틸
  - `client.ts` — **Client Component / 브라우저** 전용. `createClient()` 동기 호출
  - `server.ts` — **Server Component / Server Action / Route Handler** 전용. `await createClient()` (cookies API가 async)
  - `middleware.ts` — `updateSession()` 헬퍼 (Next 미들웨어용)
- `middleware.ts` (루트) — 모든 요청에서 Supabase 세션 자동 갱신
- 경로 별칭: `@/*` → 프로젝트 루트 (예: `@/lib/supabase/client`)
- 빌드 도구: webpack (`next dev --webpack`) — Next 16 기본값인 Turbopack은 이 환경(Windows)에서 OOM 크래시가 반복되어 webpack으로 고정

## 환경변수 (`.env.local`)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

예시는 `.env.local.example` 참고.

## 규칙
- 한국어 UI (`<html lang="ko">`)
- 가격은 원화(₩) — `₩10,000` 형태 (통화 기호 앞, 세 자리 콤마)
- 모바일 반응형 필수 — Tailwind의 `sm:` / `md:` 반응형 유틸 사용
- 색상 테마: 주황색 계열 (고구마 컨셉) — Tailwind 기본 `orange-*` 팔레트 (`text-orange-600` 등)
- 깔끔하고 모던한 스타일

## 주요 기능 (계획)
- 상품 목록 (메인 페이지)
- 상품 등록 / 상세 / 수정 / 삭제
- 소셜 로그인 (카카오 / 구글) — Supabase Auth OAuth
- 결제 — 토스페이먼츠

## 데이터베이스
아직 스키마 미정. Supabase MCP로 정의 예정.
