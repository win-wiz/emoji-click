/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

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
