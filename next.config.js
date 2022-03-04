/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    // Will be available on both server and client
    CHAT_API_GATEWAY: `${process.env.CHAT_API_GATEWAY}:5070` || 'http://localhost:5070',
    CHATSERVER_API: `${process.env.CHATSERVER_API}:5080` || 'http://localhost:5080'
  }
}

module.exports = nextConfig
