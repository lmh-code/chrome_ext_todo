<template>
  <div />
</template>

<script>
import IndexDB from '@/DB/index'
import { T_TODO_LIST } from '@/DB/constant'
import { REFRESH_BADGE } from '@/utils/constant'
export default {
  name: 'Background',
  mounted() {
    const _this = this
    this.initBaiduTranslate()
    this.initBadge()

    // 全局接收消息
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      if (request.key === REFRESH_BADGE) {
        _this.initBadge()
        sendResponse(request.msg)
      }
    })
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
      IndexDB.selectByIndex(T_TODO_LIST, 'todo_key', `${year}-${month}-${day}`).then(res => {
        const data = res?.data || []
        const todoList = data.filter(item => !item.complete)
        // 设置今日待办事项
        if (todoList.length) {
          chrome.browserAction.setBadgeText({ text: `${todoList.length}` })
          chrome.browserAction.setBadgeBackgroundColor({ color: '#5587F0' })
        } else {
          chrome.browserAction.setBadgeText({ text: '' })
        }
      })
    }
  }
}
</script>
