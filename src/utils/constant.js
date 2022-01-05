export const VERSION = 'v1.0.0' // 版本号

// 初始菜单
export const DEFAULT_MENUS = [
  {
    id: 1,
    level: 1,
    url: 'todo.html',
    title: 'TODO',
    icon: 'todo',
    readOnly: true
  },
  {
    id: 2,
    level: 1,
    title: '办公',
    icon: 'dev',
    children: []
  },
  {
    id: 3,
    level: 1,
    title: '学习',
    icon: 'study',
    children: []
  },
  {
    id: 4,
    level: 1,
    title: '其他',
    icon: 'others',
    children: []
  }
]
