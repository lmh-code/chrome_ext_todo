<template>
  <div class="sub-menu">
    <div
      class="sub-menu__top"
      @click="subMenuHandle"
    >
      <svg-icon
        v-if="icon"
        :icon-class="icon"
        class-name="menu-icon"
      />
      <div
        class="menu-item__title"
      >
        {{ title }}
      </div>
      <svg-icon
        v-if="currentIndex === index"
        icon-class="down"
        class-name="next-icon"
      />
      <svg-icon
        v-else
        icon-class="next"
        class-name="next-icon"
      />
    </div>
    <slot v-if="currentIndex === index" />
  </div>
</template>

<script>
export default {
  name: 'SubMenu',
  props: {
    index: {
      type: String,
      default: '-'
    },
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      flag: false,
      currentIndex: ''
    }
  },
  methods: {
    subMenuHandle() {
      if (this.flag) {
        this.flag = false
        this.currentIndex = ''
      } else {
        this.flag = true
        this.currentIndex = this.index
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .sub-menu__top {
    height: $-menu-height;
    display: flex;
    align-items: center;
    justify-content: flex-between;
    cursor: pointer;
    .menu-item__title {
      flex: 1;
      padding-left: 10px;
    }
    .menu-icon {
      font-size: 16px;
    }
    .next-icon {
      font-size: 12px;
    }
    &:hover {
      color: $-color-hover;
    }
  }
</style>
