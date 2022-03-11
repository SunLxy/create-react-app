# carefree-scripts

fork [Create React App](https://github.com/facebook/create-react-app) ，进行改造成想要的配置数据

1. watch 配置是生产的使用配置 ，支持修改的(直接使用 webpack 的 watch )，
2. start 原来的不变，(好像不支持 multicompiler )
3. build 原来的配置，支持修改的

## 自定义配置文件

```js
const {
  getWbpackBarPlugins,
  restOutPut,
  restWebpackManifestPlugin,
  clearHtmlTemp,
} = require('carefree-scripts/config/overrides/utils');
const path = require('path');
module.exports = {
  // 这 4 个 环境变量可以重写
  INLINE_RUNTIME_CHUNK: '',
  GENERATE_SOURCEMAP: '',
  ESLINT_NO_DEV_ERRORS: '',
  DISABLE_ESLINT_PLUGIN: '',

  // 重写 paths 地址
  paths: {
    appIndexJs: path.join(process.cwd(), 'src/client.js'),
  },
  // 重写 最终的配置
  overridesWebpack: conf => {
    if (process.env.NODE_ENV === 'development') {
      return conf;
    }
    // 使用 multicompiler 方式 build 和 watch
    const confArr = [];
    Array.from({ length: 2 }).forEach((_, index) => {
      let ops = { ...conf };
      if (!index) {
        ops = getWbpackBarPlugins(ops, { name: 'server' });
        ops = restOutPut(ops, { filename: 'server.js' });
        ops.entry = path.join(process.cwd(), 'src/server.js');
        ops = restWebpackManifestPlugin(ops, 'server');
        ops = clearHtmlTemp(ops);
        ops.devtool = false;
      } else {
        ops = getWbpackBarPlugins(ops, { name: 'client' });
        ops = restOutPut(ops, { filename: 'client.js' });
        ops = restWebpackManifestPlugin(ops, 'client');
        ops = clearHtmlTemp(ops);
      }
      confArr.push(ops);
    });
    return confArr;
  },
};
```
