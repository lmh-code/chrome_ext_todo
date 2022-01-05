<template>
  <div class="setting-container">
    <div class="flex header-wrap">
      <div class="title">
        <svg-icon
          icon-class="logo"
          class-name="logo-icon"
        />
        WorkHelper: 配置中心
      </div>
      <div class="version">
        当前版本: {{ version }}
      </div>
    </div>

    <div class="container">
      <setting-menus />
    </div>
  </div>
</template>

<script>
import { VERSION } from '@/utils/constant'
import SettingMenus from './components/SettingMenus.vue'
export default {
  name: 'Setting',
  components: {
    SettingMenus
  },
  data() {
    return {
      version: VERSION
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

.btn {
  font-size: 14px;
  cursor: pointer;
}
.btn:hover {
  color: $-color-hover;
}
.setting-container {
  width: 100%;
  min-width: 560px;
  height: 100vh;
  padding: 10px 10%;
  box-sizing: border-box;
  overflow: auto;
  background-color: $-color-main-grey;

  .header-wrap {
    width: 100%;
    height: 48px;
    padding: 0 20px;
    box-sizing: border-box;
    position: fixed;
    top: 0;
    left: 0;
    background-color: $-color-white;
    .title {
      font-size: 16px;
      font-weight: 500;
      .logo-icon {
        font-size: 22px;
      }
    }
  }
  .container {
    padding: 38px 3% 0;
    box-sizing: border-box;
    position: relative;
  }
}

</style>
