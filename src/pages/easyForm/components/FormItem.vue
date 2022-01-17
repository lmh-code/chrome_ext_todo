<template>
  <el-form-item
    v-if="element && element.key"
    class="form-item-wrap "
    :label="element.label"
    :class="{active: selectFormItem.key == element.key, 'is_req': element.options.required}"
  >
    <template v-if="element.type == 'input'">
      <el-input
        v-model="element.options.defaultValue"
        :style="{width: element.options.width}"
        :placeholder="element.options.placeholder"
        :disabled="element.options.disabled"
      />
    </template>
  </el-form-item>
</template>

<script>
export default {
  name: 'FormItem',
  props: {
    element: {
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
      selectFormItem: null
    }
  },
  watch: {
    select: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.selectFormItem = newVal
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
