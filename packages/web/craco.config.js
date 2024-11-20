module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Remove react-refresh-webpack-plugin
      webpackConfig.plugins = webpackConfig.plugins.filter(plugin => 
        !plugin.constructor || plugin.constructor.name !== 'ReactRefreshPlugin'
      );
      return webpackConfig;
    }
  }
};
