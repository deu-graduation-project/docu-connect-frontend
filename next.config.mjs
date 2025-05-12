/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false }
    return config
  },
  env: {
    NEXT_PUBLIC_MAPTILER_API_KEY: "QcQLfxO91SOqba2FGk5K",
  },
  transpilePackages: ["react-leaflet", "leaflet"],
}

export default nextConfig
