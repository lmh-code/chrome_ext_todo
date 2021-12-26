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
    display: flex;
    .todo-wrap__left {
      width: 40%;
      border-right: 1px solid #ececec;
    }
    .todo-wrap__right {
      flex: 1;
    }
  }
</style>
