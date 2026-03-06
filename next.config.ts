import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "k.kakaocdn.net",
      },
      {
        protocol: "https",
        hostname: "img1.kakaocdn.net",
      },
      {
        protocol: "https",
        hostname: "t1.kakaocdn.net",
      },
      {
        protocol: "https",
        hostname: "way-point-bucket.s3.ap-northeast-2.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "ssl.pstatic.net",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
