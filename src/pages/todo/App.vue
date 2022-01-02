<template>
  <div class="todo-wrap">
    <the-calendar
      @change="changeHandle"
    />
    <div class="todo-list-wrap">
      <div class="todo-list">
        <div>{{ curDayInfo }}&nbsp;&nbsp;{{ curLunarDay }}</div>

        <div
          v-if="today !== currentDay"
          class="btn-wrap today"
        >
          <span class="today-txt">{{ today }}</span>
          <svg-icon
            icon-class="rilikuang"
            class-name="rilikuang-icon"
          />
        </div>
        <div class="btn-wrap add">
          <svg-icon
            icon-class="add"
            class-name="add-icon"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TheCalendar from './components/TheCalendar'
export default {
  name: 'Todo',
  components: {
    TheCalendar
  },
  data() {
    return {
      currentDay: new Date().getDate(),
      today: new Date().getDate(), // 今日

      curDayInfo: '',
      curLunarDay: '' // 农历信息
    }
  },
  mounted() {

  },
  methods: {
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
      this.currentDay = day

      this.curDayInfo = `${year}年${month}月${day}日`
      this.curLunarDay = `农历${monthMap[lMonth]}${IMonthCn && IMonthCn !== monthMap[lMonth] ? '(' + IMonthCn + ')' : ''}${IDayCn}`
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
    overflow-y: hidden;
    overflow-x: auto;
    background-color: $-color-main-grey;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .todo-list-wrap {
      flex: 1;
      padding: 18px 3%;
      box-sizing: border-box;
      .todo-list {
        height: 100%;
        background-color: $-color-white;
        border-radius: 18px;
        padding: 3%;
        box-sizing: border-box;
        position: relative;
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
    }
  }
</style>
