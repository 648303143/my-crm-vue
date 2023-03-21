import request from '@/utils/request'

export function listCar(query) {
  return request({
    url: 'http://localhost:8080/car/list',
    method: 'post',
    data: query
  })
}

export function updateCar(data) {
  return request({
    url: 'http://localhost:8080/car/update',
    method: 'post',
    data
  })
}

export function addCar(data) {
  return request({
    url: 'http://localhost:8080/car/add',
    method: 'post',
    data
  })
}

export function deleteCar(data) {
  return request({
    url: 'http://localhost:8080/car/delete',
    method: 'post',
    data
  })
}

export function listBrand(data) {
  return request({
    url: 'http://localhost:8080/car/brand/list',
    method: 'post',
    data
  })
}

export function getSeriesByBrand(data) {
  return request({
    url: 'http://localhost:8080/car/series/getByBrand',
    method: 'post',
    data
  })
}

export function getPicturesByCarId(data) {
  return request({
    url: 'http://localhost:8080/car/getPictures',
    method: 'post',
    data
  })
}
