/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "utfs.io" },
      { hostname: "plus.unsplash.com" },
    ],
  },
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/home",
        permanent: true,
      },
    ]
  },
}

export default nextConfig;
