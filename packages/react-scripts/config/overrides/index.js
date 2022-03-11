'use strict';
// 获取 根目录下 自己定义的配置
const path = require('path');
const fs = require('fs');
// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx',
];

// Resolve file paths in the same order as webpack
const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find(extension =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`))
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  return resolveFn(`${filePath}.js`);
};

const confPath = resolveModule(resolveApp, 'config/index');

let overrides = {
  // paths 地址
  paths: {},
  // 最终自定义配置设置
  overridesWebpack: undefined,
};

if (fs.existsSync(confPath)) {
  const config = require(confPath);
  const configDefault = require(confPath).default;
  if (configDefault) {
    overrides = {
      ...overrides,
      ...configDefault,
    };
  } else if (config) {
    overrides = {
      ...overrides,
      ...config,
    };
  }
}

module.exports = overrides;
