import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // To enable a static export
    output: 'export',
    // generate folder-style routes;
    // allow callback route work in cloudfront + s3
    // i.e. index.html exists in out/callback
    trailingSlash: true,
};

export default nextConfig;
