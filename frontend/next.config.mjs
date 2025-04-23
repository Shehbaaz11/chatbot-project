/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable webpack5 for now to fix the __webpack_require__.n issue
  webpack: (config, { isServer }) => {
    // Fix for __webpack_require__.n is not a function
    config.module.rules.push({
      test: /\.m?js$/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false,
      },
    });

    return config;
  },
  // Ensure CSS modules work properly
  cssModules: true,
  // Ensure we can use both .js and .mjs files
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx', 'mjs'],
};

export default nextConfig;
