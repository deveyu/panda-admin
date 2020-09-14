<template>
  <div>

    <!--分类组件-->
    <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
    <!--竖直分割线-->
    <el-divider direction="vertical"></el-divider>
    <!--table-->
    <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row>
      <el-table-column align="center" prop="id" label="id" width="80">
      </el-table-column>
      <el-table-column align="center" prop="name" label="品牌名" width="180">
      </el-table-column>
      <el-table-column align="center" prop="image" label="商标">
        <template slot-scope="scope">
          <img :src="scope.row.image" width="100" height="50"></img>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="letter" label="首字母">
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="180" v-if="item_brand_update  || item_brand_delete ">
        <template slot-scope="scope">
          <el-button v-if="item_brand_update" size="mini" type="primary" @click="handleEdit(scope.row)">编辑
          </el-button>
          <el-button v-if="item_brand_delete" size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页控制-->
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.current" :page-size="listQuery.size" :page-sizes="[10, 40, 80, 100]"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>


   <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="40%">
         <el-form :model="form" :rules="rules" ref="form" label-width="100px">
           <el-form-item label="品牌名" prop="name">
             <el-input class="w347" v-model="form.name" placeholder="请输入品牌名"></el-input>
           </el-form-item>
           <el-form-item label="商标" prop="name">
             <el-upload
               class="upload-demo"
               drag
               action=""
               multiple>
               <i class="el-icon-upload"></i>
               <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
               <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
             </el-upload>
           </el-form-item>


           <el-form-item label="首字母" prop="mobile">
             <el-input class="w347" v-model="form.letter" placeholder="请输入首字母"></el-input>
           </el-form-item>

         </el-form>
         <div slot="footer" class="dialog-footer">
           <el-button @click="cancel('form')">取 消</el-button>
           <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
           <el-button v-else type="primary" @click="update('form')">修 改</el-button>
         </div>
       </el-dialog>
  </div>
</template>

<script>
  import { fetchList, delObj, getObj, addObj, putObj } from '@/api/spec'
  import { fetchCategory } from '@/api/category'
  import { mapGetters } from 'vuex'

  export default {
    data() {
      return {
        tableKey: 0,
        listLoading: false,
        treeData: [],
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
        dialogFormVisible: false,

        dialogStatus: '',
        role: [],
        rolesOptions: [],
        isDisabled: {
          0: false,
          1: true
        },
        statusOptions: ['0', '1'],
        dialogDeptVisible: false,
        treeDeptData: [],
        checkedKeys: [],
        defaultProps: {
          children: 'childrens',
          label: 'name'
        }
      }
    },

    components: {},
    filters: {
      statusFilter(status) {
        const statusMap = {
          0: '有效',
          1: '无效',
          9: '锁定'
        }
        return statusMap[status]
      }
    },
    computed: {
      ...mapGetters(['permissions'])
    },

    mounted() {
      this.getCategory()
    },

    methods: {
      handleNodeClick(data) {
        //根据分类id查询规格参数组
      },
      getCategory() {
        fetchCategory().then(response => {
          this.treeData = response.data
        })
      },


      refreshHandle() {
        this.listQuery.current = 1
        this.listQuery.size = 10
        this.listQuery.username = ''
        this.getList()
      },
      handleAdd() {
        this.dialogStatus = 'create'
        // this.getRoleList()
        this.dialogFormVisible = true
      },
      handleDelete(row) {
        this.$confirm(
          '此操作将永久删除该品牌(品牌名:' + row.name + '), 是否继续?',
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
      handleSearch() {
        this.listQuery.current = 1
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.size = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.current = val
        this.getList()
      },
      create(formName) {
        const set = this.$refs
        this.bindRoleInfo()
        set[formName].validate(valid => {
          if (valid) {
            addObj(this.form).then(() => {
              this.dialogFormVisible = false
              this.getList()
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
          } else {
            return false
          }
        })
      },
      cancel(formName) {
        this.dialogFormVisible = false
        this.$refs[formName].resetFields()
      },
      update(formName) {
        const set = this.$refs
        this.bindRoleInfo()
        set[formName].validate(valid => {
          if (valid) {
            this.dialogFormVisible = false
            this.form.password = undefined
            putObj(this.form).then(() => {
              this.dialogFormVisible = false
              this.getList()
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
            })
          } else {
            return false
          }
        })
      }
    }
  }

</script>


<style lang='scss' scoped>
  .w347 {
    width: 100%;
  }
</style>
