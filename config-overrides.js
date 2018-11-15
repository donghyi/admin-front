const rewired = require('react-app-rewired')
const rewireLess = require('react-app-rewire-less')
const rewireEslint = require('react-app-rewire-eslint')
const rewireMobX = require('react-app-rewire-mobx');
//const rewireVendorSplitting = require("react-app-rewire-vendor-splitting");
const path = require('path');

function rewire(config, env) {
  const cssLoader = rewired.getLoader(
    config.module.rules,
    rule => rule.test && String(rule.test) === String(/\.css$/)
  )
  const sassLoader = {
    test: /\.scss$/,
    use: [...(cssLoader.loader || cssLoader.use), 'sass-loader']
  }
  const oneOf = config.module.rules.find(rule => rule.oneOf).oneOf
  oneOf.unshift(sassLoader)

  // use the MobX rewire
  config = rewireMobX(config,env);

  config = rewired.injectBabelPlugin('transform-decorators-legacy', config)
  config = rewireLess(config, env)
  config = rewireEslint(config, env)
  //config = rewireVendorSplitting(config, env);
  config.resolve.modules.push(path.resolve('./src'))

  return config
}

module.exports = rewire
