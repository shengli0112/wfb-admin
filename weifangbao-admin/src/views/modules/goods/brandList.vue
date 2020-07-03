<template>
<el-card shadow="never" class="aui-card--fill">
  <div class="mod-menu">
    <div class="form-wrap">
        <el-form class="search-form" :inline="true" :model="dataForm" @keyup.enter.native="search()">
            <el-form-item label="品牌中文名：">
                <el-input v-model="dataForm.zh" placeholder="品牌中文名"></el-input>
            </el-form-item>
            <el-form-item label="品牌英文名：">
                <el-input v-model="dataForm.en" placeholder="品牌英文名"></el-input>
            </el-form-item>
            <!-- <el-form-item label="审核状态：">
                <el-select v-model="dataForm.status" @change="search()">
                    <el-option v-for="(item, index)  in statusList" :key="index" :label="item.name" :value="item.key">
                    </el-option>
                </el-select>
            </el-form-item> -->
        </el-form>
    </div>
    <div class="operate-wrap">
        <el-button type="primary" @click="edit()">新增</el-button>
        <el-button type="primary">生成品牌首字母</el-button>
    </div>
  </div>
  <!-- 数据列表 -->
  <el-table :data="dataList" v-loading="dataListLoading" stripe border>
    <el-table-column prop="no" label="编号" header-align="center" align="center"></el-table-column>
    <el-table-column prop="zh" label="品牌中文名" header-align="center" align="center"></el-table-column>
    <el-table-column prop="en" label="品牌英文名" header-align="center" align="center"></el-table-column>
    <el-table-column prop="first" label="品牌首字母" width="110px" header-align="center" align="center"></el-table-column>
    <el-table-column prop="sort" label="排序" header-align="center" align="center"></el-table-column>
    <el-table-column prop="type" label="品牌类型" header-align="center" align="center"></el-table-column>
    <el-table-column label="是否需要审核" header-align="center" align="center">
        <template slot-scope="scope">
            <el-switch
              v-model="isAudit"
              :active-value=1
              :inactive-value=0
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
        </template>
    </el-table-column>
    <el-table-column label="相关" header-align="center" align="center">
        <template slot-scope="scope">
            商品：100  评价：1000
        </template>
    </el-table-column>
    <el-table-column fixed="right" label="操作" header-align="center" align="center">
    <template slot-scope="scope">
        <el-button type="text" size="small"  @click="edit(scope.$index, scope.row)">编辑</el-button>
        <el-button type="text" size="small"  @click="$router.push({path:'/orderManage-orderList/orderDetail', query: {orderId: scope.row.order_id}})">删除</el-button>
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
      <el-form-item label="品牌中文名" prop="zh">
        <el-input class="dialog-input" v-model="editForm.zh" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="品牌英文名" prop="en">
        <el-input class="dialog-input" v-model="editForm.en" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="品牌首字母" prop="first">
        <el-input class="dialog-input" v-model="editForm.first" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="品牌LOGO" prop="logo">
        <el-upload
            class="post-uploader"
            action="http://nsneo-b2c.shanghai.cosmoplat.com/api/upload/img"
            name="img"
            :show-file-list="false"
            :on-success="handleAvatarSuccess1"
            :before-upload="beforeAvatarUpload">
            <img v-if="ruleForm.imageUrl1" :src="ruleForm.imageUrl1" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">需要与商标注册上一致，只能上传jpg/png格式文件，文件不能超过50kb</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="品牌网址" prop="website">
        <el-input class="dialog-input" v-model="editForm.website" placeholder="http://" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input class="dialog-input" v-model="editForm.sort" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item prop="isShow" label="是否显示">
        <el-radio-group v-model="editForm.isShow">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="2">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="isAudit" label="是否需要审核">
        <el-radio-group v-model="editForm.isAudit">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="2">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="品牌持有人" prop="owner">
        <el-input class="dialog-input" v-model="editForm.owner" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
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
        zh: '',
        en: '',
        status: ''
      },
      isAudit: 1,
      ruleForm: {
        imageUrl1: ''
      },
      //   statusList: [
      //     {
      //       key: 0,
      //       name: '全部'
      //     },
      //     {
      //       key: 1,
      //       name: '待审核'
      //     },
      //     {
      //       key: 2,
      //       name: '已拒绝'
      //     },
      //     {
      //       key: 3,
      //       name: '已通过'
      //     }
      //   ],
      dataList: [
        {
          id: 1,
          no: 123,
          zh: '三只松鼠',
          en: 'Three Squirrels',
          first: 'C',
          type: '平台品牌',
          desc: '三只松鼠Feeding Store投食店是三只松鼠股份有限公司从线上转到线下的标志',
          sort: 1,
          status: '已通过'
        }
      ],
      status: '',
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dialogTitle: '',
      dialogEditVisible: false,
      editForm: {},
      rules: {
        // tag_name: { required: true, message: '请填写标签名称', trigger: 'blur' }
      }
    }
  },
  activated () {
    // this.getDataList()
  },
  methods: {
    search () {
      console.log('aaa')
    },
    /**
     * 编辑/添加
     * created by zxf
     * @param {number} index
     * @param {object} item
     */
    edit (index, item) {
      if (item) {
        console.log(item)
        this.dialogTitle = '编辑'
        this.editForm = JSON.parse(JSON.stringify(item))
      } else {
        this.dialogTitle = '添加'
        this.editForm = {
          zh: '',
          en: '',
          first: ''
        }
      }
      this.dialogEditVisible = true
    },
    handleAvatarSuccess1 (res, file) {
      this.ruleForm.imageUrl1 = res.data.url
      console.log(this.ruleForm.imageUrl1)
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg' || 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
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
