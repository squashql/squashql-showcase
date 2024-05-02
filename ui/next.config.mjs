const getAssetPrefix = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://squashql.github.io/squashql-showcase'
  } else if (process.env.NODE_ENV === 'server') {
    return 'http://localhost:8080'
  }
  return undefined
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  assetPrefix: getAssetPrefix(),
  trailingSlash: true,
}

export default nextConfig
