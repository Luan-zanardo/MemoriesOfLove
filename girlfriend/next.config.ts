import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true, // mantém caso use recursos que dependam dele
  images: {
    domains: ["vjluawdltsfpktyvzhmc.supabase.co"], // seu domínio do Supabase
  },
};

export default nextConfig;