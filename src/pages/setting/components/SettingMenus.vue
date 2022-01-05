<template>
  <div>
    <div class="set-items-wrap">
      <div class="flex title">
        <span>配置菜单</span>
        <span class="btn" @click="resetMenus">
          <svg-icon
            icon-class="reset"
            class-name="reset-icon"
          />
          重置菜单
        </span>
      </div>

      <div class="flex" style="margin-top: 18px; align-items: flex-start;">
        <div class="set-menus-wrap">
          <table border="1">
            <tr>
              <td class="th-td-first">
                <div class="tr-td-first-wrap">
                  <span>一级菜单</span>
                </div>
              </td>
              <td class="th-td-second">
                <div class="tr-td-first-wrap">
                  <span>二级菜单</span>
                  <span
                    class="btn btn-add"
                    @click="editSubmenu(1)"
                  >
                    <svg-icon
                      icon-class="add"
                      class-name="add-icon"
                    />
                  </span>
                </div>
              </td>
            </tr>
            <tr v-for="item of menus" :key="item.id">
              <td>
                <div class="tr-td-first-wrap">
                  <span
                    :class="item.readOnly ? '' : 'menu-title'"
                    @click="editMenu(2, item)"
                  >
                    {{ item.title }}
                  </span>
                  <span
                    v-if="!item.readOnly"
                    class="btn"
                    @click="deleteMenu(item, 1)"
                  >
                    <svg-icon
                      icon-class="delete"
                      class-name="delete-icon"
                    />
                  </span>
                </div>
              </td>
              <td>
                <ul v-if="item.children && item.children.length">
                  <li v-for="(subItem, subIndex) of item.children" :key="subIndex" class="sub-menu-item">
                    <span>
                      <span
                        class="menu-title"
                        @click="editSubmenu(2, subItem)"
                      >{{ subItem.title }}</span>
                      <a
                        :href="subItem.url"
                        target="_blank"
                      >{{ subItem.url }}</a>
                    </span>
                    <span class="options btn" @click="deleteMenu(subItem, 2)">
                      <svg-icon
                        icon-class="delete"
                        class-name="delete-icon"
                      />
                    </span>
                  </li>
                </ul>
              </td>
            </tr>
          </table>
        </div>
        <div class="preview-wrap">
          <template v-for="(item, index) of menus">
            <sub-menu
              v-if="item.children && item.children.length"
              :key="index"
              :icon="item.icon"
              :title="item.title"
              :next-icon="item.nextIcon"
              :index="`${index}_${item.url}`"
            >
              <div class="sub-menu-wrap" style="padding-left: 16px;">
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
      </div>
    </div>

    <!-- 编辑一级菜单 -->
    <edit-menu
      :visible.sync="editMenuDisplay"
      :edit-info="editMenuInfo"
      :menus="menus"
      @search="getMenusFromStorage"
    />

    <!-- 编辑二级菜单 -->
    <edit-sub-menu
      :visible.sync="editSubmenuDisplay"
      :menus="menus"
      :edit-info="editSubmenuInfo"
      :title="editSubmenuTitle"
      @search="getMenusFromStorage"
    />
  </div>
</template>

<script>
import { DEFAULT_MENUS } from '@/utils/constant'
import storage from '@/utils/storage'
import SubMenu from '@/components/SubMenu/index.vue'
import MenuItem from '@/components/MenuItem/index.vue'
import EditMenu from './EditMenu.vue'
import EditSubMenu from './EditSubMenu.vue'
export default {
  name: 'SettingMenus',
  components: {
    SubMenu,
    MenuItem,
    EditMenu,
    EditSubMenu
  },
  data() {
    return {
      menus: [],

      editMenuDisplay: false,
      editMenuInfo: {},

      editSubmenuDisplay: false,
      editSubmenuTitle: '',
      editSubmenuInfo: {}
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
          this.menus = JSON.parse(JSON.stringify(DEFAULT_MENUS))
        }
      })
    },
    resetMenus() {
      storage.remove('menus').then(() => {
        this.getMenusFromStorage()
      })
    },
    editMenu(type, row) {
      if (row.readOnly) {
        return
      }
      this.editMenuDisplay = true
      this.editMenuInfo = type === 1 ? {} : { ...row }
    },
    /**
     * @description: 编辑菜单
     * @param {*} type 1 新增 2 编辑
     */
    editSubmenu(type, row) {
      this.editSubmenuDisplay = true
      this.editSubmenuTitle = type === 1 ? '新增二级菜单' : `编辑二级菜单_${row.title}`
      this.editSubmenuInfo = type === 1 ? {} : { ...row }
    },
    /**
     * @description: 删除菜单
     * @param {*} menu 菜单
     */
    deleteMenu(menu, type) {
      if (type === 1) {
        // 删除一级菜单
        const firstMenuIndex = this.menus.findIndex(item => item.id === menu.id)
        this.menus.splice(firstMenuIndex, 1)
      } else {
        // 删除二级菜单
        const firstMenuIndex = this.menus.findIndex(item => item.id === menu.pid)
        if (firstMenuIndex > -1) {
          const subMenus = this.menus[firstMenuIndex].children || []
          const subMenuIndex = subMenus.findIndex(item => item.id === menu.id)
          if (subMenuIndex > -1) {
            subMenus.splice(subMenuIndex, 1)
          }
          const newFirstMenu = {
            ...this.menus[firstMenuIndex],
            children: subMenus
          }
          this.$set(this.menus, firstMenuIndex, newFirstMenu)
        }
      }

      storage.set({
        menus: this.menus
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .btn {
    font-size: 14px;
    cursor: pointer;
  }
  .btn:hover {
    color: $-color-hover;
  }
  .set-items-wrap {
    margin-top: 10px;
    background-color: $-color-white;
    border-radius: 10px;
    padding: 18px 3%;
    .title {
      padding-bottom: 10px;
      border-bottom: 1px solid $-color-sub-grey;
      font-size: 16px;
      font-weight: 500;
    }
  }

  .set-menus-wrap {
    flex: 1;
    height: 100%;
    margin-right: 18px;
    table {
      width: 100%;
      border-collapse: collapse;
      border-color:$-color-sub-grey;
      td {
        box-sizing: border-box;
      }
      .th-td-first,
      .th-td-second {
        background-color: $-color-sub-grey;
      }
      .th-td-first {
        width: 40%;
      }
      .th-td-second {
        width: 60%;
      }

      .menu-title {
        padding: 0;
        cursor: pointer;
      }
      .menu-title:hover {
        color: $-color-hover;
      }

      .tr-td-first-wrap {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 6px 10px;
        min-height: 32px;
        box-sizing: border-box;
        .btn-add {
          padding: 4px 6px;
        }
      }

      .sub-menu-item {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid $-color-sub-grey;
        span {
          padding: 6px 10px;
        }
        .options {
          display: flex;
          align-items: center;
          min-width: 20px;
          border-left: 1px solid $-color-sub-grey;
          padding-left: 10px;
        }
      }
      .sub-menu-item:last-child {
        border-bottom-width: 0;
      }
    }
  }
  .preview-wrap {
    width: $-base-width;
    padding-left: 18px;
    box-sizing: border-box;
  }
</style>
