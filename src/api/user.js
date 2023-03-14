import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'http://localhost:8080/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: 'http://localhost:8080/user/info',
    method: 'post',
    data: token
  })
}

export function logout() {
  return request({
    url: 'http://localhost:8080/user/logout',
    method: 'post'
  })
}
