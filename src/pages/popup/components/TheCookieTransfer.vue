<template>
  <div class="cp-container">
    <menu-item
      icon="transfer"
      title="Cookie Transfer"
      :readonly="true"
    />
    <div class="m-table">
      <div class="flex th">
        <div v-for="item of envList" :key="item" class="td">.{{ item }}</div>
      </div>
      <div class="flex tr">
        <div v-for="item of envList" :key="item" class="td">
          <img v-if="envMap[item].hasCookie" src="~@/assets/images/existence.png" height="20">
          <img v-else src="~@/assets/images/non-existence.png" height="20">
        </div>
      </div>
      <div class="flex tr">
        <div v-for="item of envList" :key="item" class="td btn">
          <span @click="copyCookieHandle(item)">
            <svg-icon
              icon-class="copy"
              class-name="copy-icon"
            />
            复制
            <svg-icon
              v-if="envMap[item].copySuccess"
              icon-class="success"
              class-name="copy-icon"
            />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MenuItem from '@/components/MenuItem/index.vue'
export default {
  name: 'TheCookieTransfer',
  components: {
    MenuItem
  },
  data() {
    return {
      cookies: [],
      envList: ['sit', 'uat', 'net', 'com'],
      envMap: {
        sit: {
          key: 'sit',
          hasCookie: false,
          copySuccess: false,
          cookieInfo: {}
        },
        uat: {
          key: 'uat',
          hasCookie: false,
          copySuccess: false,
          cookieInfo: {}
        },
        net: {
          key: 'net',
          hasCookie: false,
          copySuccess: false,
          cookieInfo: {}
        },
        com: {
          key: 'com',
          hasCookie: false,
          copySuccess: false,
          cookieInfo: {}
        }
      }
    }
  },
  mounted() {
    this.getAllCookies()
  },
  methods: {
    getAllCookies() {
      chrome.cookies.getAll({
        name: 'CASTGC'
      }, (cookies) => {
        console.log('获取到的cookies:', cookies)
        this.cookies = cookies
        for (const item of this.envList) {
          const cookieInfo = cookies.find(cookie => cookie.domain === `.longfor.${item}`)
          this.envMap[item].hasCookie = !!(cookieInfo && cookieInfo.value)
          this.envMap[item].cookieInfo = cookieInfo
        }
        this.checkCookie()
      })
    },
    /**
     * @description: 给localhost设置cookie
     * @param {*} type 环境
     */
    copyCookieHandle(type) {
      let cookie = {}
      if (this.envMap[type].hasCookie && this.envMap[type].cookieInfo) {
        cookie = { ...this.envMap[type].cookieInfo }
      }
      if (!Object.keys(cookie).length) {
        return
      }

      delete cookie.hostOnly
      delete cookie.session

      chrome.cookies.set({
        ...cookie,
        url: `http://localhost`,
        domain: 'localhost'
      }, (cookie) => {
        console.log('设置成功后的cookie:', cookie, chrome)
        this.checkCookie()

        chrome.notifications.getAll(function(notification) {
          if (notification.set_localhost_cookie) {
            chrome.notifications.clear('set_localhost_cookie')
          }
          chrome.notifications.create(
            'set_localhost_cookie', // notifyId
            {
              type: 'basic',
              iconUrl: 'assets/images/icon/48.png',
              title: '成功',
              message: `复制${type}环境cookie成功！`
            },
            function(notifyId) {
              console.log('notifyId:', notifyId)
            }
          )
        })
      })
    },
    /**
     * @description: 检测是否已经复制到本地
     */
    checkCookie() {
      chrome.cookies.getAll({
        name: 'CASTGC',
        domain: 'localhost'
      }, (cookies) => {
        const cookieVal = cookies[0]?.value || ''
        for (const item of this.envList) {
          const envCookieVal = this.envMap[item].cookieInfo?.value
          if (envCookieVal === cookieVal) {
            this.envMap[item].copySuccess = true
          } else {
            this.envMap[item].copySuccess = false
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.cp-container {
  border-bottom: 2px solid $-color-sub-grey;
  padding: 10px 20px;
  box-sizing: border-box;
  .m-table {
    border: 1px solid $-color-sub-grey;
    .td {
      flex: 1;
      padding: 6px 0;
      box-sizing: border-box;
      text-align: center;
      border-right: 1px solid $-color-sub-grey;
      &:last-child {
        border-right-width: 0;
      }
    }
  }
  .th {
    .td {
      background-color: $-color-sub-grey;
      color: $-color-font;
      font-weight: 500;
    }
  }
  .tr {
    border-top: 1px solid $-color-sub-grey;
    .td {
      &.btn {
        cursor: pointer;
        font-size: 12px;
        color: $-color-font;
      }
      &.btn:hover {
        color: $-color-hover;
      }

      .copy-icon {
        font-size: 14px;
      }
    }
  }
}
</style>
