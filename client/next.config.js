/** @type {import('next').NextConfig} */

require('dotenv').config();

const nextConfig = {
  reactStrictMode: true,
  env: {
    ownerAddress: process.env.OWNER_ADDR,
  }
}

module.exports = nextConfig
