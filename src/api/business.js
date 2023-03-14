import request from '@/utils/request'

export function listBusiness(query) {
  return request({
    url: 'http://localhost:8080/business/list',
    method: 'post',
    data: query
  })
}

export function updateBusiness(data) {
  return request({
    url: 'http://localhost:8080/business/update',
    method: 'post',
    data
  })
}

export function addBusiness(data) {
  return request({
    url: 'http://localhost:8080/business/add',
    method: 'post',
    data
  })
}

export function deleteBusiness(data) {
  return request({
    url: 'http://localhost:8080/business/delete',
    method: 'post',
    data
  })
}
