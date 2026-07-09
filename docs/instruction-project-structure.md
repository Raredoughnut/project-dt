## 3. 프로젝트 폴더 구조

```
app/  # Next.js App Router (라우팅 · 페이지)
src/
├── client/
│   ├── sections/                 # 기능별 블록 (Container + View + ViewModel)
│   │   └── [feature]/
│   │       ├── [feature]-container.tsx
│   │       ├── [feature]-view.tsx
│   │       ├── use-[feature].ts  # ViewModel (Custom Hook)
│   │       └── components/       # feature 전용 컴포넌트
│   ├── components/               # 전역 재사용 UI 컴포넌트
│   ├── layouts/                  # 레이아웃
│   ├── api/                      # API 연동 정의
│   ├── theme/                    # MUI 테마, 글로벌 스타일
│   ├── hooks/                    # 전역 커스텀 훅
│   ├── types/                    # 전역 타입 정의
│   └── utils/                    # 유틸리티
└── server/
    ├── domain/                   # 도메인 블록 (Controller + Service + DTO)
    │   └── [feature]/
    │       ├── [feature]-controller.ts
    │       ├── [feature]-service.ts
    │       └── dto/
    └── modules/                  # 공용 모듈
```
