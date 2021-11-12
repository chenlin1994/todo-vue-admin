const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const isProduction = process.env.NODE_ENV === 'production'
const env = process.env.env
const isDev = process.env.NODE_ENV === 'development'
module.exports = {
  // publicPath: isProduction ? '/todo-vue-admin/' : '/',
  productionSourceMap: false,
  lintOnSave: false,
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [],
    },
  },
  chainWebpack(config) {
    // config.resolve.alias
    //   .set('@',resolve('src'))
    config.plugin('html').tap((args) => {
      args[0].title = '111'
      args[0].isDev = isDev
      args[0].env = env
      return args
    })
    config.plugin('define').tap((args) => {
      args[0]['process.env'].env = JSON.stringify(env)
      return args
    })
  },
  devServer: {
    port: 8082,
    proxy: {
      '/api/poros-permission': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: {
          '^/api/poros-permission': '/api/poros-permission',
        },
      },
      '/api': {
        // target: 'http://106.55.168.13:8082',
        target: 'http://localhost:8088',
        changeOrigin: true,
        ws: false,
        // pathRewrite: {
        //   "^/api": "/api"
        // }
      },
    },
  },
  //webpack配置
  configureWebpack: {
    devtool: 'source-map',
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              warnings: false,
              drop_console: true, //console
              drop_debugger: false,
              pure_funcs: ['console.log'], //移除console
            },
          },
        }),
      ],
    },
    //警告 webpack 的性能提示
    performance: {
      hints: 'warning',
      //入口起点的最大体积
      maxEntrypointSize: 50000000,
      //生成文件的最大体积
      maxAssetSize: 30000000,
      //只给出 js 文件的性能提示
      assetFilter: function (assetFilename) {
        return assetFilename.endsWith('.js')
      },
    },
  },
}
