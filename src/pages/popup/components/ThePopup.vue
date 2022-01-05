<template>
  <div class="popup-wrap">
    <header class="header-wrap">
      WorkHelper (v1.0.0)
    </header>
    <div class="container">
      <template v-for="(item, index) of menus">
        <sub-menu
          v-if="item.children && item.children.length"
          :key="index"
          :icon="item.icon"
          :title="item.title"
          :next-icon="item.nextIcon"
          :index="`${index}_${item.url}`"
        >
          <div class="sub-menu-wrap">
            <menu-item
              v-for="(subItem, subIndex) of item.children"
              :key="subIndex"
              :icon="subItem.icon"
              :next-icon="subItem.nextIcon"
              :title="subItem.title"
              :index="`${subIndex}_${subItem.url}`"
            />
          </div>
        </sub-menu>
        <div
          v-else
          :key="`${index}_else`"
          @click="redirectPage(item)"
        >
          <menu-item
            :icon="item.icon"
            :next-icon="item.nextIcon"
            :title="item.title"
            :index="`${index}_${item.url}`"
          />
        </div>
      </template>
    </div>
    <footer class="footer-wrap">
      <div
        v-for="item of links"
        :key="item.id"
        @click="goAddress(item.id)"
      >
        <svg-icon
          :icon-class="item.id"
          class-name="options-icon"
        />
      </div>
    </footer>
  </div>
</template>

<script>
import SubMenu from '@/components/SubMenu/index.vue'
import MenuItem from '@/components/MenuItem/index.vue'
import storage from '@/utils/storage'
const defaultMenus = [
  {
    url: 'todo.html',
    title: 'TODO',
    icon: 'todo'
  },
  {
    title: '办公',
    icon: 'dev',
    children: []
  },
  {
    title: '学习',
    icon: 'study',
    children: []
  },
  {
    title: '其他',
    icon: 'others',
    children: []
  }
]
export default {
  name: 'ThePopup',
  components: {
    SubMenu,
    MenuItem
  },
  data() {
    return {
      message: 'hello chrome ext',
      links: [
        {
          id: 'github',
          iconClass: 'github',
          alt: 'github地址'
        },
        {
          id: 'setting',
          iconClass: 'setting',
          alt: '设置'
        }
      ],
      menus: []
    }
  },
  mounted() {
    // storage.clear()
    storage.get('menus').then(res => {
      if (Object.keys(res).length) {
        console.log('menus res:', res)
        this.menus = res.menus
      } else {
        this.menus = defaultMenus
        storage.set({
          'menus': defaultMenus
        })
      }
    })
  },
  methods: {
    goAddress(id) {
      if (id === 'github') {
        chrome.tabs.create({ url: 'https://github.com/lmh-code/chrome_ext_vue' })
      } else if (id === 'setting') {
        chrome.tabs.create({ url: 'setting.html' })
      }
    },
    redirectPage({ url }) {
      if (!url) {
        return
      }
      chrome.tabs.create({ url })
    }
  }
}
</script>

<style lang="scss" scoped>
  .popup-wrap {
    width: $-base-width;

    .header-wrap,
    .footer-wrap {
      display: flex;
      height: 32px;
      line-height: 32px;
      padding: 0 10px;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
    }
    .header-wrap {
      border-bottom: 1px dashed $-color-sub-grey;
    }

    .container {
      max-height: 360px;
      overflow-y: auto;
      padding: 12px 10px;
      box-sizing: border-box;
      .sub-menu-wrap {
        padding-left: 16px;
      }
    }

    .footer-wrap {
      border-top: 1px dashed $-color-sub-grey;
      .options-icon {
        cursor: pointer;
        font-size: 18px;
      }
    }
  }
</style>
