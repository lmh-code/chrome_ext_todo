<template>
  <div>
    <div class="flex header-wrap">
      <div class="header-wrap__date">
        <span
          class="pre-btn"
          @click="changeMonth(-1)"
        >
          <svg-icon
            icon-class="pre_month"
            class-name="options-icon"
          />
        </span>
        <span> {{ checkedYear }}</span>年<span>{{ checkedMonth }}</span>月
        <span
          class="next-btn"
          @click="changeMonth(1)"
        >
          <svg-icon
            icon-class="next_month"
            class-name="options-icon"
          />
        </span>
      </div>

      <div class="header-wrap__btn">
        <span class="search_btn">
          <svg-icon
            icon-class="search"
            class-name="options-icon"
          />
        </span>
      </div>
    </div>
    <div class="flex week-list">
      <div
        v-for="(item, index) of weekList"
        :key="index"
        class="week-list__item"
      >
        {{ item }}
      </div>
    </div>
    <div
      v-for="(colItems, index) of monthDays"
      :key="index"
      class="flex day-list"
    >
      <template v-for="item of colItems">
        <div
          v-if="index === currentColIndex || !isCollapse"
          :key="`${item.year}-${item.month}-${item.day}`"
          class="day-list__item"
          :class="item.flag === -1 ? 'last' : item.flag === 0 ? 'current' : 'next'"
        >
          <div
            class="day-wrap"
            :class="getClass(item)"
            @click="checkedDayChange(item, true)"
          >
            <div class="day-wrap__text">{{ item.day }}</div>
            <div class="day-wrap-lunar__text">{{ item.lunarDay }}</div>
          </div>
        </div>
      </template>
    </div>

    <div
      v-if="showToggle"
      class="flex toggle-btn"
    >
      <span
        v-if="isCollapse"
        class="btn"
        @click="isCollapse = false"
      >
        <svg-icon
          icon-class="down"
          class-name="down-icon"
        />  展开
      </span>
      <span
        v-else
        class="btn"
        @click="isCollapse = true"
      >
        <svg-icon
          icon-class="up"
          class-name="up-icon"
        />  收起
      </span>
    </div>
  </div>
</template>

<script>
import calendar from '@/utils/calendar'
export default {
  props: {
    /**
     * @description: 是否显示折叠收起按钮
     */
    showToggle: {
      type: Boolean,
      default: true
    },
    /**
     * @description: 是否折叠起来
     */
    collapse: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isCollapse: false,
      currentColIndex: 0,

      weekList: ['日', '一', '二', '三', '四', '五', '六'],
      checkedYear: new Date().getFullYear(),
      checkedMonth: new Date().getMonth() + 1,
      checkedDay: new Date().getDate(),

      monthDays: [] // 日历视图中的日期
    }
  },
  watch: {
    collapse: {
      immediate: true,
      handler(newVal) {
        this.isCollapse = newVal
      }
    }
  },
  mounted() {
    this.initCalendar()
  },
  methods: {
    /**
     * @description: 日历初始化
     */
    initCalendar() {
      this.getCalenderInfo(this.checkedYear, this.checkedMonth)

      this.checkedDayChange({
        year: this.checkedYear,
        month: this.checkedMonth,
        day: this.checkedDay
      })
    },
    /**
     * @description: 获取当前被选中的日子的天数
     */
    getClass({ year, month, day }) {
      if (
        this.checkedYear === year &&
        this.checkedMonth === month &&
        this.checkedDay === day &&
        new Date().getFullYear() === year &&
        new Date().getMonth() + 1 === month &&
        new Date().getDate() === day
      ) {
        return 'checked-day c'
      } else if (this.checkedYear === year &&
        this.checkedMonth === month &&
        this.checkedDay === day) {
        return 'checked-day n'
      }
      return ''
    },
    /**
     * @description: 根据年份和月份获取日历控件信息
     * @param {*} year
     * @param {*} month
     */
    getCalenderInfo(year, month) {
      const fullDay = parseInt(new Date(year, month, 0).getDate()) // 当前月总天数
      const startWeek = parseInt(new Date(year, month - 1, 1).getDay()) // 当前月第一天周几
      const lastMonthDay = parseInt(new Date(year, month - 1, 0).getDate()) // 上个月的天数
      const totalDay = (fullDay + startWeek) % 7 === 0 ? (fullDay + startWeek) : fullDay + startWeek + (7 - (fullDay + startWeek) % 7) // 元素总个数

      const lastMonthDays = []
      const currentMonthDays = []
      const nextMonthDays = []
      // 遍历日历格子
      for (let i = 0; i < totalDay; i++) {
        if (i < startWeek) {
          // 当月第一天不是周日的情况下，前面有几个格式是上月的，就渲染上月的天数
          let rYear = ''
          let rMonth = ''
          if (month - 1 < 1) {
            rYear = year - 1
            rMonth = 12
          } else {
            rYear = year
            rMonth = month - 1
          }
          const day = lastMonthDay - startWeek + 1 + i
          lastMonthDays.push({
            flag: -1,
            year: rYear,
            month: rMonth,
            day,
            lunarDay: calendar.solar2lunar(rYear, rMonth, day)?.IDayCn || ''
          })
        } else if (i < (startWeek + fullDay)) {
          // 当月天数
          const day = i + 1 - startWeek
          currentMonthDays.push({
            flag: 0,
            year,
            month,
            day,
            lunarDay: calendar.solar2lunar(year, month, day)?.IDayCn || ''
          })
        } else {
          // 当月最后一天不是周六的时候，剩下的各自就渲染下月的天数
          let rYear = 0
          let rMonth = 0
          if (month + 1 > 12) {
            rYear = year + 1
            rMonth = 1
          } else {
            rYear = year
            rMonth = month + 1
          }
          const day = i + 1 - (startWeek + fullDay)
          nextMonthDays.push({
            flag: 1,
            year: rYear,
            month: rMonth,
            day,
            lunarDay: calendar.solar2lunar(rYear, rMonth, day)?.IDayCn || ''
          })
        }
      }
      const monthDaysTemp = [...lastMonthDays, ...currentMonthDays, ...nextMonthDays]
      this.monthDays = this.arrTranslate(7, monthDaysTemp)
      // console.log(lastMonthDays, currentMonthDays, nextMonthDays)
    },
    /**
     * @description: 数组转换 将一维数组变为二维数组
     * @param {*} num 列数 也就是二维数组中元素的length
     * @return {*} arr 要转换的一维数组
     */
    arrTranslate(num, arr) {
      const result = []
      arr.forEach((item, index) => {
        const pageNum = Math.floor(index / (+num))
        if (!result[pageNum]) {
          result[pageNum] = []
        }
        result[pageNum].push(item)
      })
      return result
    },
    /**
     * @description: 切换当前选中日期
     * @param {*} year
     * @param {*} month
     * @param {*} day
     * @param {boolean} change 月份是否发生改变
     */
    checkedDayChange({ year, month, day }, change) {
      this.checkedYear = year
      this.checkedMonth = month
      this.checkedDay = day

      // 点击的日期是上一个月或者下一个月的日期时，触发获取当月日期信息函数
      if (change === true) {
        this.getCalenderInfo(year, month)
      }

      // 如果折叠 根据当前年月日计算出要展示的行
      if (this.collapse) {
        const index = this.monthDays.findIndex(colItem => colItem.find(item => item.year === year && item.month === month && item.day === day))
        this.currentColIndex = index
      }

      this.$emit('change', {
        year: this.checkedYear,
        month: this.checkedMonth,
        day: this.checkedDay,
        dayInfo: calendar.solar2lunar(year, month, day)
      })
    },
    /**
     * @description: 月份发生变化
     * @param {*} type -1 上一个月     1 下一个月
     * @return {*}
     */
    changeMonth(type) {
      let year = this.checkedYear
      let month = this.checkedMonth
      if (type === 1) {
        if (month + 1 > 12) {
          year = year + 1
          month = 1
        } else {
          month = month + 1
        }
      } else {
        if (month - 1 < 1) {
          year = year - 1
          month = 12
        } else {
          month = month - 1
        }
      }

      const day = year === new Date().getFullYear() && month === new Date().getMonth() + 1 ? new Date().getDate() : 1

      this.checkedDayChange({ year, month, day }, true)
    }
  }
}
</script>

<style lang="scss" scoped>
  .flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: nowrap;
  }

  .header-wrap {
    width: 100%;
    height: 48px;
    padding: 0 6%;
    box-sizing: border-box;
    .header-wrap__date {
      flex: 1;
      display: flex;
      align-items: center;
      font-size: 28px;
      font-weight: 500;
      .pre-btn,
      .next-btn {
        font-size: 22px;
        cursor: pointer;
      }
      .pre-btn {
        margin-right: 4px;
      }
    }
    .search_btn {
      font-size: 22px;
      cursor: pointer;
    }
  }

  .week-list__item,
  .day-list__item {
    width: 14.285%;
    min-width: 60px;
    text-align: center;
  }
  .week-list__item {
    line-height: 30px;
  }

  .day-list__item {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    &.last,
    &.next {
      color: $-color-grey-font;
    }
    .day-wrap {
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .day-wrap__text {
        font-size: 20px;
      }
      .day-wrap-lunar__text {
        font-size: 12px;
      }
    }
    .day-wrap.checked-day {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      &.c {
        background-color: $-color-main;
        color: $-color-white;
      }
      &.n {
        border: 1px solid $-color-main;
      }
    }
  }

  .toggle-btn {
    padding: 10px 0;
    justify-content: center;
    .btn {
      cursor: pointer;
    }
    .btn:hover {
      color: $-color-main;
    }
  }
</style>
