## 5. 코드 규칙

### 타입 안전성 규칙
- `any` 타입 **절대 금지**. 명시적 타입 필수
- 이벤트 핸들러: `(e: any)` → `(e: React.ChangeEvent<HTMLInputElement>)` 등
- API 응답: `any` → 응답 타입 interface 정의
- catch 블록: `catch(e: any)` → `catch(e: unknown)` + 타입 가드
- 동적 객체: `Record<string, any>` → `Record<string, unknown>` 또는 명시적 interface
- 모든 컴포넌트는 Props에 대한 TypeScript interface를 정의한다

### 스타일링 규칙

- **레이아웃/간격**: Tailwind CSS (`flex`, `gap`, `p-`, `m-`, `w-`, `h-` 등)
- **복잡한 UI**: shadcn 이용 (Dialog, DataGrid, Autocomplete 등)
- 새 UI 작성 전 `src/components` 확인 → 기존 컴포넌트 재사용 우선

### 네이밍 규칙
| 대상            | 규칙                | 예시                                         |
| --------------- | ------------------- | -------------------------------------------- |
| 컴포넌트 파일   | kebab-case          | `product-card.tsx`                           |
| 컴포넌트        | PascalCase          | `ProductCard`                                |
| Hook 파일       | `use-` + kebab-case | `use-product-list.ts`                        |
| Container       | `*-container.tsx`   | `product-container.tsx`                      |
| View            | `*-view.tsx`        | `product-view.tsx`                           |
| 타입/인터페이스 | PascalCase          | `ProductDto`, `ProductCardProps`             |
| 변수/함수       | camelCase           | `handleSubmit`, `isLoading`                  |
| 상수            | UPPER_SNAKE_CASE    | `MAX_FILE_SIZE`                              |
| 임포트 경로     | `@` 절대 경로       | `import { ... } from '@/src/components/...'` |

### Prettier 옵션

- singleQuote `true`
- jsxSingleQuote `true`
- semi `true`
- tabWidth `2`
- useTabs `false`
- trailingComma `es5`
- printWidth `80`
- arrowParens `always`