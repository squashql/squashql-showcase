const isProd = process.env.NODE_ENV === 'production'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  assetPrefix: isProd ? 'https://squashql.github.io/squashql-showcase' : undefined,
}

export default nextConfig
