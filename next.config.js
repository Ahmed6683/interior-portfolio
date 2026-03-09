// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // Supabase storage CDN — replace YOUR_PROJECT_REF with your actual ref
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // placeholder images during dev
      },
    ],
  },
};

module.exports = nextConfig;
