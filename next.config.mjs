/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "energetic-otter-849.convex.cloud",
      },
    ],
  },
};
export default nextConfig;