module.exports = function override(config, env) {
  // Remove react-refresh-webpack-plugin if it exists
  if (config.plugins) {
    config.plugins = config.plugins.filter(plugin => 
      !plugin.constructor || plugin.constructor.name !== 'ReactRefreshPlugin'
    );
  }
  return config;
}
