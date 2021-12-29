function goTranslate(info) {
  var searchstring = info.selectionText
  window.chrome.tabs.create({ url: 'http://maps.google.com/maps?q=' + searchstring })
}
window.chrome.contextMenus.create({
  id: 'translate',
  title: "翻译'%s'",
  contexts: ['selection'],
  onclick: goTranslate
})

