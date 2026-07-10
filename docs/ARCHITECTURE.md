# donutest — 아키텍처 계획

> 로그인 없이 30초만에 즐기고 공유하는 심리테스트 플랫폼. Next.js 16 풀스택 + shadcn/ui.
> 이 문서는 개발의 기준선(source of truth)입니다. 결정이 바뀌면 이 문서를 먼저 갱신합니다.

## 0. 확정된 결정 (2026-07-09)

| 항목 | 결정 | 비고 |
|---|---|---|
| 콘텐츠 저장 | **DB 기반 + 운영 어드민 UI** | 테스트/문항/선택지/결과를 DB에 저장, `/admin`에서 저작 |
| 렌더링 | **RSC + Cache Components(PPR)** | 공개 페이지는 서버 컴포넌트 + 태그 캐시. 어드민 편집 시 태그 재검증 |
| DB / 호스팅 | **Supabase (관리형 Postgres)** — 개발·운영 공용 | Drizzle+postgres.js로 직접 연결(Session pooler + `?sslmode=require`). 앱은 Docker standalone |
| ORM | **Drizzle** | SQL-first, 경량, Next 16 문서 예시와 정합 |
| 검증 | **zod** | 폼/액션 입력 검증 |

> ⚠️ Next.js 16은 학습 시점 이후 버전이라 규칙이 다릅니다. Next 코드 작성 전 항상 `node_modules/next/dist/docs/`의 해당 가이드를 확인합니다. (`AGENTS.md` 규칙)

## 1. 팀 관례 (project-pf-client-v2에서 계승)

- **스택**: Next 16 + React 19 (App Router), pnpm, Tailwind v4(JS config 없음, `app/globals.css`가 유일한 테마 소스), shadcn `new-york`/`neutral`/cssVariables, 통합 `radix-ui` 패키지, `lucide` 아이콘, TanStack Query + Form.
- **폴더 분리**: `app/` = 라우팅·조합만. 모든 로직은 `src/`. shadcn 원자 → `components/ui`, 조합 컴포넌트 → `src/components`, `cn()` → `lib/utils.ts`.
- **기능(section) 패턴**: `src/client/sections/<feature>/`
  - `*-container.tsx` — VM 훅 호출 + 로딩/에러 분기(공용 `LoadingView`/`DataErrorView`), 마크업 없음
  - `use-*-vm.ts` — 상태·라우팅·핸들러. `export type XVM = ReturnType<typeof useX>`
  - `views/*-view.tsx` — 순수 프레젠테이션(props로만 받음)
- **테마**: `globals.css`에 `@theme` 브랜드 팔레트(OKLCH, `rd-*` 프리픽스) + `@theme inline`으로 shadcn 시맨틱 매핑 + `:root`/`.dark` 계약.
- **배포**: 3-stage Dockerfile(standalone, non-root, `node:24`). `next.config.ts`에 `output: "standalone"` 필요.

### pf와 의도적으로 다른 점
- pf는 인증 앱이라 `rsc: false`(클라 우선). donutest는 **공개·SEO·바이럴이 핵심**이라 **`rsc: true` + 서버 컴포넌트 중심**으로 간다.

## 2. 현재 project-dt 의존성 정리

- **제거**: `@emotion/*`(Tailwind/shadcn과 충돌), `@tanstack/react-store`(Query와 중복), `@tanstack/react-virtual`(불필요), `zustand`(플로우 지역 상태는 `useReducer`로 충분).
- **추가**: `class-variance-authority`, `clsx`, `tailwind-merge`, `radix-ui`, `lucide-react`, `drizzle-orm`, `drizzle-kit`, `postgres`(드라이버), `zod`, `jose`(어드민 세션 서명).

## 3. 도메인 모델

채점은 **차원(dimension) 기반**으로 MBTI 축형/합산형을 모두 지원한다. 채점 로직은 `src/domain`의 **순수 함수**로 두어 서버/클라 어디서든 재사용·테스트한다.

> 전체 관계도: [ERD.md](./ERD.md) · 스키마 구현: `src/server/db/schema.ts`

콘텐츠(어드민 저작):
- **Test** `{ id, slug, title, description, category, coverImage, scoringType('axis'|'sum'), status('draft'|'published'), publishedAt, authorName }`
- **Question** `{ id, testId, order, text, groupKey? }`
- **Choice** `{ id, questionId, order, label, scores: Record<DimensionKey, number> }`
- **ResultCard** `{ id, testId, code, title, subtitle, description, image, traits: string[], recommendedSlugs: string[] }`
- 결과 결정: `axis`(MBTI 4축 부호 합 → 코드) 또는 `sum`(최고점 유형)
  - 채점 엔진: `src/domain/scoring.ts`(순수 함수) + 축 정의 `src/domain/mbti.ts`(`MBTI_AXES`). 단위 테스트 `src/domain/scoring.test.ts`(`pnpm test`).
  - **axis(MBTI)**: 선택지 `scores`는 축 키(`energy`/`information`/`decisions`/`lifestyle`)에 **부호 점수**(2문항 ±1, 4문항 ±1/±0.5). 축별 합 `>0`→앞글자 · `<0`→뒷글자 · `=0`→앞글자(E/S/T/J), 4축 순서로 이어 MBTI 코드. 축이 표준 고정이라 별도 DB 컬럼 불필요.
- **TestSet** `{ id, slug, title, description }` + 조인 테이블 **TestSetItem** `{ testSetId, testId, order }` — 운영자 큐레이션(참조 무결성 + 순서 보장)

통계:
- **Attempt** `{ id, testId, resultCode, createdAt, referrer, channel }` — 완료 1건 = 1행 → "최근 7일 인기", "테스트별 응시자 수", "유입 채널 비중" 집계 원천.

어드민 인증(구현됨):
- **AdminUser** `{ id, username, passwordHash, createdAt }` — 로그인은 **아이디(username)+비밀번호**. 비밀번호는 **argon2id**(`@node-rs/argon2`) 해시.
- **세션**: `jose` HS256 JWT(8h) → `httpOnly` 쿠키(`dt_admin_session`). 서명키는 `ADMIN_SESSION_SECRET`(.env).
- **게이트**: `proxy.ts`(Next 16 규칙, 구 middleware)가 `/admin/*` 보호 — JWT만 검증(Edge 호환). 비밀번호 검증(argon2)은 서버 액션(Node)에서만.
- **최초 계정 주입**: `pnpm db:seed:admin`(자격증명은 `ADMIN_USERNAME`/`ADMIN_PASSWORD` env). 초기 `email` 컬럼은 `username`으로 정합화됨.

## 4. 라우팅 맵

```
app/
├── layout.tsx                     # 폰트·GA·QueryProvider·전역 셸
├── page.tsx                       # 메인: 배너 + 최신/인기/추천세트 + 검색 진입
├── opengraph-image.tsx            # 사이트 기본 OG
├── t/[slug]/
│   ├── page.tsx                   # 테스트 소개(시작하기) — generateStaticParams
│   ├── opengraph-image.tsx        # 테스트별 OG
│   ├── play/page.tsx              # 이름입력 → 문항 → 채점(클라 상태머신)
│   └── r/[code]/
│       ├── page.tsx               # 결과(공유·다운로드) — 정적 생성
│       └── opengraph-image.tsx    # 결과 카드 OG (바이럴 핵심)
├── sets/[slug]/page.tsx           # 추천 테스트 세트
├── search/page.tsx                # 검색 결과
├── admin/                         # 운영 어드민(미들웨어 보호)
│   ├── login/page.tsx
│   ├── tests/…                    # 테스트 CRUD (문항·선택지·결과 편집)
│   └── sets/…                     # 세트 큐레이션
└── api/
    ├── search/route.ts            # 검색(클라 페칭)
    └── admin/…                    # 필요 시 어드민 전용 핸들러
```

## 5. 렌더링 & 데이터 전략 (Next 16 Cache Components)

`next.config.ts`에 `cacheComponents: true` + `output: "standalone"`.

- **공개 읽기 페이지 = 서버 컴포넌트**가 Drizzle로 Postgres를 직접 조회. 조회 함수는 `src/server/db/queries/*`에 두고 `use cache`로 캐시 + 엔티티별 태그:
  - `getPublishedTests()` → `'use cache'`, `cacheTag('tests')`, `cacheLife('hours')`
  - `getTestBySlug(slug)` → `cacheTag('test:'+slug)`, `cacheLife('days')`
  - `getResultCard(slug, code)` → `cacheTag('test:'+slug)`
  - 인기 목록은 자주 변하므로 별도 집계 함수 + 짧은 `cacheLife('hours')`.
- **어드민 변경(Server Action)** → `updateTag('test:'+slug)` + `updateTag('tests')`로 즉시 만료(운영자는 자기 변경을 바로 확인).
- **응시 기록**: `recordAttempt` Server Action이 Attempt 1행 기록. 매 응시마다 테스트 캐시를 무효화하지 않고, 인기 집계는 짧은 `cacheLife`로 갱신(캐시 스래싱 방지).
- **정적화**: `generateStaticParams`로 published 슬러그·결과 코드 프리렌더.
- **런타임 API 주의**: `params`/`searchParams`/`cookies`/`headers`는 Promise → await, 캐시 밖(또는 `<Suspense>`)에서 접근.
- **클라이언트 컴포넌트**는 상호작용에만: 테스트 진행 플로우(상태머신), 검색 자동완성(TanStack Query → `/api/search`), 공유 버튼.

## 6. 테스트 진행 플로우

`src/client/sections/test-play`의 VM 훅이 `useReducer`로 스텝 머신 관리:

```
intro → name → question(n) → scoring(2~3s 애니메이션) → redirect(/t/[slug]/r/[code])
```

- 답변·진행률은 플로우 지역 상태(전역 스토어 불필요).
- 채점은 `src/domain`의 순수 함수로 로컬 계산 → 결과 코드.
- 동시에 `recordAttempt` 호출(비차단, 유입 채널 포함).
- 결과는 공유 가능한 정적 URL로 이동.

## 7. 공유 & OG 이미지 (바이럴 엔진)

- 결과 페이지마다 `opengraph-image.tsx`로 **동적 결과 카드 이미지** 생성 → 카톡/인스타/X 공유 시 자동 미리보기.
- "이미지 다운로드"는 동일 OG 렌더러 재사용 또는 클라 `html-to-image`.
- 공유 링크에 `?ref=kakao` 등 채널 파라미터 → 유입 추적.

## 8. 애널리틱스

- **GA4** 루트 레이아웃 주입 + 퍼널 이벤트(`test_start`, `question_answered`, `test_complete`, `result_shared`).
- 자체 Attempt 테이블로 인기 순위·채널 비중을 서버에서 직접 집계(운영 대시보드 여지).

## 9. 배포

- **앱**: Docker standalone(자가호스팅 VM 등). pf의 Dockerfile 재사용 + `output: "standalone"`.
- **DB**: **Supabase 관리형 Postgres**(백업·커넥션 풀러 제공). 앱은 `DATABASE_URL`(Session pooler, `?sslmode=require`)로 직접 연결. 로컬 Docker PG는 오프라인 폴백(선택).
- 앱 컨테이너 ↔ DB 컨테이너 네트워크 연결, 환경변수로 `DATABASE_URL`·어드민 세션 시크릿·GA ID 주입.

## 10. 단계별 로드맵

1. **기반 정리** — 의존성 정리, shadcn 초기화, `globals.css` 도넛 브랜드 토큰, 폰트, QueryProvider, 폴더 스캐폴딩, 보일러플레이트 제거, `next.config.ts`(cacheComponents/standalone).
2. **DB & 도메인** — Drizzle 스키마 + 마이그레이션, 채점 엔진(`src/domain`) + zod, 시드 테스트 1개.
3. **테스트 플로우** — intro → name → questions → scoring → result (section 패턴).
4. **결과 공유** — OG 이미지, 다운로드, 공유 링크.
5. **메인 페이지** — 배너, 최신/인기/추천세트, 검색.
6. **어드민** — 세션 인증, 테스트/세트 CRUD, 태그 재검증.
7. **통계 & 배포** — Attempt 집계, GA4, 앱 컨테이너 배포(+ Supabase DB), OG 검증.
```
