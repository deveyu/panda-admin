<template>
  <div class="container">
    <el-card>
      <el-row type="flex" justify="space-between">
        <el-col v-if="expand" :span="5">
          <el-alert type="info" class="alert-tip" show-icon :closable="false" title=" 当前选择：">
            <span class="select-title">{{chooseCategoryName}}</span>
            <a class="select-clear" v-if="chooseCategoryName" @click="cancelCategoryChoose">取消选择</a>
          </el-alert>
<!--          <el-input v-model="topDesc" placeholder="输入分类名称" clearable>-->
<!--            <el-button slot="append" icon="el-icon-search" @click=""></el-button>-->
<!--          </el-input>-->
          <div class="tree-bar">
            <el-tree ref="tree" :highlight-current="highlight" :data="categoryTreeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
          </div>
        </el-col>
        <el-col :span="1" class="expand">
          <div @click="changeExpand">
            <i :class="expandIcon"></i>
          </div>
        </el-col>
        <el-col :span="span">
          <el-row>
            <el-button icon="el-icon-refresh" size="small">刷新</el-button>
          </el-row>
<!--          <el-alert type="info" class="alert-tip" show-icon :closable="false" title=" 当前选择：">-->
<!--            <span class="select-title">{{selectKey.length}}</span>-->
<!--            <a class="select-clear" v-if="editTitle" @click="cancelEdit">清空</a>-->
<!--          </el-alert>-->
          <el-table :data="specData" border style="width: 100%" v-loading="loading" v-if="!showAddButton">
            <el-table-column align="center" prop="id" label="id" width="80">
            </el-table-column>
            <el-table-column align="center" prop="name" label="分类" width="180">
            </el-table-column>
            <el-table-column align="center" label="创建时间">
              <template slot-scope="scope">
                <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="180" v-if="item_specGroup_update  || item_specGroup_delete ">
              <template slot-scope="scope">
                <el-button v-if="item_specGroup_update" size="mini" type="primary" @click="handleEdit(scope.row)">编辑
                </el-button>
                <el-button v-if="item_specGroup_delete" size="mini" type="danger" @click="handleDelete(scope.row)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary" icon="el-icon-plus" size="small" @click="handleAddSpecData">添加分组</el-button>
          <div class="footer" v-loading="loading">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="searchForm.current" :page-size="searchForm.size" :total="searchForm.total" :page-sizes="[10, 40, 80, 100]" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
          </div>
        </el-col>
      </el-row>
    </el-card>


  </div>
</template>

<script>
import { getAllCategory } from '@/api/category'
import { fetchList } from '@/api/spec'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      //todo 为什么要使用：props属性
      defaultProps: {
        children: 'children',
        //树菜单中显示哪个属性（categoryTreeData）
        label: 'name'
      },

      //规格查询参数
      searchForm: {
        cid: null,//分类id
        name: '',//规格名称
        delFlag: null,
        current: 1,
        size: 10,
        total: 0
      },

      highlight: true,
      //选择分类名称
      chooseCategoryName: '',
      // 分类数据
      categoryTreeData: [],
      // 规格数据
      specData: [],
      //伸缩图标
      expandIcon: 'el-icon-arrow-left',
      //左边菜单是否开始时就展开
      expand: true,


      item_specGroup_add: false,
      item_specGroup_update: false,
      item_specGroup_delete: false,
      item_specGroup_select: false,
    }
  },

  components: {},

  computed: {
    showAddButton: this.specData== undefined || this.specData.length <= 0
  },

  mounted() {
    this.getCategory()
    this.item_specGroup_add = this.permissions['/item/specGroup:add']
    this.item_specGroup_update = this.permissions['/item/specGroup:update']
    this.item_specGroup_delete = this.permissions['/item/specGroup:delete']
    //this.item_spec_select = this.permissions['/item/specGroup:selete']
  },

  methods: {

    //页面加载时加载分类树
    async getCategory(){
      getAllCategory().then(response => {
        this.categoryTreeData = response.data
      })
    },
    //点击树中分类触发
    handleNodeClick(data) {
      this.highlight = true
      //this.editId = data.id
      this.searchForm.cid = data.id
      //this.chooseCategoryName = `${data.desc} (${data.value})`
      //todo ${}是干什么的
      this.chooseCategoryName = `${data.name}`
      this.getSpecPage()
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
    //条件查询规格参数
    async getSpecPage() {
      const res = await fetchList(this.searchForm)
      this.loading = true
      if (res.code === 0) {
        this.specData = res.data.records
        this.searchForm.total = res.data.total
      }
      this.loading = false
    },

    //重置查询条件
    reset() {
      this.searchForm.name = ''
    },


    //在该分类下添加规格参数
    handleAddSpecData() {


    },


    //取消选择分类
    cancelCategoryChoose() {
      this.chooseCategoryName = ''
      this.highlight = false
      //this.editId = null
      this.searchForm.cid = null
      this.getSpecPage()
    },


    //分页
    handleSizeChange(val) {
      this.listQuery.size = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.getList()
    },
    //用于伸缩card
    changeExpand() {
      this.expand = !this.expand
      if (this.expand) {
        this.expandIcon = 'el-icon-arrow-left'
        this.span = 18
      } else {
        this.expandIcon = 'el-icon-arrow-right'
        this.span = 23
      }
    },


  }
}

</script>
<style lang='scss' scoped>
.container {
  .alert-tip {
    background-color: #f0faff;
    border: 1px solid #abdcff;
    margin-top: 10px;
    font-size: 10px;
    margin-bottom: 20px;
  }
  .select-title {
    font-size: 14px;
    font-weight: 600;
    color: #40a9ff;
  }
  .select-clear {
    margin-left: 10px;
    color: #4043ff;
  }
  .tree-bar {
    margin-top: 20px;
  }
  .expand {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .icon {
      cursor: pointer;
    }
    :hover {
      color: #1890ff !important;
    }
  }
}
.is-big {
  font-size: 14px !important;
  width: 28px;
}
label {
  font-weight: 400 !important;
}
</style>
