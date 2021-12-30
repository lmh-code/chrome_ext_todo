const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

// 复制文件到指定目录
const copyFiles = [
  {
    from: path.resolve('src/plugins/manifest.json'),
    to: `${path.resolve('dist')}/manifest.json`
  },
  {
    from: path.resolve('src/assets'),
    to: path.resolve('dist/assets')
  },
  {
    from: path.resolve('src/plugins/inject.js'),
    to: path.resolve('dist/js')
  },
  {
    from: path.resolve('src/utils'),
    to: path.resolve('dist/utils')
  },
  {
    from: path.resolve('src/background/main.js'),
    to: path.resolve('dist/js/background.js')
  }
]

// 复制插件
const plugins = [
  new CopyWebpackPlugin({
    patterns: copyFiles
  })
]

// 页面文件
const pages = {}
// 配置 popup.html 页面
const chromeName = ['popup', 'setting', 'todo']

chromeName.forEach(name => {
  pages[name] = {
    entry: `src/pages/${name}/main.js`,
    template: `src/pages/${name}/index.html`,
    filename: `${name}.html`
  }
})

module.exports = {
  pages,
  lintOnSave: true,
  productionSourceMap: false,
  // 配置 content.js background.js
  configureWebpack: {
    // entry: {
    //   background: './src/background/main.js'
    // },
    // output: {
    //   filename: 'js/[name].js'
    // },
    plugins
  },
  // 配置 content.css
  css: {
    extract: {
      filename: 'css/[name].css'
    }
  },
  // 增加chainWebpack配置
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.output.filename(`js/[name].${Date.now()}.js`).end()
      config.output.chunkFilename(`js/[name].${Date.now()}.js`).end()
    }

    config.module
      .rule('svg')
      .exclude.add(path.resolve('src/icons')) // 排除掉src/icons目录
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(path.resolve('src/icons')) // 指定src/icons要处理svg的文件目录
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader') // 用svg-sprite-loader解析
      .options({
        symbolId: 'icon-[name]' // symbol id命名格式 icon-图标名称
      })
      .end()

    const oneOfsMap = config.module.rule('scss').oneOfs.store
    oneOfsMap.forEach((item) => {
      item
        .use('sass-resources-loader')
        .loader('sass-resources-loader')
        .options({
          // Provide path to the file with resources
          hoistUseStatements: true,
          // 要公用的scss的路径
          resources: [
            path.resolve('src/assets/style/variables.scss')
          ]
        })
        .end()
    })
  }
}
