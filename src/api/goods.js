import request from '@/utils/request'
export function fetchList(query) {
  return request({
    url: '/item/goods/page',
    method: 'get',
    params: query
  })
}

export function delObj(id) {
  return request({
    url: '/item/brand/id/' + id,
    method: 'delete'
  })
}

export function getObj(id) {
  return request({
    url: '/item/brand/id/' + id,
    method: 'get'
  })
}
export function putObj(obj) {
  return request({
    url: '/item/brand',
    method: 'put',
    data: obj
  })
}
export function addObj(obj) {
  return request({
    url: '/item/brand',
    method: 'post',
    data: obj
  })
}
