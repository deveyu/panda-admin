const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,//用户token
  avatar: state => state.user.avatar,//用户头像
  name: state => state.user.name,//用户名
  roles: state => state.user.roles,//用户角色
  permission_routers: state => state.permission.routers,//用户权限所能访问的路由
  addRouters: state => state.permission.addRouters,
  permissions: state => state.user.permissions
}
export default getters
