import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    // All imagery in Phase 1 is local placeholder/mock imagery served from
    // /public. Phase 2 will add remotePatterns for the WordPress media host.
    localPatterns: [{ pathname: "/images/**" }, { pathname: "/spin/**" }],
  },
};

export default withNextIntl(nextConfig);
