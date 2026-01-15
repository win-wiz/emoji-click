import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: 
      z.enum(["development", "test", "production"])
      .default("development"),
    PRODUCTION_URL: z.string().optional(),
    DB_LOCAL_PATH: z.string().optional(),
    CLOUDFLARE_ACCOUNT_ID: z.string().optional(),
    CLOUDFLARE_API_TOKEN: z.string().optional(),
    DB_PROD_DATABASE_ID: z.string().optional(),
    DOUBAO_OPENAI_API_KEY: z.string().optional(),
    DOUBAO_BASE_URL: z.string().optional(),
    DOUBAO_LINK_128K_MODEL: z.string().optional(),
    MOLE_API_KEY: z.string().optional(),
    MOLE_GPT_4O_MINI_MODEL: z.string().optional(),
    MONICA_API_KEY: z.string().optional(),
    MONICA_BASE_URL: z.string().optional(),
    MONICA_MODEL: z.string().optional(),
    OPENAI_API_KEY: z.string().optional(),
    QIANWEN_API_KEY: z.string().optional(),
    QIANWEN_BASE_URL: z.string().optional(),
    QIANWEN_MODEL: z.string().optional(),
    DEEPSEEK_API_KEY: z.string().optional(),
    DEEPSEEK_BASE_URL: z.string().optional(),
    DEEPSEEK_MODEL: z.string().optional(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_ADSENSE_CLIENT: z.string().default("ca-pub-1939625526338391"),
    NEXT_PUBLIC_ADSENSE_SLOT_HOME: z.string().optional(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    PRODUCTION_URL: process.env.PRODUCTION_URL,
    DB_LOCAL_PATH: process.env.DB_LOCAL_PATH,
    CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
    CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN,
    DB_PROD_DATABASE_ID: process.env.DB_PROD_DATABASE_ID,
    DOUBAO_OPENAI_API_KEY: process.env.DOUBAO_OPENAI_API_KEY,
    DOUBAO_BASE_URL: process.env.DOUBAO_BASE_URL,
    DOUBAO_LINK_128K_MODEL: process.env.DOUBAO_LINK_128K_MODEL,
    MOLE_API_KEY: process.env.MOLE_API_KEY,
    MOLE_GPT_4O_MINI_MODEL: process.env.MOLE_GPT_4O_MINI_MODEL,
    MONICA_API_KEY: process.env.MONICA_API_KEY,
    MONICA_BASE_URL: process.env.MONICA_BASE_URL,
    MONICA_MODEL: process.env.MONICA_MODEL,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    QIANWEN_API_KEY: process.env.QIANWEN_API_KEY,
    QIANWEN_BASE_URL: process.env.QIANWEN_BASE_URL,
    QIANWEN_MODEL: process.env.QIANWEN_MODEL,
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY,
    DEEPSEEK_BASE_URL: process.env.DEEPSEEK_BASE_URL,
    DEEPSEEK_MODEL: process.env.DEEPSEEK_MODEL,
    NEXT_PUBLIC_ADSENSE_CLIENT: process.env.NEXT_PUBLIC_ADSENSE_CLIENT,
    NEXT_PUBLIC_ADSENSE_SLOT_HOME: process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
