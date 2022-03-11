// 获取 根目录下 自己定义的配置
const path = require('path');
const fs = require('fs');
// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const confPath = resolveApp("config/index")

let overrides = {
  // paths 地址
  paths: {},
  // 最终自定义配置设置
  overridesWebpack: undefined,
}

if (fs.existsSync(confPath)) {
  const config = require(resolveApp("config/index"))
  const configDefault = require(resolveApp("config/index")).default
  if (configDefault) {
    overrides = {
      ...overrides,
      ...configDefault
    }
  } else if (config) {
    overrides = {
      ...overrides,
      ...config
    }
  }
}

module.exports = overrides