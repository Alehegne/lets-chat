import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    domains:[
      "res.cloudinary.com",
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com"
    ],
    remotePatterns: [
      {

        protocol: 'https',
        hostname: 'res.cloudinary.com',
      
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      }
    ],
  }

};

export default nextConfig;
