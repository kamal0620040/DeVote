/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['devote.infura-ipfs.io', 'res.cloudinary.com'],
  },
};

module.exports = nextConfig;
