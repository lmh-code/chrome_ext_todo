<template>
  <div class="flex todo-wrap">
    <calendar
      ref="theCalendarRef"
      :collapse="true"
      :special-days="hasScheduleDays"
      @day-change="dayChangeHandle"
      @month-change="monthChangeHandle"
    />

    <div class="flex todo-list-wrap">
      <div
        v-if="showCurrentDay"
        class="btn-wrap today"
        @click="goCurrentDay"
      >
        <span class="today-txt">{{ today }}</span>
        <svg-icon
          icon-class="rilikuang"
          class-name="rilikuang-icon"
        />
      </div>
      <div
        class="btn-wrap add"
        @click="addHandle"
      >
        <svg-icon
          icon-class="add"
          class-name="add-icon"
        />
      </div>
      <div class="todo-list">
        <div class="flex todo-list__header">
          <div class="header-title">
            {{ curYear }}年{{ curMonth }}月{{ curDay }}日&nbsp;&nbsp;{{ curLunarDay }}
          </div>
          <div class="header-right">
            <span class="btn search" @click="linkSearchPage">
              <svg-icon
                icon-class="search"
                class-name="options-icon"
              />
            </span>
          </div>
        </div>
        <the-todo-list
          v-if="todoList.length > 0"
          ref="theTodoListRef"
          :todo-list="todoList"
          @complete="changeCompleteStatus"
          @save="doConfirmHandle"
          @edit="changeEditStatus"
          @delete="doDeleteHandle"
        />
        <div
          v-else
          class="empty-wrap"
        >
          <svg-icon
            icon-class="empty"
            class-name="empty-icon"
          />
          <p class="empty-txt">暂无数据</p>
        </div>
      </div>

      <div
        v-if="completeTodoList.length > 0"
        class="todo-list complete"
      >
        <div class="flex todo-list__header">
          <div class="header-title">
            已完成
          </div>
          <div class="header-right">
            {{ completeTodoList.length }}

            <span
              v-if="isCollapse"
              class="btn"
              @click="isCollapse = false"
            >
              <svg-icon
                icon-class="down"
                class-name="down-icon"
              />
            </span>
            <span
              v-else
              class="btn"
              @click="isCollapse = true"
            >
              <svg-icon
                icon-class="up"
                class-name="up-icon"
              />
            </span>
          </div>
        </div>
        <the-todo-list
          v-if="!isCollapse"
          ref="theCompleteTodoListRef"
          :todo-list="completeTodoList"
          @complete="changeCompleteStatus"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Calendar from '@/components/Calendar'
import TheTodoList from './components/TheTodoList'
import { CHROME_EXT_TODO } from '@/DB/constant'
import IndexDB from '@/DB/index'
export default {
  name: 'Todo',
  components: {
    Calendar,
    TheTodoList
  },
  data() {
    return {
      openDBStatus: '',

      curYear: new Date().getFullYear(),
      curMonth: new Date().getMonth() + 1,
      curDay: new Date().getDate(),
      today: new Date().getDate(), // 今日

      curLunarDay: '', // 农历信息
      todoList: [], // 未完成

      isCollapse: false,
      completeTodoList: [], // 已完成

      hasScheduleDays: [] // 有日程的日期数组
    }
  },
  computed: {
    showCurrentDay() {
      return this.curDay !== new Date().getDate() || this.curMonth !== new Date().getMonth() + 1 || this.curYear !== new Date().getFullYear()
    }
  },
  methods: {
    /**
     * @description: 选中当前日期
     */
    goCurrentDay() {
      this.$nextTick(() => {
        this.$refs.theCalendarRef.checkedDayChange({
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
          day: new Date().getDate()
        }, true)
      })
    },

    dayChangeHandle({ year, month, day, dayInfo }) {
      const monthMap = {
        1: '一月',
        2: '二月',
        3: '三月',
        4: '四月',
        5: '五月',
        6: '六月',
        7: '七月',
        8: '八月',
        9: '九月',
        10: '十月',
        11: '十一月',
        12: '十二月'
      }
      const {
        lMonth,
        IMonthCn,
        IDayCn
      } = dayInfo

      this.curYear = year
      this.curMonth = month
      this.curDay = day

      this.curLunarDay = `农历${monthMap[lMonth]}${IMonthCn && IMonthCn !== monthMap[lMonth] ? '(' + IMonthCn + ')' : ''}${IDayCn}`

      // 日期发生变化获取todoList数据
      this.getTodoListByKey(`${this.curYear}-${this.curMonth}-${this.curDay}`)
    },
    /**
     * @description: 通过制定的key获取当前日的日程
     */
    async getTodoListByKey(todoKey) {
      const result = await IndexDB.selectByIndex(CHROME_EXT_TODO, 'todo_key', todoKey)

      if (+result.code === 200) {
        const data = result?.data || []
        this.todoList = data.filter(item => !item.complete)
        this.completeTodoList = data.filter(item => item.complete)
      }
    },
    monthChangeHandle(year, month, monthDays) {
      this.getDataByCondition(monthDays)
    },
    async getDataByCondition(monthDays) {
      const todoKeys = monthDays.map(item => `${item.year}-${item.month}-${item.day}`)
      const result = await IndexDB.selectByCondition(
        CHROME_EXT_TODO,
        function(value) {
          return todoKeys.includes(value.todo_key)
        }
      )
      if (result.code === 200) {
        const data = result?.data || []
        const keys = data.map(item => item.todo_key)
        this.hasScheduleDays = [...new Set(keys)]
      }
    },
    addHandle() {
      const index = this.todoList.findIndex(item => !item.todo_info)

      if (index > -1) {
        this.todoList[index].edit = true
        this.$set(this.todoList, index, this.todoList[index])
      } else {
        this.todoList.push({
          todo_key: `${this.curYear}-${this.curMonth}-${this.curDay}`,
          todo_info: '',
          complete: false,
          edit: true
        })
      }

      this.$nextTick(() => {
        this.$refs.theTodoListRef.setInputFocus()
      })
    },
    /**
     * @description: 新增 | 编辑数据
     */
    doConfirmHandle(item) {
      if (!item.todo_info) {
        return
      }
      if (item.id) {
        this.doEditHandle(item)
      } else {
        this.doAddHandle(item)
      }
    },
    async doAddHandle(item) {
      const result = await IndexDB.insert(CHROME_EXT_TODO, {
        create_time: new Date().getTime(),
        update_time: item.update_time,
        todo_key: item.todo_key,
        todo_info: item.todo_info,
        complete: false
      })

      if (result.code === 200) {
        this.getTodoListByKey(item.todo_key)

        if (!this.hasScheduleDays.includes(item.todo_key)) {
          this.hasScheduleDays.push(item.todo_key)
        }
      }
    },
    async doEditHandle(item) {
      const result = await IndexDB.updateByPrimaryKey(CHROME_EXT_TODO, {
        id: item.id,
        create_time: item.create_time,
        update_time: new Date().getTime(),
        todo_key: item.todo_key,
        todo_info: item.todo_info,
        complete: item.complete
      })

      if (result.code === 200) {
        this.getTodoListByKey(item.todo_key)
      }
    },
    /**
     * @description: 点击编辑按钮修改编辑状态
     */
    changeEditStatus(item) {
      this.todoList.forEach((todoItem) => {
        todoItem.edit = item.id === todoItem.id
      })

      const index = this.todoList.findIndex(todoItem => item.id === todoItem.id)
      this.todoList[index].edit = true
      this.$set(this.todoList, index, this.todoList[index])

      this.$refs.theTodoListRef.setInputFocus()
    },
    /**
     * @description: 点击是否完成按钮，修改状态
     */
    changeCompleteStatus(item) {
      if (!item.id) {
        console.warn('库中暂无日程信息，不可点击完成！')
        return
      }
      item.complete = !item.complete
      this.doEditHandle(item)
    },
    /**
     * @description: 删除数据
     */
    async doDeleteHandle(item) {
      if (!item.id) {
        console.warn('库中暂无日程信息，不可点击删除！')
        return
      }
      const result = await IndexDB.deleteByPrimaryKey(CHROME_EXT_TODO, item.id)
      if (result.code === 200) {
        this.getTodoListByKey(item.todo_key)
      }
    },

    /**
     * @description: 点击跳转至搜索页面
     */
    linkSearchPage() {
      this.$router.push('/index/result')
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
  .todo-wrap {
    width: 100%;
    min-width: 560px;
    height: 100vh;
    padding: 10px 10%;
    box-sizing: border-box;
    overflow: auto;
    background-color: $-color-main-grey;
    .todo-list-wrap {
      flex: 1;
      padding: 0 3%;
      box-sizing: border-box;
      position: relative;
      .todo-list {
        flex: 1;
        background-color: $-color-white;
        border-radius: 18px;
        padding: 18px 3%;
        box-sizing: border-box;
        &.complete {
          flex: 0;
          margin-top: 10px;
        }
        .todo-list__header {
          padding-bottom: 10px;
          border-bottom: 1px solid $-color-sub-grey;
          flex-direction: row;
          font-size: 16px;
          font-weight: 500;
          .header-right {
            display: flex;
            align-items: center;
            .btn {
              padding: 0 10px 0 20px;
              box-sizing: border-box;
              cursor: pointer;
              font-size: 18px;
              &.search {
                font-size: 22px;
              }
            }
            .btn:hover {
              color: $-color-main;
            }
          }
        }
      }

      .btn-wrap {
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        right: 10%;
        border-radius: 50%;
        cursor: pointer;
        z-index: 99;

        &.today {
          bottom: 80px;
          background-color: $-color-white;
          box-shadow: 0 8px 5px -5px rgba(0,0,0,.4);
          color: $-color-main;
          .today-txt {
            height: 50px;
            width: 50px;
            position: absolute;
            text-align: center;
            line-height: 52px;
            left: 1px;
          }
          .rilikuang-icon {
            font-size: 24px;
          }
        }

        &.add {
          bottom: 20px;
          background-color: $-color-main;
          box-shadow: 0 8px 5px -5px rgba(85, 135, 240, .4);
          color: $-color-white;
          .add-icon {
            font-size: 30px;
          }
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
