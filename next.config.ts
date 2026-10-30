import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseImagePattern = supabaseUrl
    ? {
          protocol: "https" as const,
          hostname: new URL(supabaseUrl).hostname,
          pathname: "/storage/v1/object/public/**",
      }
    : null;

const nextConfig: NextConfig = {
    /* config options here */
    reactCompiler: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
            {
                protocol: "http",
                hostname: "localhost",
            },
            ...(supabaseImagePattern ? [supabaseImagePattern] : []),
        ],
    },
};

export default nextConfig;
