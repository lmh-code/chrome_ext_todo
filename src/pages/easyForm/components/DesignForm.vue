<template>
  <el-container class="page-container">
    <el-aside class="left-wrap" width="250px">
      <template v-if="basicComponents.length">
        <section class="left-wrap__label">{{ $t('fm.components.basic.title') }}</section>
        <draggable
          tag="ul"
          class="field_list"
          :list="basicComponents"
          :group="{ name: 'fields', pull: 'clone', put: false }"
          :sort="false"
          :move="handleMove"
          @end="handleMoveEnd"
          @start="handleMoveStart"
        >
          <li v-for="item of basicComponents" :key="item.type">
            <svg-icon
              :icon-class="item.icon"
              class-name="field-icon"
            />
            <span>{{ $t(`fm.components.fields.${item.type}`) }}</span>
          </li>
        </draggable>
      </template>
    </el-aside>
    <el-container>
      <el-header height="44px" class="flex center-wrap__header">
        <section class="h-left-wrap">
          1
        </section>
        <section class="h-right-wrap">
          2
        </section>
      </el-header>
      <el-main class="center-wrap__container">
        <form-info :data="formInfo" :select.sync="currentSelect" />
      </el-main>
    </el-container>
    <el-aside class="right-wrap" width="300px">
      section
    </el-aside>
  </el-container>
</template>

<script>
import Draggable from 'vuedraggable'
import { basicComponents, layoutComponents, advanceComponents } from '../constant.js'
import FormInfo from './FormInfo.vue'
export default {
  name: 'DesignForm',
  components: {
    Draggable,
    FormInfo
  },
  data() {
    return {
      basicComponents,
      layoutComponents,
      advanceComponents,

      // 表单基本信息
      formInfo: {
        list: [],
        config: {
          labelWidth: 100,
          labelPosition: 'right'
        }
      },
      currentSelect: null // 当前选中的表单元素
    }
  },
  created() {
    this.formatData()
  },
  methods: {
    formatData() {
      this.basicComponents = this.basicComponents.map(item => {
        return {
          ...item,
          label: this.$t(`fm.components.fields.${item.type}`)
        }
      })
      this.advanceComponents = this.advanceComponents.map(item => {
        return {
          ...item,
          label: this.$t(`fm.components.fields.${item.type}`)
        }
      })
      this.layoutComponents = this.layoutComponents.map(item => {
        return {
          ...item,
          label: this.$t(`fm.components.fields.${item.type}`)
        }
      })
    },
    handleMoveStart(event) {
      // console.log('开始移动：', event)
    },
    handleMoveEnd(event) {
      console.log('结束移动：', event)
    },
    handleMove() {
      return true
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
  .page-container {
    overflow: hidden;

    .left-wrap {
      border-right: 1px solid $-color-grey-1;
      background-color: $-color-white;
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
          .field-icon {
            margin-left: 8px;
            margin-right: 6px;
            font-size: 14px;
          }
          width: 48%;
          margin: 1%;
          line-height: 28px;
          border: 1px solid #f4f6fc;
          box-sizing: border-box;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          background-color: #f4f6fc;
          font-size: 12px;
          color: $-color-font-2;
          cursor: move;

          &:hover {
            color: $-color-hover;
            border: 1px dashed $-color-hover;
          }
        }
      }
    }
    .right-wrap {
      border-left: 1px solid $-color-grey-1;
      background-color: $-color-white;
    }

    .center-wrap__header {
      padding: 0 10px;
      border-bottom: 2px solid $-color-grey-1;
      background-color: $-color-white;
      .h-left-wrap,
      .h-right-wrap {
        flex: 1;
      }
      .h-right-wrap {
        display: flex;
        justify-content: flex-end;
      }
    }
    .center-wrap__container {
      padding: 0;
      position: relative;
    }
  }
</style>
