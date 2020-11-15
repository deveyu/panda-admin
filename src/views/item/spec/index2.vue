<template>
  <div>
    <el-container style="height: 500px; border: 1px solid #eee">
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-input
          size="small"
          placeholder="输入类目关键字"
          prefix-icon="el-icon-search"
          v-model="filterText">

        </el-input>
        <!--分类组件-->
        <el-tree :data="treeData" :props="defaultProps" :filter-node-method="filterNode"
                 @node-click="handleNodeClick"></el-tree>
      </el-aside>
      <el-main>
        <!--table-->
        <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row>
          <el-table-column align="center" prop="id" label="id" width="80">
          </el-table-column>
          <el-table-column align="center" prop="name" label="分类" width="180">
          </el-table-column>
          <el-table-column align="center" label="创建时间">
            <template slot-scope="scope">
              <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="180" v-if="item_spec_update  || item_spec_delete ">
            <template slot-scope="scope">
              <el-button v-if="item_spec_update" size="mini" type="primary" @click="handleEdit(scope.row)">编辑
              </el-button>
              <el-button v-if="item_spec_delete" size="mini" type="danger" @click="handleDelete(scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--分页控制-->
        <div v-show="!listLoading" class="pagination-container">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page.sync="listQuery.current" :page-size="listQuery.size"
                         :page-sizes="[10, 40, 80, 100]"
                         layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </el-main>
    </el-container>


  </div>
</template>

<script>
  import { getAllCategory } from '@/api/category'
  import { fetchList } from '@/api/spec'
  import { mapGetters } from 'vuex'

  export default {
    data() {
      return {
        // 分类过滤条件
        filterText: '',
        // 分类数据
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        // 表格数据
        tableKey: 0,
        listLoading: false,
        list: [],
        listQuery: {
          current: 1,
          size: 10,
          username: ''
        },
        total: 0,
        item_spec_add: false,
        item_spec_update: false,
        item_spec_delete: false,
        item_spec_select: false,
        role: [],
        rolesOptions: [],
        isDisabled: {
          0: false,
          1: true
        },
        statusOptions: ['0', '1'],
        dialogDeptVisible: false,
        treeDeptData: [],
        checkedKeys: []
      }
    },

    watch: {
      filterText(val) {
        this.$refs.tree.filter(val)
      }
    },

    components: {},
    filters: {},
    computed: {
      ...mapGetters(['permissions'])
    },

    mounted() {
      this.getCategory()
      this.item_spec_add = this.permissions[' item_spec:add']
      this.item_spec_update = this.permissions[' item_spec:update']
      this.item_spec_delete = this.permissions[' item_spec:delete']
      this.item_spec_select = this.permissions[' item_spec:selete']
    },

    methods: {
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      handleNodeClick(data) {
        console.log(data)
        // 根据分类id查询规格参数组
        this.listLoading = true
        this.listQuery.isAsc = false
        this.listQuery.cid = data.id
        fetchList(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        })
      },
      getCategory() {
        getAllCategory().then(response => {
          this.treeData = response.data
        })
      },
      handleDelete(row) {
        this.$confirm(
          '此操作将永久删除该分类(类目名:' + row.name + '), 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          delObj(row.userId)
            .then(() => {
              this.getList()
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
            })
            .cache(() => {
              this.$notify({
                title: '失败',
                message: '删除失败',
                type: 'error',
                duration: 2000
              })
            })
        })
      },
      handleEdit(row) {
        this.dialogStatus = 'update'
        // this.getRoleList()
        getObj(row.userId).then(response => {
          this.form = response.data
          this.dialogFormVisible = true
          this.dialogStatus = 'update'
          this.role = []
          for (var i = 0; i < row.sysRoleVoList.length; i++) {
            this.role[i] = row.sysRoleVoList[i].roleId
          }
          this.dialogFormVisible = true
        })
      },
      handleSizeChange(val) {
        this.listQuery.size = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.current = val
        this.getList()
      }
    }
  }

</script>


<style lang='scss' scoped>
  .w347 {
    width: 100%;
  }
</style>
