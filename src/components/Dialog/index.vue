<template>
  <div v-if="visible" class="dialog">
    <div class="container" :style="{width, top}">
      <div v-if="showTitle || showClose" class="title">
        <div v-if="showTitle">
          <span v-if="title">
            {{ title }}
          </span>
          <span v-else>
            <slot name="title" />
          </span>
        </div>
        <span v-if="showClose" class="close-btn" @click="closeDialog">
          <svg-icon
            icon-class="close"
            class-name="close-icon"
          />
        </span>
      </div>
      <div class="content">
        <slot />
      </div>
      <div v-if="showFooter" class="footer">
        <slot name="footer" />
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Dialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '50%'
    },
    top: {
      type: String,
      default: '15vh'
    },
    title: {
      type: String,
      default: ''
    },
    showClose: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showTitle: false,
      showFooter: false
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.showTitle = !!this.$slots.title || this.title
          this.showFooter = !!this.$slots.footer
        }
      }
    }
  },
  methods: {
    closeDialog() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
  .dialog {
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.3);
    .container {
      position: absolute;
      left: 50%;
      transform: translate(-50%);
      background-color: $-color-white;
      border-radius: 4px;
      .title,
      .footer {
        padding: 10px;
      }
      .title {
        display: flex;
        border-bottom: 1px solid $-color-sub-grey;
        justify-content: space-between;
        .close-btn {
          display: flex;
          align-items: center;
          font-size: 20px;
          cursor: pointer;
        }
      }
      .footer {
        border-top: 1px solid $-color-sub-grey;;
      }

      .content {
        padding: 10px;
      }
    }
  }
</style>
