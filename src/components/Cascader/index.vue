<template lang="html">
  <el-cascader
    class="filter-item w347"
    v-model="value"
    :options="options"
    @change="handleChange"
    :clearable="clearable"
    :show-all-levels="showAllLevels"
  >
    <!--value所选内容-->
    <!--options选项-->
    <!--clearable是否可清空所选-->
    <!--show-all-levels是否展示全部层级-->
    <!--//todo :props="{ multiple: true, checkStrictly: true }"-->
    <!--//todo :props="{ expandTrigger: 'hover' }"-->
  </el-cascader>
</template>

<script>
  export default {
    props: {
      value: {type: Array}, // value代表编辑回显时父组件传递进来的分类id;也代表添加时子组件传递给父组件的分类id
      options: { // options这个名称来自于父组件:options="categoryData"
        type: Array // 指定传入的类型
      }
    },

    data() {
      return {
        clearable: false,
        showAllLevels: true
      }
    },
    methods: {
      handleChange(value) {
        console.log(value)
        // 传值给父组件
        this.$emit('selectOption', this.value)
      }
    }
  }
</script>
<style lang="css" scoped>

</style>

