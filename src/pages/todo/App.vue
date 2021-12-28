<template>
  <div class="todo-wrap">
    <div class="todo-wrap__left">
      <time-picker />
    </div>
    <div class="todo-wrap__right">
      right
    </div>
  </div>
</template>

<script>
import TimePicker from './components/TimePicker.vue'
export default {
  name: 'Todo',
  components: {
    TimePicker
  }
}
</script>

<style scoped lang="scss">
  .todo-wrap {
    width: 100%;
    height: 100vh;
    display: flex;
    padding: 20px 10%;
    box-sizing: border-box;
    overflow: hidden;
    background-color: $-color-main-grey;
    .todo-wrap__left {
      width: 60%;
      border-right: 1px solid #ececec;
      background-color: $-color-white;
      border-top-left-radius: 16px;
      border-bottom-left-radius: 16px;
    }
    .todo-wrap__right {
      flex: 1;
      background-color: $-color-white;
      border-top-right-radius: 16px;
      border-bottom-right-radius: 16px;
    }
  }
</style>
