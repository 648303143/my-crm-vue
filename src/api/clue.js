import request from '@/utils/request'

export function listClue(query) {
  return request({
    url: 'http://localhost:8080/clue/list',
    method: 'post',
    data: query
  })
}

export function getAssignment(data) {
  return request({
    url: 'http://localhost:8080/clue/assignment/distribute',
    method: 'post',
    data
  })
}
