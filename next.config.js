/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'standalone',
  webpack: (config, { isServer }) => {
    // Ensure autoprefixer is available and add Node.js fallbacks
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        crypto: false,
        stream: false,
        util: false,
        buffer: false,
        process: false,
        dns: false,
        net: false,
        tls: false,
        pg: false,
        mssql: false,
        url: false,
        querystring: false,
        path: false,
        os: false,
        child_process: false,
      }
    }
    
    // Exclude Node.js modules from client-side bundle
    config.externals = config.externals || []
    if (!isServer) {
      config.externals.push({
        mssql: 'mssql',
        'mssql/package.json': 'mssql/package.json',
      })
    }
    
    return config
  },
}

module.exports = nextConfig
