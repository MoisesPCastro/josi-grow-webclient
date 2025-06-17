// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'res.cloudinary.com',          // imagens do Cloudinary
      'josi-grow-api.onrender.com',  // se ainda usar seu backend
      'localhost',                   // em dev local
    ],
  },
};

export default nextConfig;
