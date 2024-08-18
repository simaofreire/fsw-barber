/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "utfs.io" },
      { hostname: "plus.unsplash.com" },
    ],
  },
}

export default nextConfig;
