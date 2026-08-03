import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    return [{ source: "/auth", destination: "/auth/login", permanent: false }];
  },
};

export default nextConfig;
