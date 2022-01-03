<template>
  <div>
    <div
      v-for="(item, index) of todoList"
      :key="index"
      class="todo-list__item"
      :class="item.complete ? 'complete' : ''"
    >
      <div
        class="complete-status"
        @click="changeCompleteStatus(item)"
      >
        <svg-icon
          v-if="item.complete"
          icon-class="complete"
          class-name="complete-icon"
        />
        <svg-icon
          v-else
          icon-class="doing"
          class-name="doing-icon"
        />
      </div>
      <div
        class="item-content"
        :class="item.complete ? 'complete' : 'normal'"
      >
        <div class="input-wrap">
          <input
            v-if="item.edit"
            ref="inputRef"
            v-model="item.todo_info"
            type="text"
            class="input-text"
            placeholder="请输入内容..."
            @keyup.enter="doConfirmHandle(item)"
          >
          <div
            v-else
            class="input-text"
          >
            {{ item.todo_info }}
          </div>
        </div>
        <div class="bottom-wrap">
          <div class="create-time-wrap">
            <template v-if="item.create_time">
              {{ formatTime(item.create_time) }}
            </template>
          </div>
          <div class="options-wrap">
            <template v-if="item.edit">
              <div class="edit-btn" @click="doConfirmHandle(item)">保存</div>
            </template>
            <template v-else-if="!item.complete">
              <div class="edit-btn" @click="changeEditStatus(item)">编辑</div>
              <div class="delete-btn" @click="doDeleteHandle(item)">删除</div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { parseTime } from '@/utils/index'
export default {
  name: 'TodoList',
  props: {
    todoList: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    setInputFocus() {
      this.$nextTick(() => {
        this.$refs.inputRef[0].focus()
      })
    },
    formatTime(timeStamp) {
      return parseTime(timeStamp) || ''
    },
    changeCompleteStatus(item) {
      this.$emit('complete', item)
    },
    doConfirmHandle(item) {
      this.$emit('save', item)
    },
    changeEditStatus(item) {
      this.$emit('edit', item)
    },
    doDeleteHandle(item) {
      this.$emit('delete', item)
    }
  }
}
</script>

<style scoped lang="scss">
  .todo-list__item {
    display: flex;
    align-items: center;
    border-top: 1px solid $-color-sub-grey;
    &:first-child {
      border-top-width: 0;
    }
    &.complete {
      color: $-color-grey-font;
    }
    .complete-status {
      width: 50px;
      min-height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      .doing-icon,
      .complete-icon {
        font-size: 22px;
        color: $-color-grey-font;
      }
      .complete-icon {
        color: $-color-grey-font;
      }
    }
    .item-content {
      flex: 1;
      position: relative;
      .input-wrap {
        padding-top: 10px;
        margin-left: 10px;
        border-bottom: 1px solid $-color-main-grey;
        .input-text {
          width: 100%;
          min-height: 42px;
          padding: 10px 12px;
          box-sizing: border-box;
          border: 1px solid $-color-white;
          font-size: 14px;
        }
        input[type=text]:focus {
          outline: 0 solid #ffffff;
          border-bottom: 1px solid $-color-main;
        }
      }
    }
    .item-content::before {
      content: '';
      position: absolute;
      top: 25px;
      bottom: 25px;
      width: 2px;
      border-radius: 2px;
    }
    .item-content.complete::before {
      background-color: $-color-success;
    }
    .item-content.normal::before {
      background-color: $-color-main;
    }
    .bottom-wrap {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-left: 10px;
      padding: 8px 12px 10px;
      box-sizing: border-box;
      .create-time-wrap {
        font-size: 12px;
        color: $-color-grey-font;
      }
      .options-wrap {
        display: flex;
        color: $-color-grey-font;
        .edit-btn,
        .delete-btn {
          cursor: pointer;
          font-size: 12px;
        }
        .delete-btn {
          margin-left: 10px;
        }
      }
    }
  }
</style>
