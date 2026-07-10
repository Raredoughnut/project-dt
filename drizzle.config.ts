import "dotenv/config";
import { defineConfig } from "drizzle-kit";

import { getDatabaseUrl } from "./src/server/db/connection-url";

export default defineConfig({
  schema: "./src/server/db/schema.ts",
  out: "./src/server/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: getDatabaseUrl(),
  },
  verbose: true,
  strict: true,
});
