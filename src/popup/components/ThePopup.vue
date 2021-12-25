<template>
  <div>
    <header class="header-wrap">
      WorkHelper (v1.0.0)
    </header>
    <div class="container">
      {{ message }}
    </div>
    <footer class="footer-wrap">
      <svg-icon
        v-for="item of links"
        :key="item.id"
        :icon-class="item.id"
        class-name="options-icon"
      />
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: 'hello chrome ext',
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
  }
}
</script>

<style lang="scss" scoped>
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
    border-bottom: 1px dashed $-color-main-grey;
  }

  .footer-wrap {
    border-top: 1px dashed $-color-main-grey;
    .options-icon {
      cursor: pointer;
      font-size: 18px;
    }
  }
</style>
