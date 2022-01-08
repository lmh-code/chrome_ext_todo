<template>
  <div class="popup-wrap">
    <header class="header-wrap">
      WorkHelper ({{ version }})
    </header>
    <div class="container">
      <the-cookie-transfer />
      <the-menu-list />
    </div>
    <footer class="footer-wrap">
      <div
        v-for="item of links"
        :key="item.id"
        @click="goAddress(item.id)"
      >
        <svg-icon
          :icon-class="item.id"
          class-name="options-icon"
        />
      </div>
    </footer>
  </div>
</template>

<script>
import { VERSION } from '@/utils/constant'
import TheCookieTransfer from './components/TheCookieTransfer.vue'
import TheMenuList from './components/TheMenuList.vue'
export default {
  name: 'Popup',
  components: {
    TheCookieTransfer,
    TheMenuList
  },
  data() {
    return {
      version: VERSION,
      links: [
        {
          id: 'github',
          iconClass: 'github',
          alt: 'github地址'
        },
        {
          id: 'setting',
          iconClass: 'setting',
          alt: '设置'
        }
      ]
    }
  },
  methods: {
    goAddress(id) {
      if (id === 'github') {
        chrome.tabs.create({ url: 'https://github.com/lmh-code/chrome_ext_vue' })
      } else if (id === 'setting') {
        chrome.tabs.create({ url: 'setting.html' })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .popup-wrap {
    width: $-base-width;

    .header-wrap,
    .footer-wrap {
      display: flex;
      height: 32px;
      line-height: 32px;
      padding: 0 10px;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
    }
    .header-wrap {
      border-bottom: 1px dashed $-color-sub-grey;
    }

    .container {
      max-height: 360px;
    }

    .footer-wrap {
      border-top: 1px dashed $-color-sub-grey;
      .options-icon {
        cursor: pointer;
        font-size: 18px;
      }
    }
  }
</style>
