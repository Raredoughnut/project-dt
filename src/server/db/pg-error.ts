/**
 * postgres unique_violation(SQLSTATE 23505) 감지.
 * drizzle(0.45+)는 원본 postgres 에러를 `DrizzleQueryError`로 감싸므로
 * `e.code`가 아니라 `e.cause.code`에 코드가 있다 → cause 체인을 따라 확인한다.
 */
export function isUniqueViolation(e: unknown): boolean {
  let cur: unknown = e;
  for (let depth = 0; depth < 5 && cur; depth++) {
    if (
      typeof cur === "object" &&
      cur !== null &&
      "code" in cur &&
      (cur as { code?: string }).code === "23505"
    ) {
      return true;
    }
    cur = (cur as { cause?: unknown }).cause;
  }
  return false;
}
