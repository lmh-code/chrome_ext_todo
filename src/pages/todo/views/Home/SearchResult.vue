<template>
  <div>
    <div class="search-input-wrap" :class="scroll ? 'bg' : ''">
      <input
        ref="searchInputRef"
        v-model="searchKey"
        autofocus
        type="text"
        class="input-text"
        placeholder="请输入日程信息关键字进行搜索"
        @keyup.enter="doSearchHandle"
      >
      <span class="search-btn" @click="doSearchHandle">
        <svg-icon
          icon-class="search"
          class-name="options-icon"
        />
      </span>
    </div>
    <div id="todoWrap" class="flex todo-wrap" @scroll="scrollHandle">
      <div class="todo-list-wrap">
        <template v-for="(value, key) in searchResult">
          <div v-if="Object.keys(searchResult).length" :key="key" class="todo-list">
            <div :key="key">
              <div class="flex todo-list__header">
                <div class="header-title">
                  {{ key }}
                </div>
              </div>
              <the-todo-list
                ref="theTodoListRef"
                :todo-list="value"
                :read-only="true"
              />
            </div>
          </div>
        </template>
        <div
          v-if="!Object.keys(searchResult).length"
          class="empty-wrap"
        >
          <svg-icon
            icon-class="empty"
            class-name="empty-icon"
          />
          <p class="empty-txt">暂无数据</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { T_TODO_LIST } from '@/DB/constant'
import IndexDB from '@/DB/index'
import TheTodoList from './components/TheTodoList'
let myTimeOut = null
export default {
  name: 'SearchResult',
  components: {
    TheTodoList
  },
  data() {
    return {
      scroll: false,
      searchKey: '',
      searchResult: [],
      total: 0,
      completeTotal: 0
    }
  },
  beforeDestroy() {
    if (myTimeOut) {
      clearTimeout(myTimeOut)
    }
  },
  methods: {
    doSearchHandle() {
      if (!this.searchKey) {
        this.$refs.searchInputRef && this.$refs.searchInputRef.focus()
        return
      }

      this.getDataByCondition(this.searchKey)
    },
    async getDataByCondition(searchKey) {
      const result = await IndexDB.selectByCondition(
        T_TODO_LIST,
        function(value) {
          return value.todo_info.includes(searchKey)
        }
      )
      if (result.code === 200) {
        const data = result?.data || []
        this.total = data.length
        this.completeTotal = data.filter(item => item.complete).length
        this.searchResult = data.reduce((pre, next) => {
          if (!pre[next.todo_key]) {
            pre[next.todo_key] = []
          }
          pre[next.todo_key].push(next)

          return pre
        }, {})
      }
    },
    scrollHandle() {
      const todoWrap = document.getElementById('todoWrap')

      if (myTimeOut) {
        clearTimeout(myTimeOut)
      }
      myTimeOut = setTimeout(() => {
        this.scroll = todoWrap.scrollTop > 100
      }, 0)
    }
  }
}
</script>

<style scoped lang="scss">
  .flex {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .search-input-wrap {
    width: 100%;
    padding: 10px 13%;
    position: fixed;
    box-sizing: border-box;
    z-index: 99;
    &.bg {
      background-color: $-color-white;
    }
    .input-text {
      width: 100%;
      height: 36px;
      padding: 0 30px 0 12px;
      box-sizing: border-box;
      border: 1px solid $-color-hover;
      border-radius: 4px;
    }
    .search-btn {
      display: flex;
      position: absolute;
      right: 15%;
      font-size: 22px;
      top: 50%;
      margin-top: -11px;
      cursor: pointer;
    }
  }
  .todo-wrap {
    width: 100%;
    min-width: 560px;
    height: 100vh;
    padding: 56px 10% 10px 10%;
    box-sizing: border-box;
    overflow: auto;
    background-color: $-color-main-grey;
    .todo-list-wrap {
      flex: 1;
      padding: 0 3%;
      box-sizing: border-box;
      position: relative;
      .todo-list {
        background-color: $-color-white;
        border-radius: 18px;
        padding: 18px 3%;
        box-sizing: border-box;
        margin-top: 12px;
        .todo-list__header {
          padding-bottom: 10px;
          border-bottom: 1px solid $-color-sub-grey;
          flex-direction: row;
          font-size: 16px;
          font-weight: 500;
        }
      }
      .empty-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        margin-top: 30px;
        font-size: 60px;
        .empty-txt {
          font-size: 12px;
          color: $-color-grey-font;
        }
      }
    }
  }
</style>
