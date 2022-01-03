<template>
  <div class="todo-wrap">
    <the-calendar
      :collapse="true"
      @change="changeHandle"
    />
    <div class="todo-list-wrap">
      <div class="todo-list">
        <div style="padding-bottom: 18px;">{{ curYear }}年{{ curMonth }}月{{ curDay }}日&nbsp;&nbsp;{{ curLunarDay }}</div>

        <div
          v-if="today !== curDay"
          class="btn-wrap today"
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
        <div
          v-if="todoList.length > 0"
          style="padding-right: 70px;"
        >
          <div
            v-for="(item, index) of todoList"
            :key="index"
            class="todo-list__item"
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
                  <template v-else>
                    <div class="edit-btn" @click="changeEditStatus(item)">编辑</div>
                    <div class="delete-btn" @click="doDeleteHandle(item)">删除</div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
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
    </div>
  </div>
</template>

<script>
import TheCalendar from './components/TheCalendar'
import IndexDB from '@/utils/IndexDB.js'
import { parseTime } from '@/utils/index.js'
export default {
  name: 'Todo',
  components: {
    TheCalendar
  },
  data() {
    return {
      openDBStatus: '',

      curYear: new Date().getFullYear(),
      curMonth: new Date().getMonth() + 1,
      curDay: new Date().getDate(),
      today: new Date().getDate(), // 今日

      curLunarDay: '', // 农历信息
      todoList: []
    }
  },
  async mounted() {
    this.openDBStatus = await IndexDB.openDB() // 连接数据库并创建数据表
    if (this.openDBStatus === 'onsuccess' || this.openDBStatus === 'onupgradeneeded') {
      // 根据索引获取数据
      setTimeout(() => {
        this.getTodoListByKey(`${this.curYear}-${this.curMonth}-${this.curDay}`)
      }, 100)
    }
  },
  methods: {
    formatTime(timeStamp) {
      return parseTime(timeStamp) || ''
    },
    changeHandle({ year, month, day, dayInfo }) {
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
      if (this.openDBStatus === 'onsuccess' || this.openDBStatus === 'onupgradeneeded') {
        this.getTodoListByKey(`${this.curYear}-${this.curMonth}-${this.curDay}`)
      }
    },
    async getTodoListByKey(todoKey) {
      const result = await IndexDB.selectByIndex('chrome_ext_todo', 'todo_key', todoKey)

      if (+result.code === 200) {
        this.todoList = result?.data || []
      }
    },
    addHandle() {
      this.todoList.push({
        todo_key: `${this.curYear}-${this.curMonth}-${this.curDay}`,
        todo_info: '',
        complete: false,
        edit: true
      })
    },
    /**
     * @description: 新增数据
     */
    doConfirmHandle(item) {
      if (item.id) {
        this.doEditHandle(item)
      } else {
        this.doAddHandle(item)
      }
    },
    async doAddHandle(item) {
      const result = await IndexDB.insert('chrome_ext_todo', {
        create_time: new Date().getTime(),
        update_time: item.update_time,
        todo_key: item.todo_key,
        todo_info: item.todo_info,
        complete: false
      })

      if (result.code === 200) {
        this.getTodoListByKey(item.todo_key)
      }
    },
    async doEditHandle(item) {
      const result = await IndexDB.update('chrome_ext_todo', {
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
      this.$nextTick(() => {
        this.$refs.inputRef[0].focus()
      })
    },
    /**
     * @description: 点击是否完成按钮，修改状态
     */
    changeCompleteStatus(item) {
      item.complete = !item.complete
      this.doEditHandle(item)
    },
    /**
     * @description: 删除数据
     */
    async doDeleteHandle(item) {
      const result = await IndexDB.deleteById('chrome_ext_todo', item.id)
      if (result.code === 200) {
        this.getTodoListByKey(item.todo_key)
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .todo-wrap {
    width: 100%;
    min-width: 560px;
    height: 100vh;
    padding: 10px 10%;
    box-sizing: border-box;
    overflow: auto;
    background-color: $-color-main-grey;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .todo-list-wrap {
      flex: 1;
      padding: 0 3%;
      box-sizing: border-box;
      .todo-list {
        height: 100%;
        background-color: $-color-white;
        border-radius: 18px;
        padding: 3%;
        box-sizing: border-box;
        position: relative;
        overflow-y: auto;
        .btn-wrap {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          right: 20px;
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
      }
      .todo-list__item {
        display: flex;
        align-items: center;
        border-top: 1px solid #ececec;
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
            color: $-color-main;
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
