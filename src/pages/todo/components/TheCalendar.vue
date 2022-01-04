<template>
  <div>
    <div class="flex header-wrap">
      <span
        class="pre-btn"
        @click="changeMonth(-1)"
      >
        <svg-icon
          icon-class="pre_month"
          class-name="options-icon"
        />
      </span>
      <div class="checked-date-wrap">
        <span
          class="txt-wrap"
          :class="showYearPopup ? 'active' : ''"
          @click="changeYearPopupToggle"
        >
          {{ checkedYear }}年
        </span>
        <!-- 切换年份的popup弹窗 -->
        <div
          v-if="showYearPopup"
          class="popup-wrap year"
          @mouseleave="showYearPopup = false"
        >
          <div class="flex year-wrap">
            <span class="pre-btn" @click="changeYearRange(-1)">
              <svg-icon
                icon-class="next"
                class-name="next-btn-icon"
              />
            </span>
            <span>{{ firstYear }} 年 - {{ lastYear }} 年</span>
            <span class="next-btn" @click="changeYearRange(1)">
              <svg-icon
                icon-class="next"
                class-name="next-btn-icon"
              />
            </span>
          </div>
          <ul class="list-wrap year">
            <li
              v-for="item of yearList"
              :key="item"
              :class="item === new Date().getFullYear() ? 'cur' : item === checkedYear ? 'active' : ''"
              @click="changeYearByPopup(item)"
            >{{ item }}</li>
          </ul>
        </div>
      </div>
      <div class="checked-date-wrap">
        <span
          class="txt-wrap"
          :class="showMonthPopup ? 'active' : ''"
          @click="changeMonthPopupToggle"
        >
          {{ checkedMonth }}月
        </span>
        <!-- 切换月份的popup弹窗 -->
        <div
          v-if="showMonthPopup"
          class="popup-wrap"
          @mouseleave="showMonthPopup = false"
        >
          <div class="flex year-wrap">
            <span class="pre-btn" @click="changeCurYear(-1)">
              <svg-icon
                icon-class="next"
                class-name="next-btn-icon"
              />
            </span>
            <span>{{ checkedYearTemp }} 年</span>
            <span class="next-btn" @click="changeCurYear(1)">
              <svg-icon
                icon-class="next"
                class-name="next-btn-icon"
              />
            </span>
          </div>
          <ul class="list-wrap">
            <li
              v-for="item of monthList"
              :key="item.value"
              @click="changeMonthByPopup(item.value)"
            >{{ item.label }}</li>
          </ul>
        </div>
      </div>
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
            @click="checkedDayChange(item, item.flag !== 0)"
          >
            <div class="day-wrap__text">{{ item.day }}</div>
            <div
              class="day-wrap-lunar__text"
              :class="item.special ? (item.lunarDay === '初一' ? 'special first' : 'special') : (item.lunarDay === '初一' ? 'first' : '')"
            >{{ item.lunarFestival ? item.lunarFestival : item.festival ? item.festival : item.lunarDay }}</div>
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
import { deepClone } from '@/utils/index'
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
    },
    /**
     * @description: 需要特殊标记的日期
     */
    specialDays: {
      type: Array,
      default: () => []
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

      monthDays: [], // 日历视图中的日期

      yearList: [],
      showYearPopup: false,
      firstYear: '',
      lastYear: '',

      checkedYearTemp: '',
      showMonthPopup: false,
      monthList: [
        {
          label: '一月',
          value: 1
        },
        {
          label: '二月',
          value: 2
        },
        {
          label: '三月',
          value: 3
        },
        {
          label: '四月',
          value: 4
        },
        {
          label: '五月',
          value: 5
        },
        {
          label: '六月',
          value: 6
        },
        {
          label: '七月',
          value: 7
        },
        {
          label: '八月',
          value: 8
        },
        {
          label: '九月',
          value: 9
        },
        {
          label: '十月',
          value: 10
        },
        {
          label: '十一月',
          value: 11
        },
        {
          label: '十二月',
          value: 12
        }
      ]
    }
  },
  watch: {
    collapse: {
      immediate: true,
      handler(newVal) {
        this.isCollapse = newVal
      }
    },
    specialDays: {
      immediate: true,
      handler(newVal) {
        if (newVal && newVal.length) {
          const monthDaysTemp = deepClone(this.monthDays)
          monthDaysTemp.forEach(colItem => {
            colItem.forEach(item => {
              const dayInfo = `${item.year}-${item.month}-${item.day}`
              if (newVal.includes(dayInfo)) {
                item.special = true
              }
            })
          })
          this.monthDays = monthDaysTemp
        }
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
      this.checkedDayChange({
        year: this.checkedYear,
        month: this.checkedMonth,
        day: this.checkedDay
      }, true)
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
          const lunarDayInfo = calendar.solar2lunar(rYear, rMonth, day)
          lastMonthDays.push({
            flag: -1,
            year: rYear,
            month: rMonth,
            day,
            nWeek: lunarDayInfo?.nWeek || '',
            festival: lunarDayInfo?.festival || '',
            lunarFestival: lunarDayInfo?.lunarFestival || '',
            lunarDay: lunarDayInfo?.IDayCn || ''
          })
        } else if (i < (startWeek + fullDay)) {
          // 当月天数
          const day = i + 1 - startWeek
          const lunarDayInfo = calendar.solar2lunar(year, month, day)
          currentMonthDays.push({
            flag: 0,
            year,
            month,
            day,
            nWeek: lunarDayInfo?.nWeek || '',
            festival: lunarDayInfo?.festival || '',
            lunarFestival: lunarDayInfo?.lunarFestival || '',
            lunarDay: lunarDayInfo?.IDayCn || ''
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
          const lunarDayInfo = calendar.solar2lunar(rYear, rMonth, day)
          nextMonthDays.push({
            flag: 1,
            year: rYear,
            month: rMonth,
            day,
            nWeek: lunarDayInfo?.nWeek || '',
            festival: lunarDayInfo?.festival || '',
            lunarFestival: lunarDayInfo?.lunarFestival || '',
            lunarDay: lunarDayInfo?.IDayCn || ''
          })
        }
      }
      const monthDaysTemp = [...lastMonthDays, ...currentMonthDays, ...nextMonthDays]
      this.monthDays = this.arrTranslate(7, monthDaysTemp)
      // console.log(lastMonthDays, currentMonthDays, nextMonthDays)

      this.$emit('month-change', year, month, monthDaysTemp)
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

      this.$emit('day-change', {
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
    },
    /**
     * @description: 显示或者隐藏切换年份的popup弹窗
     */
    changeYearPopupToggle() {
      this.showMonthPopup = false

      // 取当前年所在的10年内的数据
      const checkedYearStr = this.checkedYear.toString()
      const length = checkedYearStr.length
      this.firstYear = Number(`${checkedYearStr.slice(0, length - 1)}0`)
      this.lastYear = Number(`${checkedYearStr.slice(0, length - 1)}9`)

      this.yearList = this.getYearList(this.firstYear, this.lastYear)

      this.showYearPopup = !this.showYearPopup
    },
    getYearList(firstYear, lastYear) {
      firstYear = Number(firstYear)
      lastYear = Number(lastYear)
      const yearList = []
      for (let i = 0; i <= lastYear - firstYear; i++) {
        yearList.push(firstYear + i)
      }
      return yearList
    },
    /**
     * @description: 年份的popup弹窗中切换年份范围
     * @param {*} type 操作类型
     */
    changeYearRange(type) {
      if (type === 1) {
        this.firstYear = this.firstYear + 10
        this.lastYear = this.lastYear + 10
      } else {
        this.firstYear = this.firstYear - 10
        this.lastYear = this.lastYear - 10
      }
      this.yearList = this.getYearList(this.firstYear, this.lastYear)
    },
    /**
     * @description: 通过popup弹窗切换年份
     */
    changeYearByPopup(year) {
      this.showYearPopup = false

      if (+this.checkedYear === +year) {
        return
      }
      this.checkedYear = parseInt(year)
      this.checkedDayChange({
        year,
        month: this.checkedMonth,
        day: this.checkedDay
      }, true)
    },
    /**
     * @description: 显示或者隐藏切换也月份的popup弹窗
     */
    changeMonthPopupToggle() {
      this.showYearPopup = false
      this.showMonthPopup = !this.showMonthPopup
      this.checkedYearTemp = this.checkedYear
    },
    /**
     * @description: 月份popup弹窗中快速切换年份
     * @param {*} dVal 差值
     */
    changeCurYear(dVal) {
      this.checkedYearTemp = this.checkedYearTemp + dVal
    },
    /**
     * @description: 通过popup弹窗切换月份
     */
    changeMonthByPopup(month) {
      this.showMonthPopup = false

      if (+this.checkedMonth === +month) {
        return
      }
      this.checkedMonth = parseInt(month)
      this.checkedDayChange({
        year: this.checkedYearTemp,
        month,
        day: this.checkedDay
      }, true)
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
    font-size: 28px;
    padding: 0 6%;
    box-sizing: border-box;
    justify-content: center;
    .pre-btn,
    .next-btn {
      font-size: 20px;
      cursor: pointer;
    }
    .pre-btn {
      margin-right: 10px;
    }
    .next-btn {
      margin-left: 6px;
    }

    .checked-date-wrap {
      position: relative;
      .txt-wrap {
        cursor: pointer;
        &.active {
          color: $-color-hover;
        }
      }
      .txt-wrap:hover {
        color: $-color-hover;
      }
      .popup-wrap {
        width: 240px;
        position: absolute;
        background-color: $-color-white;
        left: 0;
        top: 40px;
        padding-top: 10px;
        padding-bottom: 16px;
        border-radius: 4px;
        z-index: 2022;
        border: 1px solid $-color-grey-1;
        box-shadow: 0 2px 12px 0 $-color-grey-1;
        color: $-color-font;
        font-size: 14px;
        &.year {
          width: 260px;
        }
        .year-wrap {
          padding: 0 18px 8px;
          font-size: 16px;
          font-weight: 500;
          border-bottom: 1px solid $-color-grey-1;
          .pre-btn,
          .next-btn {
            font-size: 16px;
          }
          .pre-btn {
            transform: rotate(180deg);
          }
        }
        .list-wrap {
          padding: 0 18px;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          li {
            text-align: center;
            width: 33.33%;
            line-height: 38px;
            cursor: pointer;
          }
          &.year {
            li {
              width: 25%;
              &.active {
                color: $-color-hover;
              }
              &.cur {
                color: $-color-hover;
                font-weight: 500;
              }
            }
          }
          li:hover {
            color: $-color-hover;
          }
          &::before {
            content: '';
            width: 10px;
            height: 10px;
            position: absolute;
            top: -5px;
            left: 20px;
            border-top: 1px solid $-color-grey-1;
            border-left: 1px solid $-color-grey-1;
            border-radius: 2px;
            background-color: $-color-white;
            transform: rotate(45deg);
          }
        }
      }
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
        position: relative;
        &.special::after {
          content: "";
          display: block;
          width: 6px;
          height: 6px;
          position: absolute;
          left: 50%;
          margin-left: -3px;
          background-color: $-color-hover;
          border-radius: 50%;
        }
        &.first::before {
          content: "";
          display: block;
          width: 90%;
          height: 1px;
          background-color: $-color-main;
          position: absolute;
          top: 15px;
          left: 50%;
          transform: translate(-50%, 0);
        }
      }
    }
    .day-wrap.checked-day {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      &.c {
        background-color: $-color-main;
        color: $-color-white;
        .special::after {
          background-color: $-color-white;
        }
        .first::before {
          background-color: $-color-white;
        }
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
