/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},  // 👈 THIS line stops the error

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
    ],
  },

  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        '@remotion/compositor-darwin-arm64': 'commonjs @remotion/compositor-darwin-arm64',
        '@remotion/compositor-darwin-x64': 'commonjs @remotion/compositor-darwin-x64',
        '@remotion/compositor-linux-arm64-gnu': 'commonjs @remotion/compositor-linux-arm64-gnu',
        '@remotion/compositor-linux-arm64-musl': 'commonjs @remotion/compositor-linux-arm64-musl',
        '@remotion/compositor-linux-x64-gnu': 'commonjs @remotion/compositor-linux-x64-gnu',
        '@remotion/compositor-linux-x64-musl': 'commonjs @remotion/compositor-linux-x64-musl',
        '@remotion/compositor-win32-x64-msvc': 'commonjs @remotion/compositor-win32-x64-msvc',
      });
    }
    return config;
  },
};

export default nextConfig;
