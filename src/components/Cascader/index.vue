<template lang="html">
  <el-cascader
    v-model="value"
    :options="options"
    @change="handleChange"
    :clearable="clearable"
    :show-all-levels="showAllLevels"
  >
    <!--value所选内容-->
    <!--options选项-->
    <!--clearable是否可清空所选-->
    <!--show-all-levels是否可展示最后一级-->
    <!--//todo :props="{ multiple: true, checkStrictly: true }"-->
    <!--//todo :props="{ expandTrigger: 'hover' }"-->
  </el-cascader>

</template>

<script>
  export default {
    name: 'Cascader',
    props: {
      options: {   // options这个名称来自于父组件:options="categoryData"
        type: Array //指定传入的类型
      }
    },

    data() {
      return {
        value: [],
        clearable: false,
        showAllLevels: false
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

