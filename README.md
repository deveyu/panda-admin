## install

```node
 npm install
```

## dev

```node
npm run dev
```

## build

```
npm run build
```







## point







### axios

　在使用axios时，注意到配置选项中包含params和data两者，以为他们是相同的，实则不然。 

　　因为params是添加到url的请求字符串中的，用于get请求。 

　　而data是添加到请求体（body）中的， 用于post请求。

还有注意restful风格的请求`url: '/admin/dict/parent/' + parentId,`

针对这三种，服务端获取请求参数的方法为

params--@RequestParam

data--@RequestBody实体类

/id--{id},@PathVarible("id")

~~~js
export const getTopDictListByDesc = (param) => {
  return request({
    url: `/admin/dict/top/name?name=${param}`,
    method: 'get'
  })
}

//格式化js
import qs from 'qs'

export function login(username, password) {
  var grantType = 'password'
  var clientId = 'cloud'
  var clientSecret = 'cloud'
  var param = qs.stringify({
    username: username,
    password: password,
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: grantType
  })
  return request({
    url: '/auth/oauth/token',
    method: 'post',
    data: param
  })
}

//es6？
export function getList(params) {
  return request({
    url: '/table/list',
    method: 'get',
    params
  })
}
~~~









升级EelementUI

~~~
npm uninstall element-ui
npm install element-ui@2.6.3 -S
main.js 中 import 'element-ui/lib/theme-chalk/index.css'
npm rebuild node-sass
~~~

