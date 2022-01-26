<template>
  <div class="qr-container">
    <menu-item
      icon="icon_qrcode"
      title="二维码生成"
      :readonly="true"
    />
    <div class="main-content">
      <div class="web-addr-wrap">
        <input v-model="webAddress" type="text" class="addr-input" placeholder="请输入内容，回车生码">
        <div class="create-qr-btn" @click="createQrCode">生码</div>
      </div>

      <template>
        <div id="canvasWrap" class="qr-code-wrap" />

        <div class="save-btn" @click="saveQrCodeHandle">保存图片</div>
      </template>
    </div>
  </div>
</template>

<script>
import MenuItem from '@/components/MenuItem/index.vue'
const QRCode = require('qrcode')
const QRCodeOptions = {
  width: 186,
  height: 186,
  colorDark: '#000000',
  colorLight: '#ffffff',
  errorCorrectionLevel: 'H'
}

export default {
  name: 'TheCookieTransfer',
  components: {
    MenuItem
  },
  data() {
    return {
      webAddress: ''
    }
  },
  mounted() {
    this.getSelectTabInfo()
  },
  methods: {
    getSelectTabInfo() {
      const queryOptions = { active: true, currentWindow: true }
      chrome.tabs.query(queryOptions, (tabs) => {
        this.webAddress = tabs[0]?.url || ''

        this.createQrCode()
      })
    },
    createQrCode() {
      const container = document.getElementById('canvasWrap')
      container.innerHTML = ''
      const text = this.webAddress
      QRCode.toCanvas(
        text,
        QRCodeOptions,
        function(err, canvas) {
          if (err) throw err
          container.appendChild(canvas)
        }
      )
    },
    saveQrCodeHandle() {
      const text = this.webAddress
      QRCode.toDataURL(text, {
        type: 'image/png',
        ...QRCodeOptions
      }, function(err, url) {
        if (err) throw err

        chrome.downloads.download(
          {
            url,
            filename: 'qrcode.png'
          },
          function(downloadId) {
            console.log('downloadId:', downloadId)
          }
        )
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

</style>
<style scoped lang="scss">
.flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.qr-container {
  border-bottom: 2px solid $-color-sub-grey;
  padding: 10px 20px;
  box-sizing: border-box;
  .web-addr-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .addr-input {
      flex: 1;
      line-height: 32px;
      border-radius: 0;
      border: 1px solid $-color-sub-grey;
      border-right-width: 0;
      border-top-left-radius: 6px;
      border-bottom-left-radius: 6px;
      padding-left: 10px;
      &:focus {
        outline: none;
        border-color: $-color-main;
      }
    }

    .create-qr-btn {
      width: 60px;
      line-height: 32px;
      text-align: center;
      border: 1px solid $-color-main;
      cursor: pointer;
      border-top-right-radius: 6px;
      border-bottom-right-radius: 6px;
      color: $-color-main;
      font-weight: 700;
      &:hover {
        background-color: $-color-main;
        color: $-color-white;
      }
    }
  }

  .qr-code-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .save-btn {
    width: 100px;
    line-height: 30px;
    border: 1px solid $-color-main;
    border-radius: 6px;
    margin: 0 auto;
    text-align: center;
    background-color: $-color-main;
    color: $-color-white;
    cursor: pointer;
    &:hover {
      opacity: 0.7;
    }
  }
}
</style>
