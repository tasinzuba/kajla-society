import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "5000", pathname: "/uploads/**" },
      { protocol: "https", hostname: "**.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
};

export default nextConfig;
