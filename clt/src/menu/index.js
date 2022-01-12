import { uniqueId } from 'lodash'

/**
 * @description 给菜单数据补充上 path 字段
 * @description https://github.com/d2-projects/d2-admin/issues/209
 * @param {Array} menu 原始的菜单数据
 */
function supplementPath (menu) {
  return menu.map(e => ({
    ...e,
    path: e.path || uniqueId('d2-menu-empty-'),
    ...e.children ? {
      children: supplementPath(e.children)
    } : {}
  }))
}

export const menuHeader = supplementPath([
  { path: '/index', title: '首页', icon: 'home' },
  {
    title: '商品管理',
    icon: 'shopping-bag',
    children: [
      { path: '/goodslist', title: '商品详情信息列表',icon: 'list-ol' },
      { path: '/goodsupordown', title: '商品上下架' ,icon: 'arrows-v'},
      { path: '/goodsdownList', title: '已上架商品',icon: 'toggle-up'}
    ]
  }, 
  {
    title: '用户管理',
    icon: 'user-o',
    children: [
      { path: '/userslist', title: '用户查询' ,icon: 'user'},
      { path: '/adduser', title: '用户添加', icon: 'user-plus' },
    ]
  },
  {
    title: '订单管理',
    icon: 'shopping-cart',
    children: [
      { path: '/orderslist', title: '订单查询' ,icon: 'truck'},
      { path: '/addorder', title: '订单添加' ,icon: 'plus-circle'},
    ]
  },
  {
    title: '库存管理',
    icon: 'cube',
    children: [
      { path: '/storagelist', title: '库存查询编辑' ,icon:'th'},
      // { path: '/addorder', title: '订单添加' },
    ]
  }
])

export const menuAside = supplementPath([
  { path: '/index', title: '首页', icon: 'home' },
  {
    title: '商品管理',
    icon: 'shopping-bag',
    children: [
      { path: '/goodslist', title: '商品详情信息列表' ,icon: 'list-ol'},
      { path: '/goodsupordown', title: '商品上下架' ,icon: 'arrows-v'},
      { path: '/goodsdownList', title: '已上架商品',icon: 'toggle-up'}
    ]
  }, 
  {
    title: '用户管理',
    icon: 'user-o',
    children: [
      { path: '/userslist', title: '用户查询' ,icon: 'user'},
      { path: '/adduser', title: '用户添加' ,icon: 'user-plus'},
    ]
  },
  {
    title: '订单管理',
    icon: 'shopping-cart',
    children: [
      { path: '/orderslist', title: '订单查询',icon: 'truck' },
      { path: '/addorder', title: '订单添加' ,icon: 'plus-circle'},
    ]
  },
  {
    title: '库存管理',
    icon: 'folder-o',
    children: [
      { path: '/storagelist', title: '库存查询编辑' ,icon:'th'},
      // { path: '/addorder', title: '订单添加' },
    ]
  }
])
