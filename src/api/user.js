import request from '@/utils/request'

// 查询用户列表
export function listUser(data) {
  return request({
    url: 'http://localhost:8080/system/user/list',
    method: 'post',
    data
  })
}

// 查询用户详细
export function getUser(data) {
  return request({
    url: 'http://localhost:8080/system/user/get',
    method: 'post',
    data
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: 'http://localhost:8080/system/user/add',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: 'http://localhost:8080/system/user/update',
    method: 'post',
    data: data
  })
}

// 删除用户
export function delUser(userId) {
  return request({
    url: 'http://localhost:8080/system/user/delete',
    method: 'post',
    data: userId
  })
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: '/system/user/profile',
    method: 'get'
  })
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: '/system/user/profile',
    method: 'post',
    data: data
  })
}
