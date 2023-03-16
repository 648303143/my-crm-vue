import request from '@/utils/request'

export function listCustomer(query) {
  return request({
    url: 'http://localhost:8080/customer/list',
    method: 'post',
    data: query
  })
}

export function updateCustomer(data) {
  return request({
    url: 'http://localhost:8080/customer/update',
    method: 'post',
    data
  })
}

export function addCustomer(data) {
  return request({
    url: 'http://localhost:8080/customer/add',
    method: 'post',
    data
  })
}

export function deleteCustomer(data) {
  return request({
    url: 'http://localhost:8080/customer/delete',
    method: 'post',
    data
  })
}

