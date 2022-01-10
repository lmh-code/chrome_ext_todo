<template>
  <section class="page-container flex">
    <section class="left-wrap">
      <section class="left-wrap__label">
        基础字段
      </section>
      <ul class="field_list">
        <li>
          单行文本
        </li>
        <li>
          多行文本
        </li>
        <li>
          下拉选择框
        </li>
      </ul>
    </section>
    <section class="center-wrap">
      <header class="center-wrap__header">
        asdf
      </header>
    </section>
    <section class="right-wrap">
      section
    </section>
  </section>
</template>

<script>
export default {
  name: 'EasyForm',
  data() {
    return {}
  }
}
</script>
<style scoped lang="scss">
  .flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .page-container {
    overflow: hidden;
    .left-wrap,
    .right-wrap {
      width: 300px;
      height: 100%;
      box-sizing: border-box;
    }
    .left-wrap {
      border-right: 1px solid $-color-grey-1;
      padding: 10px;
      .left-wrap__label {
        padding: 8px 12px;
        font-size: 14px;
      }
      .field_list {
        padding: 0 10px 10px;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        li {
          width: 48%;
          margin: 1%;
        }
      }
    }
    .right-wrap {
      border-left: 1px solid $-color-grey-1;
    }

    .center-wrap {
      flex: 1;
      height: 100%;
      .center-wrap__header {
        height: 44px;
        border-bottom: 2px solid $-color-grey-1;
        box-sizing: border-box;
      }
    }
  }
</style>
