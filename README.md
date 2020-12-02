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

项目启动报错可能性较大 卸载 然后npm install node-sass

表单验证一定要填写prop

```
<el-form-item label="物流单号" prop="logisticsOrderNo">
  <el-input class="w347" v-model="form.data.logisticsOrderNo"></el-input>
</el-form-item>
```

注意await和async的使用

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




img src标签不能直接设置绝对路径，只能使用本前端项目的相对路径




升级EelementUI

~~~
npm uninstall element-ui
npm install element-ui -S
~~~

升级node-sass

~~~
npm uninstall node-sass
cnpm i -g node-sass
~~~

