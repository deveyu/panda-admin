<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu :show-timeout="200" :default-active="$route.path" :collapse="isCollapse" mode="vertical" background-color="#304156" text-color="#bfcbd9" active-text-color="#409EFF">
      <sidebar-item v-for="route in permission_routers" :key="route.path" :item="route" :base-path="route.path" />
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
export default {
  components: { SidebarItem },
  computed: {
    //mapGetters 映射getter这个辅助函数仅仅是将 store 中的 getter 映射到局部计算属性
    ...mapGetters([
      'permission_routers',//他最终通过vuex获取到了route.js中的constantRouterMap
      'sidebar'
    ]),
    isCollapse() {
      return !this.sidebar.opened//最终获取到store module中app.js中sidebar的打开状态
    }
  }
}
</script>
