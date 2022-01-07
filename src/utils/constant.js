export const VERSION = 'v1.0.0' // 版本号

// 初始菜单
export const DEFAULT_MENUS = [
  {
    id: 1,
    level: 1,
    url: 'todo.html',
    title: 'TODO日程清单',
    icon: 'todo',
    readOnly: true
  },
  {
    id: 2,
    level: 1,
    title: '日常办公',
    icon: 'dev',
    children: []
  },
  {
    id: 3,
    level: 1,
    title: '技术提升',
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

export const REFRESH_BADGE = 'refresh_badge' // 消息通信时使用，todo日程管理 增、删、改、查
