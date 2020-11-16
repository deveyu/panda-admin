<template>
  <div>
    <div class="search-container">
      <el-button class="search-btn" type="primary" icon="el-icon-plus" @click="handleAdd(undefined)"
                 v-if="item_category_add">添加
      </el-button>
      <el-button class="search-btn" :autofocus="true" icon="el-icon-refresh" @click="refreshHandle">刷新</el-button>
    </div>

    <!--来自自定义组件tree-table-->
    <tree-table :data="data" :expand-all="expandAll" :columns="columns" border>
      <el-table-column label="类目id" align="center" width="200">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" v-if="item_category_update  || item_category_delete ">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" class="mb5" @click="handleAdd(scope.row.id)" icon="el-icon-plus"
                     v-if="item_category_add"></el-button>
          <el-button type="success" size="mini" class="ml10" @click="handleEdit(scope.row.id)" icon="el-icon-edit"
                     v-if="item_category_update"></el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row.id)" icon="el-icon-delete"
                     v-if="item_category_delete"></el-button>
        </template>
      </el-table-column>
    </tree-table>

    <!-- 添加菜单信息 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="40%">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="类目名" prop="username">
          <el-input class="w347" v-model="form.name" placeholder="请输类目名"></el-input>
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

  import treeTable from '@/components/TreeTable'
  import {delObj, getObj, addObj, putObj, getAllCategory} from '@/api/category'
  import {mapGetters} from 'vuex'

  export default {
    components: {
      treeTable
    },
    data() {
      return {
        expandAll: false,

        //todo tree-table展开想为啥单独列出
        columns: [
          {
            text: '类目名称',
            value: 'name',
            width: 300
          }
        ],
        data: [],

        form: {
          name: undefined,
          parentId: undefined,
          isParent: undefined,
          delFlag: undefined,
        },
        rules: {
          name: [
            {
              required: true,
              message: '请输入分类名称',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 20,
              message: '账号长度在 3 到 20 个字符',
              trigger: 'blur'
            }
          ],
        },
        textMap: {
          update: '编辑',
          create: '创建'
        },
        dialogStatus: '',
        dialogFormVisible: false,

        item_category_add: false,
        item_category_update: false,
        item_category_delete: false,
        item_category_select: false,
      }
    },
    filters: {},
    computed: {
      ...mapGetters(['permissions'])
    },
    mounted() {
      this.getData()
      this.item_category_add = this.permissions['/item/category:add']
      this.item_category_update = this.permissions['/item/category:update']
      this.item_category_delete = this.permissions['/item/category:delete']
      //this.item_category_select = this.permissions['/item_category:select']
    },
    methods: {
      async getData() {
        const response = await getAllCategory()
        this.data = response.data
      },
      /**
       * 增
       */
      handleAdd(row) {
        if (row == undefined) {
          this.form.parentId = 0
        } else {
          this.form.parentId = row.parentId
        }
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      create(formName) {
        const set = this.$refs
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


      /**
       * 编辑
       */
      handleEdit(row) {
        this.dialogStatus = 'update'
        this.form.name = row.name
        this.dialogFormVisible = true
      },
      update(formName) {
        const set = this.$refs
        this.bindRoleInfo()
        set[formName].validate(valid => {
          if (valid) {
            this.dialogFormVisible = false
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
      },
      /**
       * 删除
       * @param row
       */
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
          delObj(row.id)
            .then(() => {
              this.getData()
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
            })
            //todo cache方法是干嘛的
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


      cancel(formName) {
        this.dialogFormVisible = false
        this.$refs[formName].resetFields()
      },


      refreshHandle() {
        this.listQuery.current = 1
        this.listQuery.size = 10
        this.getData()
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

      async openEditDialog(id) {
        this.dialog.title = '编辑资源信息'
        // 清除dialog中的数据
        this.clearDialogData()
        const res = await getResourceById(id)
        if (res.code === 0) {
          this.dialog.data = res.data
          this.dialog.data.id = res.data.id
        } else {
          this.$message.error('数据载入失败')
        }
        this.dialog.show = true
      },
      submitHandle() {
        this.$refs['resourceForm'].validate(async valid => {
          if (valid) {
            let res = null
            // 存在id 更新操作 否则就是 新增
            if (this.dialog.data.id) {
              res = await updateReource(this.dialog.data)
            } else {
              res = await saveReource(this.dialog.data)
            }
            if (res.code === 0) {
              this.$message({
                message: this.successMessage,
                type: 'success'
              })
              // todo: 重刷router  有bug 需修复
              // this.$store.dispatch('GetMenu').then(data => {
              //   initMenu(this.$router, data)
              // })
              this.dialog.show = false
              // 重新刷新表格
              this.getData()
              // 清除dialog中的数据
              this.clearDialogData()
              // 重置表单校验状态
              this.$refs['resourceForm'].resetFields()
            } else {
              this.$message.error(this.failMessage)
            }
          } else {
            return false
          }
        })
      },
      closeHandle(done) {
        done()
      },
      clearDialogData() {
        this.dialog.data.id = null
        this.dialog.data.name = null
        this.dialog.data.type = null
        this.dialog.data.path = null
        this.dialog.data.permission = null
        this.dialog.data.component = null
        this.dialog.data.icon = null
        this.dialog.data.sort = 1
        this.dialog.data.parentId = -1
      }
    }
  }
</script>
<style lang="scss" scoped>
  .dialog-container {
    .alert {
      margin-top: 10px;
      margin-bottom: 20px;
    }

    .form-select {
      width: 100%;
    }
  }
</style>


