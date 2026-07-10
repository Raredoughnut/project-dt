import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";
import { getDatabaseUrl } from "./connection-url";

const connectionString = getDatabaseUrl();

// Supabase 연결 메모:
// - SSL 필수 → 연결 문자열에 `?sslmode=require` 포함(Session pooler 권장).
// - Transaction pooler(:6543)는 prepared statement 미지원 → prepare:false.
//   (Session pooler/직접 연결은 지원하므로 기본값 유지)
const isTransactionPooler = connectionString.includes(":6543");

// Next dev(HMR)에서 커넥션이 매번 새로 열려 고갈되는 것을 방지하기 위해 전역 캐싱.
const globalForDb = globalThis as unknown as {
  __pgClient?: ReturnType<typeof postgres>;
};

const client =
  globalForDb.__pgClient ??
  postgres(connectionString, { prepare: !isTransactionPooler });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__pgClient = client;
}

export const db = drizzle(client, { schema });
export { client };
