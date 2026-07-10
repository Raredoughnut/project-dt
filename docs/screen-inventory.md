# donutest — 화면 인벤토리 (디자인 ↔ 개발 핸드오프)

> 목적: 백엔드(개발)와 화면(디자인)을 **병렬**로 진행하기 위한 화면 목록 · 상태 · 데이터 계약 정리.
> 기준선: [ARCHITECTURE.md](./ARCHITECTURE.md) §4 라우팅 맵 · §6 플로우 · §10 로드맵, 스키마 `src/server/db/schema.ts`.
> 결정이 바뀌면 ARCHITECTURE.md를 먼저 갱신하고 이 문서를 맞춘다.

## 0. 디자이너 ↔ 개발 경계 (읽고 시작)

`section` 패턴이 경계를 만든다 (ARCHITECTURE §1):

| 레이어 | 파일 | 담당 |
|---|---|---|
| **프레젠테이션** | `src/client/sections/<feature>/views/*-view.tsx` | **디자이너** — props만 받아 그림. 토큰/컴포넌트/상태/반응형 |
| 상태·핸들러 | `use-*-vm.ts` (`useReducer`·라우팅·이벤트) | 개발 |
| 데이터·조합 | `*-container.tsx` + 서버 컴포넌트(Drizzle `use cache`) | 개발 |
| **계약(접점)** | 뷰가 받는 **props 타입** (아래 각 화면 "데이터") | **함께 합의** |

- **데이터 계약은 이미 존재**: 스키마 추론 타입(`Test`/`Question`/`Choice`/`ResultCard`/`TestSet`/`Attempt`, `src/server/db/schema.ts`)이 원천. 뷰에 넘어가는 조합 DTO(예: `TestPlayData`, `ResultView`)만 추가 합의하면 된다.
- 디자이너는 **타입 맞춘 목업 픽스처**로 뷰를 완성 → 개발이 실제 데이터 주입. 서로 안 기다림.
- 디자이너는 서버/캐시(`use cache`·`cacheTag`)·라우팅·어드민 로직에 손대지 않는다.

## 1. 범례

- **렌더**: `RSC`(서버 컴포넌트, 정적/캐시) · `Client`(상호작용) · `OG`(이미지 생성)
- **P0** = 핵심 플로우(로드맵 3–4, 먼저 착수) · **P1** = 발견/어드민(로드맵 5–6) · **P2** = 이후
- 우선순위·경로는 ARCHITECTURE 기준.

---

## 2. 공개 · 핵심 플로우 (P0)

```
/t/[slug]  (소개) → /t/[slug]/play  (이름→문항→채점) → /t/[slug]/r/[code]  (결과·공유)
```

### S1. 테스트 소개 — `/t/[slug]` · RSC
- **목적:** 대표 이미지 + 제목/설명으로 흥미 유발, "테스트 시작하기".
- **콘텐츠:** 커버 이미지, 제목, 설명, 작성자, (선택)누적 응시수, 시작 CTA, 공유 버튼, (하단)추천/광고 슬롯.
- **데이터:** `Test` (+ 파생 `attemptCount?`). 뷰 props: `{ test: Test, stats?: { attempts: number } }`.
- **상태:** 기본 / `status='draft'`→공개 404 / slug 없음→404 / 이미지 로딩·폴백.
- **뷰:** `sections/test-intro/views/test-intro-view.tsx`. **비고:** 커버 = OG base·광고 크리에이티브. 첫 화면 LCP 중요(이미지 최적화).

### S2. 테스트 진행 — `/t/[slug]/play` · Client 상태머신
`useReducer` 스텝: **name → question(n) → scoring**(2~3s) → `redirect(/t/[slug]/r/[code])`. (ARCHITECTURE §6)
하나의 라우트, 3개 하위 화면 상태를 디자이너가 모두 그린다.

- **S2a. 이름 입력 (name):** 닉네임 입력(≤12자), 안내문(문항 수/방식), 시작. 개인화 훅.
- **S2b. 문항 (question):** 진행률(막대+텍스트+스텝닷), 문항 텍스트, 선택지 2~4개(선택 즉시 자동 다음), 선택지 위치 교차. `groupKey`로 영역 라벨 표시 가능.
- **S2c. 채점 연출 (scoring):** 2~3초 도넛 굽기/채점 애니메이션(기대감 + 광고 노출).
- **데이터:** 뷰 props `TestPlayData = { test: Test, questions: (Question & { choices: Choice[] })[] }`. 채점은 `src/domain` 순수함수(개발) → `resultCode`.
- **상태:** 입력 검증(빈 닉네임) / 뒤로가기·중도이탈 / 마지막 문항 → scoring 전환 / 접근성(키보드·포커스).
- **뷰:** `sections/test-play/views/{name,question,scoring}-view.tsx`. **비고:** 답변·진행률 = 지역 상태. 이벤트: `test_start`·`question_answered`·`test_complete`.

### S3. 결과 — `/t/[slug]/r/[code]` · RSC(정적 생성)
- **목적:** **시그니처 결과 카드 = 도넛 영양성분표**([[donutest 디자인 시스템]] §시그니처). 저장·공유로 바이럴.
- **콘텐츠:** 결과 카드(닉네임 각인, 나를 닮은 도넛(파라메트릭 SVG), 지표/성분, traits, 해설), **이미지 저장**, **공유(Web Share)**, **추천 테스트**, 다시하기, 광고 슬롯.
- **데이터:** 뷰 props `ResultView = { test: Test, result: ResultCard, recommended: Test[] }` + 클라 전달 `nickname`(URL/state). `result.traits`, `result.recommendedSlugs`.
- **상태:** 기본 / 잘못된 `code`→폴백 or 404 / 닉네임 없음(직접 URL 진입) 기본값 / 이미지 저장 실패 토스트.
- **뷰:** `sections/test-result/views/test-result-view.tsx` + `components/nutrition-card`, `components/donut`(파라메트릭). **비고:** 카드가 곧 OG(S9)와 동일 레이아웃 — 컴포넌트 공유 지향.

---

## 3. 공개 · 발견 (P1)

### S4. 메인 — `/` · RSC(+ 일부 Client)
- **콘텐츠(다층 큐레이션):** 브랜드 배너/기획전 캐러셀 · **최신** · **주간 인기 TOP N** · **추천 세트** · 검색 진입 · (선택)실시간 참여수. (심심테스트·푸망 벤치마크)
- **데이터:** `{ latest: Test[], popular: Test[], sets: TestSet[] }`. 인기 = Attempt 집계(개발).
- **상태:** 섹션별 빈 상태 / 스켈레톤 로딩 / 이미지 폴백.
- **뷰:** `sections/home/views/home-view.tsx` + `components/test-card`, `section-header`, `test-carousel`.

### S5. 검색 — `/search` · Client 페칭
- **콘텐츠:** 검색 입력(자동완성, TanStack Query→`/api/search`), 결과 그리드, 최근/인기 키워드(선택).
- **데이터:** `Test[]`(쿼리 결과). 상태: 입력 전 / 로딩 / **빈 결과** / 에러.
- **뷰:** `sections/search/views/search-view.tsx`.

### S6. 추천 세트 — `/sets/[slug]` · RSC
- **콘텐츠:** 세트 타이틀/설명 + 포함 테스트 목록(순서).
- **데이터:** `{ set: TestSet, tests: Test[] }` (TestSetItem.order 순).
- **상태:** 기본 / 빈 세트 / 404.
- **뷰:** `sections/test-set/views/test-set-view.tsx` (S4의 `test-card` 재사용).

---

## 4. OG 이미지 (바이럴 엔진 · 디자인 템플릿) — OG

| ID | 파일 | 용도 | 데이터 | 우선 |
|---|---|---|---|---|
| S7 | `app/opengraph-image.tsx` | 사이트 기본 OG | 브랜드 로고/문구 | P1 |
| S8 | `app/t/[slug]/opengraph-image.tsx` | 테스트별 OG | `Test`(커버·제목) | P1 |
| **S9** | `app/t/[slug]/r/[code]/opengraph-image.tsx` | **결과 카드 OG(핵심)** | `ResultCard`(+닉네임) | **P0** |

- **디자이너 역할:** OG 레이아웃(=결과 카드 톤) 디자인. `@vercel/og`(satori)는 **CSS 제약**(flin/flex 위주, 일부 속성 미지원) → S3 결과 카드와 **동일 비주얼을 OG 제약 안에서** 재현하는 사양 필요. S3 ↔ S9 컴포넌트/토큰 공유 지향.

---

## 5. 어드민 (P1–P2, `proxy.ts` 보호)

> 비개발자 저작 도구. 공개 UI만큼 화려할 필요 없이 **명료·효율**. shadcn 폼/테이블 활용.

| ID | 경로 | 화면 | 데이터 | 우선 |
|---|---|---|---|---|
| A1 | `/admin/login` | 로그인(아이디/비번, argon2 + jose 세션) ✅구현 | `AdminUser` | P1 |
| A2 | `/admin` | 대시보드(개요 지표) ✅구현 · 테스트 목록·상태·응시 요약은 다음 단계 | `Test[]`, 집계 | P1 |
| A3 | `/admin/tests` | 테스트 목록(검색·상태 필터·신규) | `Test[]` | P1 |
| A4 | `/admin/tests/[id]` | **테스트 편집(복합)**: 메타 · 문항/선택지(점수맵) · 결과카드 · 발행 | `Test`+`Question[]`+`Choice[]`+`ResultCard[]` | P1 |
| A5 | `/admin/sets` | 세트 큐레이션(생성·항목 순서 편집) | `TestSet`+`TestSetItem[]` | P2 |

- **A4가 가장 무거움**: 문항·선택지·점수맵(`scores: Record<dim,number>`)·결과 매핑 편집 UX가 핵심. 별도 상세 설계 권장.

---

## 6. 전역 · 공유 (Cross-cutting)

| ID | 항목 | 내용 |
|---|---|---|
| G1 | 전역 셸 | `app/layout.tsx` 헤더(로고)·(선택)푸터·광고 슬롯 컨테이너 |
| G2 | 로딩 | 공용 `LoadingView`(스피너) · 섹션 스켈레톤 |
| G3 | 에러 | 공용 `DataErrorView` · `error.tsx` |
| G4 | 빈 상태 | 검색/세트/목록 empty state |
| G5 | 404 | `not-found.tsx`(비발행·없는 slug) |
| G6 | 토스트/모달 | 저장 완료, 공유 복사, 이미지 저장 모달 |

### 공유 UI 컴포넌트(디자인 시스템 원자/분자)
`Button`(존재) · `TestCard`(썸네일) · `SectionHeader` · `TestCarousel` · `ProgressBar`+`StepDots` · `ChoiceButton` · **`Donut`(파라메트릭 SVG)** · **`NutritionCard`(결과)** · `ShareBar` · `AdSlot` · `Logo`(4종 완료).

---

## 7. 데이터 → 화면 매핑 (요약)

| 엔티티 | 사용 화면 |
|---|---|
| `Test` | S1·S2·S3·S4·S5·S6·S8·A3·A4 |
| `Question`+`Choice` | S2·A4 |
| `ResultCard` | S3·S9·A4 |
| `TestSet`+`Item` | S4·S6·A5 |
| `Attempt`(집계) | S4(인기)·A2 |
| `AdminUser` | A1 |

---

## 8. 완료 기준 (Design DoD)

- 색·간격·타이포 = **토큰만** (하드코딩 색 금지). primary=딸기, 폰트=Pretendard/헤드라인 SUIT.
- **상태 4종**(기본/로딩/빈/에러) 포함, 모바일 우선 반응형(핵심 타깃 = 모바일).
- 기본 접근성(대비·키보드·포커스·라벨). primary 위 텍스트는 `dark` 단계.
- 뷰는 **props로만** 데이터 수신(서버/캐시 비의존), 목업 픽스처로 독립 완성.

## 9. 다음 · 오픈 이슈

- **조합 DTO 타입 확정**(개발과 합의): `TestPlayData`, `ResultView`, 메인 `HomeData`. 스키마 추론 타입 기반.
- **P0 픽스처 세트**(ENFP 등 1테스트 풀데이터: test+questions+choices+16 result_cards) → 디자이너 뷰 개발용.
- A4(테스트 편집) 상세 UX 별도 설계.
- 착수 순서(디자인): **S3 결과 카드 → S2 진행 → S1 소개 → S9 결과 OG → S4 메인** (바이럴 핵심부터).
