import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL 환경변수가 설정되지 않았습니다. .env 를 확인하세요.");
}

// Next dev(HMR)에서 커넥션이 매번 새로 열려 고갈되는 것을 방지하기 위해 전역 캐싱.
const globalForDb = globalThis as unknown as {
  __pgClient?: ReturnType<typeof postgres>;
};

const client = globalForDb.__pgClient ?? postgres(process.env.DATABASE_URL);

if (process.env.NODE_ENV !== "production") {
  globalForDb.__pgClient = client;
}

export const db = drizzle(client, { schema });
export { client };
