import request from '@/utils/request'

export function listOrder(query) {
  return request({
    url: 'http://localhost:8080/order/list',
    method: 'post',
    data: query
  })
}

export function updateOrder(data) {
  return request({
    url: 'http://localhost:8080/order/update',
    method: 'post',
    data
  })
}

export function addOrder(data) {
  return request({
    url: 'http://localhost:8080/order/add',
    method: 'post',
    data
  })
}

export function deleteOrder(data) {
  return request({
    url: 'http://localhost:8080/order/delete',
    method: 'post',
    data
  })
}
