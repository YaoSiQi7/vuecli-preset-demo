const path = require('path');
// 开启Gzip
const CompressionWebpackPlugin = require('compression-webpack-plugin');

// 开启自定义Vuetify SASS
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');

const isProduction = process.env.NODE_ENV === 'production';

const resolve = dir => {
  return path.join(__dirname, dir);
};
module.exports = {
  filenameHashing: true,
  transpileDependencies: ['vuetify'],
  // webpack配置
  configureWebpack: config => {
    const CopyWebpackPlugin = require('copy-webpack-plugin');
    if (process.env.NODE_ENV === 'development') {
      config.devtool = 'source-map';
    } else {
      config.plugins.push(
        new CompressionWebpackPlugin({
          algorithm: 'gzip',
          test: /\.js$|\.html$|\.json$|\.css/,
          threshold: 10240,
          minRatio: 0.8
        })
      );
      // 开启分离js
      config.optimization = {
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: Infinity,
          minSize: 20000,
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name (module) {
                const packageName = module.context.match(
                  /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                )[1];
                return `app.${packageName.replace('@', '')}`;
              }
            }
          }
        }
      };
      // 取消webpack警告的性能提示
      config.performance = {
        hints: 'warning',
        // 入口起点的最大体积
        maxEntrypointSize: 500000,
        // 生成文件的最大体积
        maxAssetSize: 30000000,
        // 只给出 js 文件的性能提示
        assetFilter: function (assetFilename) {
          return assetFilename.endsWith('.js');
        }
      };
    }
    config.plugins.push(
      new CopyWebpackPlugin([
        {
          from: './static', // 新增可以被index.html访问的静态文件目录，支持多个
          to: this.outputDir,
          ignore: ['.*']
        }
      ])
    );
  },
  css: {
    loaderOptions: {
      sass: {
        sassOptions: {
          includePaths: [
            path.resolve(__dirname, 'src/styles/')
          ],
          indentedSyntax: true
        },
        prependData: '@import "~@/styles/variables.scss"'
      }
    }
  },
  publicPath: './',
  devServer: {
    host: 'localhost',
    port: 8081, // 端口号
    hotOnly: false,
    https: false, // https:{type:Boolean}
    open: false, // 配置自动启动浏览器
    proxy: null // 配置跨域处理,只有一个代理
  },
  lintOnSave: process.env.NODE_ENV !== 'production',
  // 打包时不生成.map文件
  productionSourceMap: false,
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('@c', resolve('src/components'))
      .set('api', resolve('src/api'))
      .set('utils', resolve('src/utils'));
    // 生产环境配置
    if (isProduction) {
      // 删除预加载
      config.plugins.delete('preload');
      config.plugins.delete('prefetch');
      // 压缩代码
      config.optimization.minimize(true);
      // 分割代码
      config.optimization.splitChunks({
        chunks: 'all'
      });
    }
  }
};
