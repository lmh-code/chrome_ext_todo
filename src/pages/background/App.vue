<template>
  <div />
</template>

<script>
import IndexDB from '@/DB/index'
export default {
  name: 'Background',
  mounted() {
    this.initBaiduTranslate()
    this.initBadge()
  },
  methods: {
    initBaiduTranslate() {
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
    },

    /**
     * @description: 设置badge
     */
    initBadge() {
      const year = new Date().getFullYear()
      const month = new Date().getMonth() + 1
      const day = new Date().getDate()
      IndexDB.selectByIndex('chrome_ext_todo', 'todo_key', `${year}-${month}-${day}`).then(res => {
        const data = res?.data || []
        // 设置今日待办事项
        if (data.length) {
          chrome.browserAction.setBadgeText({ text: `${data.length}` })
          chrome.browserAction.setBadgeBackgroundColor({ color: '#5587F0' })
        }
      })
    }
  }
}
</script>
