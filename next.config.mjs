/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'firebasestorage.googleapis.com',
      'img.clerk.com' // 👈 Add this line
    ],
  },
};

export default nextConfig;
