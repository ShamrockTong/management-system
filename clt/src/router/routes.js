import layoutHeaderAside from "@/layout/header-aside";

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require("@/libs/util.import." + process.env.NODE_ENV);

/**
 * 在主框架内显示
 */

const frameIn = [
  {
    path: "/",
    redirect: { name: "index" },
    component: layoutHeaderAside,
    children: [
      // 首页
      {
        path: "index",
        name: "index",
        meta: {
          auth: true,
          // roles: ['editor-uuid', 'user1-uuid','admin-uuid']
        },
        component: _import("system/index"),
      },
      // 演示页面
      {
        path: "goodslist",
        name: "goodslist",
        meta: {
          title: "商品查询",
          auth: true,
          cache: true,
          // roles: ['editor-uuid', 'user1-uuid','admin-uuid']
        },
        component: _import("demo/goodslist"),
      },
      {
        path: "userslist",
        name: "userslist",
        meta: {
          title: "用户信息",
          auth: true,
          cache: true,
          // roles: ['admin-uuid']
        },
        component: _import("demo/userslist"),
      },
      {
        path: "adduser",
        name: "adduser",
        meta: {
          title: "用户添加",
          auth: true,
          cache: true,
          // roles: ['admin-uuid']
        },
        component: _import("demo/adduser"),
      },
      {
        path: "goodsupordown",
        name: "goodsupordown",
        meta: {
          title: "商品上下架",
          auth: true,
          cache: true,
          // roles: ['editor-uuid','admin-uuid']
        },
        component: _import("demo/goodsupordown"),
      },
      {
        path: "goodsdownList",
        name: "goodsdownList",
        meta: {
          title: "已上架商品",
          auth: true,cache: true,
          // roles: ['editor-uuid', 'user1-uuid','admin-uuid']
        },
        component: _import("demo/goodsdownList"),
      },
      {
        path: "orderslist",
        name: "orderslist",
        meta: {
          title: "订单列表",
          auth: true,cache: true,
          // roles: ['editor-uuid','admin-uuid']
        },
        component: _import("demo/orderslist"),
      },
      {
        path: "addorder",
        name: "addorder",
        meta: {
          title: "添加订单",
          auth: true,cache: true,
          // roles: ['editor-uuid','admin-uuid']
        },
        component: _import("demo/addorder"),
      },
      {
        path: "storagelist",
        name: "storagelist",
        meta: {
          title: "库存查询编辑",
          auth: true,cache: true,
          // roles: ['editor-uuid','admin-uuid']
        },
        component: _import("demo/storagelist"),
      },
      ,
      {
        path: "regcodelist",
        name: "regcodelist",
        meta: {
          title: "注册码",
          auth: true,cache: true,
          // roles: ['editor-uuid','admin-uuid']
        },
        component: _import("demo/regcodelist"),
      },
      // 系统 前端日志
      {
        path: "log",
        name: "log",
        meta: {
          title: "前端日志",
          auth: true,
        },
        component: _import("system/log"),
      },
      // 刷新页面 必须保留
      {
        path: "refresh",
        name: "refresh",
        hidden: true,
        component: _import("system/function/refresh"),
      },
      // 页面重定向 必须保留
      {
        path: "redirect/:route*",
        name: "redirect",
        hidden: true,
        component: _import("system/function/redirect"),
      },
    ],
  },
];

/**
 * 在主框架之外显示
 */
const frameOut = [
  // 登录
  {
    path: "/login",
    name: "login",
    meta: {
      // roles: ['editor-uuid', 'user1-uuid','admin-uuid',null,undefined,'']
      // auth: true
    },
    component: _import("system/login"),
  },
];

/**
 * 错误页面
 */
const errorPage = [
  {
    path: "*",
    name: "404",
    meta: {
      // roles: ['editor-uuid', 'user1-uuid','admin-uuid']
    },
    component: _import("system/error/404"),
  },
];

// 导出需要显示菜单的
export const frameInRoutes = frameIn;
// 重新组织后导出
export default [...frameIn, ...frameOut, ...errorPage];
