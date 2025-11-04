import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true, // mantém caso use recursos que dependam dele
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vjluawdltsfpktyvzhmc.supabase.co",
        port: "",
        pathname: "/**", // permite todos os caminhos dentro desse domínio
      },
    ],
  },
};

export default nextConfig;
