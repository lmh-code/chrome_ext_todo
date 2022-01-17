<template>
  <div class="form-info-container">
    <el-form
      class="container-wrap"
      label-suffix=":"
      :label-position="data.config.labelPosition"
      :label-width="`${data.config.labelWidth}px`"
    >
      <draggable
        v-model="data.list"
        class="draggable-wrap"
        :group="{name: 'fields'}"
        :animation="200"
        ghost-class="drag-item"
        handle=".drag-btn"
        @end="handleMoveEnd"
        @add="handleDragAdd"
      >
        <transition-group name="fade" tag="ul" class="form-info-list">
          <li v-for="(element, index) in data.list" :key="index">
            <div v-if="element.type === 'grid'">
              TODO: 网格布局
            </div>
            <div v-else>
              <form-item
                :element="element"
                :select="select"
              />
            </div>
          </li>
        </transition-group>
      </draggable>

      <section v-if="!data.list || !data.list.length" class="empty">
        {{ $t('fm.description.containerEmpty') }}
      </section>
    </el-form>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import FormItem from './FormItem'
export default {
  name: 'FormInfo',
  components: {
    Draggable,
    FormItem
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    select: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {

    }
  },
  methods: {
    handleMoveEnd({ newIndex, oldIndex }) {
      console.log('index', newIndex, oldIndex)
    },
    handleDragAdd(event) {
      const newIndex = event.newIndex
      const key = `${Date.now()}_${Math.random().toString(36).substring(2)}`
      const dataItem = this.data.list[newIndex]

      if (dataItem) {
        this.$set(this.data.list, newIndex, {
          ...dataItem,
          options: {
            ...dataItem.options ? dataItem.options : {},
            remoteFunc: 'func_' + key
          },
          key,
          // 绑定键值
          model: `${dataItem && dataItem.type}_${key}`,
          rules: []
        })
      }
      console.log('移动之后的数据:', this.data.list)
    }
  }
}
</script>

<style scoped lang="scss">
.form-info-container {
  position: absolute;
  top: 10px;
  right: 10px;
  bottom: 10px;
  left: 10px;
  overflow-y: auto;
  background-color: $-color-white;

  .container-wrap {
    height: 100%;
    min-height: 100%;
    position: relative;
    ::v-deep .draggable-wrap {
      height: 100%;
      min-height: 100%;
      .form-info-list {
        height: 100%;
        min-height: 100%;
      }
    }
    .empty {
      position: absolute;
      left: 50%;
      transform: translate(-50%, 0);
      top: 200px;
      color: $-color-grey-font;
      font-size: 16px;
    }
  }
}
</style>
