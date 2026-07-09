## 4. 기본 원칙

### 아키텍처 원칙: MVVM + Container-Presentational 패턴

모든 기능은 **Container + View + ViewModel(Hook)** 세 파일로 분리합니다.

| 구분      | 파일명 패턴       | 역할                                                  | 금지 사항                                               |
| --------- | ----------------- | ----------------------------------------------------- | ------------------------------------------------------- |
| Container | `*-container.tsx` | ViewModel 훅 호출, 상태 분기, View에 데이터/콜백 전달 | 직접 UI 트리 구성 (50줄 초과), API 호출, 비즈니스 로직  |
| View      | `*-view.tsx`      | Props로 데이터/콜백 수신, 순수 UI 렌더링              | 훅 호출(useState/useEffect 제외), API 호출, 데이터 가공 |
| ViewModel | `use-*.ts`        | API 호출, 비즈니스 로직, 상태 관리, 데이터 가공       | JSX 반환, UI 관련 코드                                  |

View의 모든 사용자 액션은 Container에서 전달받은 콜백을 통해 ViewModel을 호출해야 합니다.

**View에서 금지**
- `.filter()`, `.reduce()`, `.sort()` 등 데이터 가공
- `fetch`/`axios` 호출, Zustand store 직접 접근

**View에서 허용**
- 순수 UI 표현 분기 (삼항 연산자 색상/텍스트)
- `useState`(UI 상태: 모달 열림 등), `useResponsive`

---

### 파일 관리 원칙: 1파일 1컴포넌트 원칙

이 프로젝트에서는 1파일당  **하나의 export 컴포넌트(함수)만** 정의하는 것을 가급적 권장하고 있습니다.

**허용**

- 해당 컴포넌트 전용 `interface`, `type`
- 해당 컴포넌트 전용 상수, 헬퍼 함수 (export하지 않는 것)

**금지**:

- Container + View 한 파일 → `*-container.tsx` + `*-view.tsx` 분리
- 2개 이상 export 컴포넌트 → 각각 별도 파일
- 컴포넌트 + Custom Hook 한 파일 → 컴포넌트 파일 + `use-*.ts` 분리

---