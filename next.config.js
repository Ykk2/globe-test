/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = {
  webpack: (config, { isServer }) => {
    // Add file-loader for .glb files
    config.module.rules.push({
      test: /\.glb$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/files',
          outputPath: `${isServer ? '../' : ''}static/files`,
          name: '[name].[contenthash].[ext]',
          esModule: false,
        },
      },
    });

    return config;
  },
};
