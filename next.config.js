/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',  // 为 GitHub 头像
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',     // 为 Google 头像
      }
    ],
  },
}

module.exports = nextConfig 