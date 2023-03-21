import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [{
      path: 'index',
      name: 'index',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'el-icon-menu' }
    }]
  },

  {
    path: '/cc',
    component: Layout,
    name: 'cc',
    meta: { title: '个人中心', icon: 'el-icon-truck' },
    children: [
      {
        path: 'customer/query',
        component: () => import('@/views/cc/index'),
        name: 'customerQuery',
        meta: { title: '客户查询', icon: 'el-icon-truck' }
      },

      {
        path: 'order/record',
        component: () => import('@/views/cc/order'),
        name: 'orderRecord',
        meta: { title: '我的订单', icon: 'el-icon-truck' }
      },

      {
        path: 'assignment',
        component: () => import('@/views/cc/assignment'),
        name: 'assignment',
        meta: { title: '我的任务', icon: 'el-icon-truck' }
      }
    ]
  },

  {
    path: '/customer',
    component: Layout,
    name: 'customer',
    children: [
      {
        path: 'manage',
        component: () => import('@/views/manage/customer'),
        name: 'manage',
        meta: { title: '客户管理', icon: 'el-icon-s-custom' }
      }
    ]
  },

  {
    path: '/car',
    component: Layout,
    name: 'car',
    meta: { title: '车源管理', icon: 'el-icon-truck' },
    children: [
      {
        path: 'manage',
        component: () => import('@/views/manage/car/car'),
        name: 'manage',
        meta: { title: '车源列表', icon: 'el-icon-truck' }
      },

      {
        path: 'add',
        component: () => import('@/views/manage/car/newCar'),
        name: 'add',
        meta: { title: '新增车源', icon: 'el-icon-truck' }
      }
    ]
  },

  {
    path: '/business',
    component: Layout,
    name: 'business',
    children: [
      {
        path: 'manage',
        component: () => import('@/views/manage/business'),
        name: '商家管理',
        meta: { title: '商家管理', icon: 'el-icon-s-shop' }
      }
    ]
  },

  {
    path: '/order',
    component: Layout,
    name: 'order',
    children: [
      {
        path: 'manage',
        component: () => import('@/views/manage/order'),
        name: '订单管理',
        meta: { title: '订单管理', icon: 'el-icon-s-order' }
      }
    ]
  },

  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/menu1',
  //   name: 'Nested',
  //   meta: {
  //     title: 'Nested',
  //     icon: 'nested'
  //   }
  //   children: [
  //     {
  //       path: 'menu1',
  //       component: () => import('@/views/nested/menu1/index'), // Parent router-view
  //       name: 'Menu1',
  //       meta: { title: 'Menu1' },
  //       children: [
  //         {
  //           path: 'menu1-1',
  //           component: () => import('@/views/nested/menu1/menu1-1'),
  //           name: 'Menu1-1',
  //           meta: { title: 'Menu1-1' }
  //         },
  //         {
  //           path: 'menu1-2',
  //           component: () => import('@/views/nested/menu1/menu1-2'),
  //           name: 'Menu1-2',
  //           meta: { title: 'Menu1-2' },
  //           children: [
  //             {
  //               path: 'menu1-2-1',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
  //               name: 'Menu1-2-1',
  //               meta: { title: 'Menu1-2-1' }
  //             },
  //             {
  //               path: 'menu1-2-2',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
  //               name: 'Menu1-2-2',
  //               meta: { title: 'Menu1-2-2' }
  //             }
  //           ]
  //         },
  //         {
  //           path: 'menu1-3',
  //           component: () => import('@/views/nested/menu1/menu1-3'),
  //           name: 'Menu1-3',
  //           meta: { title: 'Menu1-3' }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'menu2',
  //       component: () => import('@/views/nested/menu2/index'),
  //       name: 'Menu2',
  //       meta: { title: 'menu2' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
