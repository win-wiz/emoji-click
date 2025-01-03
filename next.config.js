/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */

import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';
import './src/env.js';

if (process.env.NODE_ENV === 'development') {
  setupDevPlatform({ persist: true }).catch(e => console.error(e));
}

/** @type {import("next").NextConfig} */
const config = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.json$/,
      use: {
        loader: '@lingui/loader'
      }
    })
    return config
  },
  experimental: {
    swcPlugins: [['@lingui/swc-plugin', {}]]
  },
};

export default config;
