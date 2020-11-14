import request from '@/utils/request' //这里的request不是request.js中的service吗
export function fetchList(query) {
  return request({
    url: '/item/brand/page',
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

export function uploadImage(file) {
  const formData = new FormData()
  formData.append('file', file.file)
  return request({
    url: '/item/brand/uploadImage',
    method: 'post',
    data: formData
  })
}



