/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/aroma-alert",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

export default nextConfig
