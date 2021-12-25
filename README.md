# chrome_ext_vue
一个使用vue开发chrome扩展的案例


# 目录结构
```
├── src
│   ├── assets
│   │   ├── images                    // 图片文件
│   │   │   ├── icon                  // 插件 icon 文件
│   │   │   │   ├── 16.png
│   │   │   │   ├── 32.png
│   │   │   │   ├── 48.png
│   │   │   │   ├── 64.png
│   │   │   │   ├── 128.png
│   │   │   ├── github.png
│   │   │   ├── setting.png
│   ├── background
│   │   └── main.js                  // 配置热启动的文件
│   ├── icons                        // svg图片文件
│   ├── plugins
│   │   ├── inject.js
│   │   └── manifest.json            // chrome扩展必须文件，是一个配置清单
│   ├── popup
│   │   ├── components
│   │   │   └── ThePopup.vue
│   │   ├── App.vue
│   │   ├── index.html
│   │   └── main.js
│   └── utils
├── vue.config.js
└── package-lock.json
├── README.md
├── babel.config.js
├── package.json
```

# Project setup
```
npm install
```

## Compiles and hot-reloads for development
```
npm run serve // 执行之后代码会被实时监听，修改代码chrome扩展就会更新
```

## Compiles and minifies for production
```
npm run build // build之后生成dist文件，在chrome扩展中选择加载已解压的扩展程序，把dist文件加载进去。
```

## Lints and fixes files
```
npm run lint
```

## Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
