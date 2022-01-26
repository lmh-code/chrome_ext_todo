<template>
  <div class="menu-item " :class="readonly ? 'readonly' : ''">
    <svg-icon
      v-if="icon"
      :icon-class="icon"
      class-name="menu-icon"
    />
    <div class="menu-item__title">{{ title }}</div>
    <svg-icon
      v-if="nextIcon"
      :icon-class="nextIcon"
      class-name="next-icon"
    />
  </div>
</template>
<script>
export default {
  name: 'MenuItem',
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
    },
    nextIcon: {
      type: String,
      default: ''
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      return: {}
    }
  }
}
</script>
<style scoped lang="scss">
  .menu-item {
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
    &.readonly {
      cursor: default;
    }
    &.readonly:hover {
      color: $-color-black;
    }
  }
</style>
