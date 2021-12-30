(async() => {
  // 开发内置功能时放开注释，会自动刷新
  // const funcURL = window.chrome.runtime.getURL('utils/hotReload.js')
  // const funcMain = await import(funcURL)
  // funcMain.hotReload()

  function goTranslate(info) {
    var searchString = info.selectionText
    window.chrome.tabs.create({ url: `https://fanyi.baidu.com/?aldtype=16047#en/zh/${searchString}` })
  }
  window.chrome.contextMenus.create({
    id: 'translate',
    title: "百度翻译'%s'",
    contexts: ['selection'],
    onclick: goTranslate
  })
})()

