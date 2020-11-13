<template>
  <div>
    <!--搜索-->
    <div class="search-container">
      <div class="search-inp-container">
        <el-input @keyup.enter.native="handleSearch" placeholder="" v-model="listQuery.username" clearable>
        </el-input>
      </div>
      <el-button class="search-btn" type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
      <el-button class="search-btn" type="primary" icon="el-icon-plus" @click="handleAdd">添加</el-button>
      <el-button class="search-btn" :autofocus="true" icon="el-icon-refresh" @click="refreshHandle">刷新</el-button>
    </div>
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
          <!-- todo-->
          <el-upload
            class="avatar-uploader"
            action=""
            :http-request="uploadImage"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
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
  import {fetchList, delObj, getObj, addObj, putObj} from '@/api/brand'
  import {mapGetters} from 'vuex'

  export default {
    data() {
      return {
        imageUrl: '',
        tableKey: 0,
        listLoading: false,
        list: [],
        listQuery: {
          current: 1,
          size: 10,
          username: ''
        },
        total: 0,
        item_brand_add: false,
        item_brand_update: false,
        item_brand_delete: false,
        item_brand_select: false,
        dialogFormVisible: false,
        form: {
          name: undefined,
          image: undefined,
          letter: undefined
        },
        rules: {
          name: [
            {
              required: true,
              message: '请输入商标名',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 10,
              message: '商标名称长度在 1 到 10 个字符',
              trigger: 'blur'
            }
          ],
          iamge: [
            {
              required: true,
              message: '请上传商标',
              trigger: 'blur'
            }
          ],
          letter: [
            {
              required: true,
              message: '请填写首字母',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 1,
              message: '请填写一个字符',
              trigger: 'blur'
            }
          ]
        },
        textMap: {
          update: '编辑',
          create: '创建'
        },
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
      this.getList()
      this.item_brand_add = this.permissions['/item/brand:add']
      this.item_brand_update = this.permissions['/item/brand:update']
      this.item_brand_delete = this.permissions['/item/brand:delete']
      this.item_brand_select = this.permissions['/item/brand:selete']
    },

    methods: {
      getList() {
        this.listLoading = true
        this.listQuery.isAsc = false
        fetchList(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
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
      },
      bindRoleInfo() {
        this.form.role = []
        this.role.forEach(roleId => {
          const roleInfo = {
            roleId: roleId
          }
          this.form.role.push(roleInfo)
        })
        this.form.sysRoleVoList = this.form.role
      },
      //


      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }
    }
  }

</script>


<style lang='scss' scoped>
  .w347 {
    width: 100%;
  }
</style>
