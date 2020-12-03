<template>
  <div>
    <div class="search-container">
      <el-button v-if="item_goods_add" class="search-btn" type="primary" icon="el-icon-plus" @click="handleAdd">添加
      </el-button>
      <el-input v-if="item_goods_select" placeholder="标题" v-model="table.query.name" style="width:200px"
                @keyup.enter.native="getData" clearable/>
      <el-button v-if="item_goods_select" class="search-btn" type="primary" @click="getData">查询</el-button>
      <el-button class="search-btn" :autofocus="true" @click="handleRefresh">重置</el-button>
    </div>

    <el-table v-loading="table.loading" :data="table.data" @sort-change="handleSortChange" border highlight-current-row
              fit>
      <el-table-column align="center" prop="id" label="id" width="80">
      </el-table-column>
      <el-table-column align="center" prop="name" label="商品名" width="180">
      </el-table-column>
      <el-table-column align="center" prop="brandName" label="品牌">
      </el-table-column>
      <el-table-column align="center" prop="categoryName" label="分类">
      </el-table-column>
      <el-table-column align="center" label="创建时间" prop="createTime" :formatter="dateFormat">

      </el-table-column>
      <el-table-column align="center" label="操作" width="180" v-if=" item_goods_update  ||  item_goods_delete ">
        <template slot-scope="scope">
          <el-button @click="handleDetail(scope.row)" type="text" >查看</el-button>
          <span style="margin-right: 10px;"></span>
          <el-dropdown>
            <span class="el-dropdown-link" >
              操作<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button v-if="item_goods_update" type="text" size="small" @click="handleEdit(scope.row)">编辑
                </el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button v-if="item_goods_delete" type="text" size="small" @click="handleDelete(scope.row)">删除
                </el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button v-if="item_goods_update" type="text" size="small" @click="handleUp(scope.row)">上架</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button v-if="item_goods_update" type="text" size="small" @click="handleDown(scope.row)">下架
                </el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!table.loading" class="footer">
      <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle"
                     :current-page.sync="table.query.current"
                     :page-size="table.query.size" :total="table.total" :page-sizes="[10, 40, 80, 100]"
                     layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    </div>
  </div>
</template>

<script>
  import {fetchPage, delObj, getObj, addObj, putObj} from '@/api/goods'
  import {mapGetters} from 'vuex'
  import moment from 'moment'

  export default {
    data() {
      return {
        item_goods_add: false,
        item_goods_update: false,
        item_goods_delete: false,
        item_goods_select: false,
        table: {
          total: 0,
          loading: true,
          data: [{
            id: '',
            name: '',
            saleable: '',
            subTitle: '',
            categoryName: '',
            brandName: '',
            createTime: ''
          }],
          query: {
            size: 10,
            current: 1,
            ascs: '',
            descs: '',
            name: ''
          }
        },
        form: {
          title: '',
          visible: false,
          data: {
            logisticsOrderNo: undefined,
            productName: '',
            productNumber: '',
            pointOrderAddress: {
              name: '',
              mobile: '',
              address: ''
            }
          },
          rules: {
            logisticsOrderNo: [{
              required: true,
              message: '请输入物流单号',
              trigger: 'blur'
            }]
          }
        }

      }
    },

    components: {},
    filters: {},
    watch: {
      // 监听分类变化动态查询品牌
    },
    computed: {
      ...mapGetters(['permissions'])
    },

    mounted() {
      this.getData()
      this.item_goods_add = this.permissions['/item/goods:add']
      this.item_goods_update = this.permissions['/item/goods:update']
      this.item_goods_delete = this.permissions['/item/goods:delete']
      this.item_goods_select = this.permissions['/item/goods:select']
    },

    methods: {
      // 表格相关
      async getData() {
        this.table.loading = true
        const res = await fetchPage(this.table.query)
        if (res.code === 0) {
          this.table.data = res.data.srecords
          this.table.total = res.data.total
        } else {
          this.$message.error('查询错误！')
        }
        this.table.loading = false
      },
      handleRefresh() {
        this.table.query.size = 10
        this.table.query.current = 1
        this.table.query.ascs = ''
        this.table.query.descs = ''
        // todo 待优化
        this.table.query.pointOrderId = ''
        this.table.query.name = ''
        this.table.query.productName = ''
        this.getData()
      },
      sizeChangeHandle(val) {
        this.table.query.size = val
        this.getData()
      },
      currentChangeHandle(val) {
        this.table.query.current = val
        this.getData()
      },
      handleSortChange: function (column) {
        this.table.query.ascs = ''
        this.table.query.descs = ''
        let orderBy = ''
        switch (column.prop) {
          case 'id':
            orderBy = 'po.id_'
            break
          default:
            orderBy = 'po.create_time'
        }
        column.order === 'ascending' ? this.table.query.ascs = orderBy : this.table.query.descs = orderBy
        this.table.query.current = 1
        this.getData()
      },

      handleAdd() {
        this.dialogStatus = 'create'
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
              this.getData()
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
        this.form.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      // 其他通用方法
      dateFormat(row, column) {
        const date = row[column.property]
        if (!date) {
          return ''
        }
        return moment(date).format('YYYY-MM-DD HH:mm:ss')
      }

    }
  }

</script>


<style lang='scss' scoped>
  .w347 {
    width: 100%;
  }
</style>
