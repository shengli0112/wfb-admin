<template>
<el-card shadow="never" class="aui-card--fill">
  <div class="mod-menu">
    <div class="form-wrap">
        <el-form class="search-form" :inline="true" :model="dataForm" @keyup.enter.native="search()">
            <el-form-item label="店铺等级名称：">
                <el-input v-model="dataForm.sgSort" placeholder="店铺等级"></el-input>
            </el-form-item>
        </el-form>
    </div>
    <div class="operate-wrap">
        <el-button type="primary" @click="edit()">新增</el-button>
    </div>
  </div>
  <!-- 数据列表 -->
  <el-table :data="dataList" v-loading="dataListLoading" stripe border>
    <el-table-column prop="sgName" label="等级名称" header-align="center" align="center"></el-table-column>
    <el-table-column prop="sgGoodsLimit" label="可发布商品数" header-align="center" align="center"></el-table-column>
    <el-table-column prop="sgAlbumLimit" label="可上传图片数" header-align="center" align="center"></el-table-column>
    <el-table-column prop="sgPrice" label="收费标准/年" header-align="center" align="center"></el-table-column>
    <el-table-column prop="sgSort" label="级别" header-align="center" align="center"></el-table-column>
    <el-table-column prop="updateDate" label="更新时间" header-align="center" align="center"></el-table-column>
    <el-table-column fixed="right" label="操作" header-align="center" align="center">
    <template slot-scope="scope">
        <el-button type="text" size="small"  @click="edit(scope.$index, scope.row)">编辑</el-button>
        <el-button type="text" size="small"  @click="deleteHandle(scope.row.id)">删除</el-button>
    </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <el-pagination
    @size-change="sizeChangeHandle"
    @current-change="currentChangeHandle"
    :current-page="pageIndex"
    :page-sizes="[10, 20, 50, 100]"
    :page-size="pageSize"
    :total="totalPage"
    layout="total, sizes, prev, pager, next, jumper">
  </el-pagination>
  <!-- 编辑/添加弹窗 -->
  <el-dialog :close-on-click-modal="false" v-if="dialogEditVisible" :title="dialogTitle" :visible.sync="dialogEditVisible">
    <el-form :model="editForm" label-suffix="：" label-width="120px" ref="editForm" :rules="rules">
      <el-form-item label="等级名称" prop="sgName">
        <el-input class="dialog-input" v-model="editForm.sgName" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="可发布商品数" prop="sgGoodsLimit">
        <el-input class="dialog-input" v-model="editForm.sgGoodsLimit">
          <template slot="append">个</template>
        </el-input>
        <span class="input-tips">0表示无限制</span>
      </el-form-item>
      <el-form-item label="可上传图片数" prop="sgAlbumLimit">
        <el-input class="dialog-input" v-model="editForm.sgAlbumLimit">
            <template slot="append">个</template>
        </el-input>
        <span class="input-tips">0表示无限制</span>
      </el-form-item>
      <el-form-item label="收费标准" prop="sgPrice">
        <el-input class="dialog-input" v-model="editForm.sgPrice">
            <template slot="append">元/年</template>
        </el-input><br>
        <span class="input-tips" style="padding-left:0">收费标准，单：元/年，必须为数字，在会员开通或升级店铺时将显示在前台</span>
      </el-form-item>
      <el-form-item label="级别" prop="sgSort">
        <el-input class="dialog-input" v-model="editForm.sgSort" auto-complete="off"></el-input>
        <span class="input-tips">数值越大表明级别越高</span>
      </el-form-item>
    </el-form>
    <!-- <div>权限管理</div>
    <div>
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
        </el-checkbox-group>
    </div> -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogEditVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitEdit()">确 定</el-button>
    </div>
  </el-dialog>
</el-card>
</template>

<script>
export default {
  data () {
    return {
      dataListLoading: false,
      dataForm: {
        sgSort: ''
      },
      isAudit: 1,
      ruleForm: {
        imageUrl1: ''
      },
      dataList: [],
      status: '',
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dialogTitle: '',
      dialogEditVisible: false,
      editForm: {},
      rules: {
        sgName: { required: true, message: '等级名称为必填', trigger: 'blur' },
        sgGoodsLimit: { required: true, message: '可发布数量为必填', trigger: 'blur' },
        sgAlbumLimit: { required: true, message: '可上传图片数量为必填', trigger: 'blur' },
        sgPrice: { required: true, message: '收费标准为必填', trigger: 'blur' },
        sgSort: { required: true, message: '级别为必填', trigger: 'blur' }
      },
      //几组全选的内容
    //   checkAll: false,
    //   checkedCities: [],
    //   cities: ['上海', '北京', '广州', '深圳'],
    //   isIndeterminate: true
    }
  },
  activated () {
    this.getDataList()
  },
  methods: {
    search () {
      this.pageIndex = 1
      this.getDataList()
    },
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('store/storegrade/page'),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'sgName': this.dataForm.sgSort
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(data)
          this.dataList = data.data.list
        } else {
          this.dataList = []
          this.totalCount = 0
        }
        this.dataListLoading = false
      })
    },
    /**
     * 编辑/添加
     * created by zxf
     * @param {number} index
     * @param {object} item
     */
    edit (index, item) {
      if (item) {
        // console.log(item)
        this.dialogTitle = '编辑'
        this.editForm = JSON.parse(JSON.stringify(item))
        console.log(this.editForm)
      } else {
        this.dialogTitle = '添加'
        this.editForm = {
          sgName: '',
          sgGoodsLimit: '',
          sgAlbumLimit: '',
          sgPrice: '',
          sgSort: ''
        }
      }
      this.dialogEditVisible = true
    },
    submitEdit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          let url = '/store/storegrade'
          let typeStyle = 'post'
          const params = {
            sgName: this.editForm.sgName,
            sgAlbumLimit: this.editForm.sgAlbumLimit,
            sgGoodsLimit: this.editForm.sgGoodsLimit,
            sgPrice: this.editForm.sgPrice,
            sg_sort: this.editForm.sgSort,
          }
          if (this.editForm.id) {
            url = '/store/storegrade'
            typeStyle = 'put'
            params.id = this.editForm.id
          }
          // console.log(url)
          this.$http({
            url: this.$http.adornUrl(url),
            method: typeStyle,
            data: this.$http.adornData({
              channel: params
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message.success(this.dialogTitle + '成功！')
              this.dialogEditVisible = false
              this.getDataList()
            } else {
              this.$message.error(data.msg)
            }
          })
        } else {
          console.log('error submit')
          this.$message('信息未填写完整')
        }
      })
    },
    deleteHandle (id) {
      this.$confirm(`确定删除吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('store/storegrade'),
          method: 'delete',
          data: this.$http.adornData(
            [id]
          )
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 800,
              onClose: () => {
                this.getDataList()
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      }).catch(() => {})
    },
    // 分页
    changePage (pageData) {
      this.pageData = pageData
    //   this.getList()
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
    //   this.getList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
    //   this.getList()
    }
  }
}
</script>
<style scoped>
.input-tips {
    padding-left: 10px;
}
.form-wrap {
    border: 1px solid #eee;
    box-sizing: border-box;
    padding-top: 20px;
    margin-top: 10px;
    padding-left: 20px;
}
.operate-wrap {
    height: 60px;
    line-height: 60px;
    border: 1px solid #eee;
    margin-top: 10px;
    padding-left: 20px;
}
.order-select {
    float: right;
    margin-right: 10px;
}
.dialog-input {
    width: 300px;
}
/* 上传样式 */
.post-uploader {
  float: left;
}
.post-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.post-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
