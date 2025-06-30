module.exports = {
  webpack: function (config) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      url: require.resolve('url/'),
    };
    return config;
  },
};
