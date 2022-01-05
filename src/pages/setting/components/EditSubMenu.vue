<template>
  <app-dialog
    :visible.sync="visible"
    :title="title"
    width="500px"
    @close="closeHandle"
  >
    <div class="dialog-container">
      <div class="edit-item">
        <span class="label">一级菜单：</span>
        <select v-model="editParams.pid">
          <option v-for="item of menusList" :key="item.id" :value="item.id">
            {{ item.title }}
          </option>
        </select>
      </div>
      <div class="edit-item">
        <span class="label">标题：</span>
        <input v-model="editParams.title" type="text" placeholder="请输入标题">
      </div>
      <div class="edit-item">
        <span class="label">跳转链接：</span>
        <input v-model="editParams.url" type="text" placeholder="请输入跳转链接">
      </div>
    </div>
    <div slot="footer" class="footer-wrap">
      <button @click="closeHandle">关闭</button>
      <button class="primary" @click="doSaveHandle">保存</button>
    </div>
  </app-dialog>
</template>

<script>
import storage from '@/utils/storage'
import AppDialog from '@/components/Dialog/index.vue'
export default {
  name: 'EditMenu',
  components: {
    AppDialog
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '新增二级菜单'
    },
    menus: {
      type: Array,
      default: () => []
    },
    editInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      editParams: {
        pid: 0,
        title: '',
        url: ''
      },
      menusList: []
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.editParams = this.$options.data().editParams
          Object.assign(this.editParams, { ...this.editInfo })
          this.menusList = this.menus.filter(item => !item.readOnly)
          this.editParams.pid = this.editParams.pid ? this.editParams.pid : this.menusList[0]?.id
        }
      }
    }
  },
  methods: {
    doSaveHandle() {
      const newMenus = this.menus
      newMenus.forEach(item => {
        if (+item.id === +this.editParams.pid) {
          if (this.editParams.id) {
            const index = item.children.findIndex(item => item.id === this.editParams.id)
            item.children[index] = this.editParams
          } else {
            this.editParams.id = item.children.length + 1
            this.editParams.pid = +this.editParams.pid
            item.children.push(this.editParams)
          }
        }
      })

      storage.set({
        menus: newMenus
      })

      this.closeHandle()
      this.$emit('search')
    },
    closeHandle() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped lang="scss">
.dialog-container {
  padding: 10px 16px;
  .edit-item {
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    min-height: 32px;
    .label {
      width: 120px;
      text-align: right;
    }
    input,
    select {
      flex: 1;
      height: 100%;
      border: 1px solid $-color-sub-grey;
      border-radius: 4px;
      min-height: 30px;
      padding: 0 12px;
    }
  }
}
.footer-wrap {
  text-align: right;
  button {
    cursor: pointer;
    margin-left: 10px;
    min-width: 72px;
    background: $-color-white;
    border: 1px solid $-color-sub-grey;
    border-radius: 4px;
    line-height: 26px;
    &.primary {
      background-color: $-color-main;
      color: $-color-white;
      border: 1px solid $-color-main;
    }
  }
  button:hover {
    border: 1px solid $-color-hover;
  }
  .primary:hover {
    background-color: $-color-hover;
    border: 1px solid $-color-hover;
  }
}
</style>
