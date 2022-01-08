<template>
  <div class="cp-container">
    <menu-item
      icon="transfer"
      next-icon="down"
      title="Cookie Transfer"
    />
    <div class="m-table">

      <div class="flex th">
        <div class="td left">sit</div>
        <div class="td">uat</div>
      </div>
      <div class="flex tr">
        <div class="td left">
          <img v-if="sitHas" src="~@/assets/images/existence.png" height="20">
          <img v-else src="~@/assets/images/non-existence.png" height="20">
        </div>
        <div class="td">
          <img v-if="uatHas" src="~@/assets/images/existence.png" height="20">
          <img v-else src="~@/assets/images/non-existence.png" height="20">
        </div>
      </div>
      <div class="flex tr">
        <div class="td left btn">
          <span @click="copyCookieHandle('sit')">
            <svg-icon
              icon-class="copy"
              class-name="copy-icon"
            />
            复制
            <svg-icon
              v-if="copySitSuccess"
              icon-class="success"
              class-name="copy-icon"
            />
          </span>
        </div>
        <div class="td btn">
          <span @click="copyCookieHandle('uat')">
            <svg-icon
              icon-class="copy"
              class-name="copy-icon"
            />
            复制
            <svg-icon
              v-if="copyUatSuccess"
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

      sitHas: false,
      sitInfo: {},
      copySitSuccess: false,

      uatHas: false,
      uatInfo: {},
      copyUatSuccess: false
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

        this.sitInfo = cookies.find(item => item.domain === '.longfor.sit')
        this.sitHas = !!(this.sitInfo && this.sitInfo.value)

        this.uatInfo = cookies.find(item => item.domain === '.longfor.uat')
        this.uatHas = !!(this.uatInfo && this.uatInfo.value)

        this.checkCookie()
      })
    },
    copyCookieHandle(type) {
      let cookie = {}
      if (type === 'uat' && this.uatHas) {
        cookie = { ...this.uatInfo }
      } else if (this.sitHas) {
        cookie = { ...this.sitInfo }
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
    checkCookie() {
      chrome.cookies.getAll({
        name: 'CASTGC',
        domain: 'localhost'
      }, (cookies) => {
        const cookieVal = cookies[0]?.value || ''
        if (cookieVal && cookieVal === this.uatInfo.value) {
          this.copyUatSuccess = true
        } else if (cookieVal && cookieVal === this.sitInfo.value) {
          this.copySitSuccess = true
        } else {
          this.copyUatSuccess = false
          this.copySitSuccess = false
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
  border-bottom: 1px dashed $-color-sub-grey;
  padding: 10px;
  box-sizing: border-box;
  .m-table {
    border: 1px solid $-color-sub-grey;
    .td {
      flex: 1;
      padding: 6px 0;
      box-sizing: border-box;
      text-align: center;
      &.left {
        border-right: 1px solid $-color-sub-grey;
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
