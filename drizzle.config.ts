
import { env } from "@/env";
import { defineConfig } from "drizzle-kit";

export default env.DB_LOCAL_PATH
  ? defineConfig({
      dialect: "sqlite",
      schema: "./src/server/db/schema.ts",
      dbCredentials: {
        url: env.DB_LOCAL_PATH,
      }
    })
  : defineConfig({
      schema: "./src/server/db/schema.ts",
      dialect: "sqlite",
      out: "./migrations",
      driver: "d1-http",
      dbCredentials: {
        accountId: env.CLOUDFLARE_ACCOUNT_ID!,
        token: env.CLOUDFLARE_API_TOKEN!,
        databaseId: env.DB_PROD_DATABASE_ID!,
      },
      tablesFilter: [`cloudflare_*`],
    });
