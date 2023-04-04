import request from '@/utils/request'

// 查询角色列表
export function listRole(data) {
  return request({
    url: 'http://localhost:8080/system/role/list',
    method: 'post',
    data
  })
}

// 查询角色详细
export function getRole(roleId) {
  return request({
    url: 'http://localhost:8080/system/role/get',
    method: 'post',
    data: roleId
  })
}

// 新增角色
export function addRole(data) {
  return request({
    url: 'http://localhost:8080/system/role/add',
    method: 'post',
    data: data
  })
}

// 修改角色
export function updateRole(data) {
  return request({
    url: 'http://localhost:8080/system/role/update',
    method: 'post',
    data: data
  })
}

// 删除角色
export function delRole(roleId) {
  return request({
    url: 'http://localhost:8080/system/role/delete',
    method: 'post',
    data: roleId
  })
}

export function updateRoleMenu(data) {
  return request({
    url: 'http://localhost:8080/system/role/updateRoleMenu',
    method: 'post',
    data
  })
}

export function updateRoleStatus(roleId, status) {
  return request({
    url: 'http://localhost:8080/system/role/updateStatus',
    method: 'post',
    data: {
      roleId,
      status
    }
  })
}
