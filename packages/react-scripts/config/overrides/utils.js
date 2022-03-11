'use strict';
const WebpackBar = require('webpackbar');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const getPublicUrlOrPath = require('react-dev-utils/getPublicUrlOrPath');

const path = require('path');
const fs = require('fs');
// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());

const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const publicUrlOrPath = getPublicUrlOrPath(
  process.env.NODE_ENV === 'development',
  require(resolveApp('package.json')).homepage,
  process.env.PUBLIC_URL
);

// plugin 根据 client  server

/** 加 进度条，  */
const getWbpackBarPlugins = (conf, opt) => {
  const options = { ...(opt || {}) };
  if (options.name === 'server' && !options.color) {
    options.color = 'yellow';
  }
  const plugins = [new WebpackBar({ ...options })].concat(conf.plugins);
  return {
    ...conf,
    plugins,
  };
};

/** 重置 WebpackManifestPlugin 输出名称 */
const restWebpackManifestPlugin = (conf, type) => {
  const plugins = []
    .concat(conf.plugins)
    .filter(
      plugin => plugin && plugin.constructor.name !== 'WebpackManifestPlugin'
    )
    .concat([
      new WebpackManifestPlugin({
        fileName: type ? `asset-${type}-manifest.json` : 'asset-manifest.json',
        publicPath: publicUrlOrPath,
        generate: (seed, files, entrypoints) => {
          const manifestFiles = files.reduce((manifest, file) => {
            manifest[file.name] = file.path;
            return manifest;
          }, seed);
          const entrypointFiles = entrypoints.main.filter(
            fileName => !fileName.endsWith('.map')
          );
          return {
            files: manifestFiles,
            entrypoints: entrypointFiles,
          };
        },
      }),
    ]);
  return { ...conf, plugins };
};

/** 清理 html 模板 plugin */
const clearHtmlTemp = conf => {
  const plugins = []
    .concat(conf.plugins)
    .filter(
      plugin =>
        plugin &&
        !/(HtmlWebpackPlugin|InlineChunkHtmlPlugin|InterpolateHtmlPlugin)/.test(
          plugin.constructor.name
        )
    );
  return { ...conf, plugins };
};

const restOutPut = (conf, options) => {
  return {
    ...conf,
    output: {
      ...conf.output,
      ...options,
    },
  };
};

module.exports = {
  getWbpackBarPlugins,
  restWebpackManifestPlugin,
  restOutPut,
  clearHtmlTemp,
};
