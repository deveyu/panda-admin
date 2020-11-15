import request from '@/utils/request'
export function fetchList(query) {
  return request({
    url: '/item/category/page',
    method: 'get',
    params: query
  })
}
export function getAllCategory(query) {
  return request({
    url: '/item/category/tree',
    method: 'get',
    params: query
  })
}

export function delObj(id) {
  return request({
    url: '/item/category/id/' + id,
    method: 'delete'
  })
}

export function getObj(id) {
  return request({
    url: '/item/category/id/' + id,
    method: 'get'
  })
}
export function putObj(obj) {
  return request({
    url: '/item/category',
    method: 'put',
    data: obj
  })
}
export function addObj(obj) {
  return request({
    url: '/item/category',
    method: 'post',
    data: obj
  })
}
