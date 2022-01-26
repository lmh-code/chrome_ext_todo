<template>
  <div class="menus-container">
    <template v-for="(item, index) of menus">
      <sub-menu
        v-if="item.children && item.children.length"
        :key="index"
        :icon="item.icon"
        :title="item.title"
        :next-icon="item.nextIcon"
        :index="`${index}_${item.url}`"
      >
        <div
          v-for="(subItem, subIndex) of item.children"
          :key="subIndex"
          class="sub-menu-wrap"
          @click="redirectPage(subItem)"
        >
          <menu-item
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
</template>

<script>
import { DEFAULT_MENUS } from '@/utils/constant'
import SubMenu from '@/components/SubMenu/index.vue'
import MenuItem from '@/components/MenuItem/index.vue'
import storage from '@/utils/storage'

export default {
  name: 'ThePopup',
  components: {
    SubMenu,
    MenuItem
  },
  data() {
    return {
      menus: []
    }
  },
  mounted() {
    this.getMenusFromStorage()
  },
  methods: {
    getMenusFromStorage() {
      storage.get('menus').then(res => {
        if (Object.keys(res).length) {
          this.menus = res.menus
        } else {
          this.menus = DEFAULT_MENUS
          storage.set({
            'menus': DEFAULT_MENUS
          })
        }
      })
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
  .menus-container {
    overflow-y: auto;
    padding: 10px 20px;
    box-sizing: border-box;
    .sub-menu-wrap {
      padding-left: 16px;
    }
  }

</style>
