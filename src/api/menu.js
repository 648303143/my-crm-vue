import request from '@/utils/request'

// 获取路由
export const getRouters = () => {
  return request({
    url: 'http://localhost:8080/getRouters',
    method: 'post'
  })
}

// 查询菜单列表
export function listMenu(query) {
  return request({
    url: 'http://localhost:8080/system/menu/list',
    method: 'post',
    params: query
  })
}

// 查询菜单详细
export function getMenu(menuId) {
  return request({
    url: '/system/menu/' + menuId,
    method: 'get'
  })
}

// 查询菜单下拉树结构
export function treeselect() {
  return request({
    url: 'http://localhost:8080/system/menu/treeselect',
    method: 'get'
  })
}

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeselect(roleId) {
  return request({
    url: 'http://localhost:8080/system/menu/roleMenuTreeselect',
    method: 'post',
    data: roleId
  })
}

// 新增菜单
export function addMenu(data) {
  return request({
    url: '/system/menu',
    method: 'post',
    data: data
  })
}

// 修改菜单
export function updateMenu(data) {
  return request({
    url: '/system/menu',
    method: 'put',
    data: data
  })
}

// 删除菜单
export function delMenu(menuId) {
  return request({
    url: '/system/menu/' + menuId,
    method: 'delete'
  })
}
