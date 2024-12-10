export interface listType {
  component: string;
  name: string;
}[]

export const componentsList: listType[] = [
  {
    component: 'List',
    name: '列表'
  },
  {
    component: 'Popover',
    name: '气泡卡片',
  },
  {
    component: 'Drawer',
    name: '抽屉',
  },
  {
    component: 'Modal',
    name: '弹窗',
  },
  {
    component: 'Toast',
    name: '轻提示',
  },
  {
    component: 'Message',
    name: '全局提示',
  },
]