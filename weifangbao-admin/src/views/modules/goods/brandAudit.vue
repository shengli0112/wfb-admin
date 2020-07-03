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
            <el-form-item label="商家名称：">
                <el-input v-model="dataForm.name" placeholder="商家名称"></el-input>
            </el-form-item>
            <el-form-item label="审核状态：">
                <el-select v-model="dataForm.status" @change="search()">
                    <el-option v-for="(item, index)  in statusList" :key="index" :label="item.name" :value="item.key">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </div>
  </div>
  <!-- 数据列表 -->
  <el-table :data="dataList" v-loading="dataListLoading" stripe border>
    <el-table-column prop="no" label="编号" header-align="center" align="center"></el-table-column>
    <el-table-column prop="name" label="商家名称" header-align="center" align="center"></el-table-column>
    <el-table-column prop="zh" label="品牌中文名" header-align="center" align="center"></el-table-column>
    <el-table-column prop="en" label="品牌英文名" header-align="center" align="center"></el-table-column>
    <el-table-column prop="first" label="品牌图片" width="110px" header-align="center" align="center"></el-table-column>
    <el-table-column prop="desc" label="品牌描述" header-align="center" align="center"></el-table-column>
    <el-table-column prop="type" label="品牌类型" header-align="center" align="center"></el-table-column>
    <el-table-column label="审核状态" header-align="center" align="center">
        <template slot-scope="scope">
            已通过<br>
            <span @click="showAuditHistory()">审核详情</span>
        </template>
    </el-table-column>
    <el-table-column fixed="right" label="操作" header-align="center" align="center">
    <template slot-scope="scope">
        <el-button type="text" size="small"  @click="$router.push({ name: 'goods-brandDetail' })">详情</el-button>
        <el-button type="text" size="small" @click="audit()">通过</el-button>
        <el-button type="text" size="small" @click="audit()">拒绝</el-button>
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
  <!-- 审核详情弹窗 -->
  <el-dialog :close-on-click-modal="false" v-if="dialogEditVisible" title="审核详情" :visible.sync="dialogEditVisible">
    <table class="history-table">
        <tr class="table-head">
            <td>审核时间</td>
            <td>审核人员</td>
            <td>审核结果</td>
            <td>反馈详情</td>
        </tr>
        <tr>
            <td>2017-07-07 16:58:11</td>
            <td>admin</td>
            <td>审核通过</td>
            <td>图片照片不清晰，需要重新上传</td>
        </tr>
    </table>
    <div slot="footer" class="dialog-footer">
    <el-button @click="dialogEditVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogEditVisible = false">确 定</el-button>
    </div>
  </el-dialog>
  <!-- 通过弹窗 -->
  <el-dialog :close-on-click-modal="false" v-if="dialogEditVisible1" title="品牌审核" :visible.sync="dialogEditVisible1">
    <el-input class="audit-textarea" type="textarea" v-model="auditPass"></el-input>
    <div slot="footer" class="dialog-footer">
    <el-button @click="dialogEditVisible1 = false">取 消</el-button>
    <el-button type="primary" @click="dialogEditVisible1 = false">确 定</el-button>
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
        name: '',
        status: ''
      },
      isAudit: 1,
      ruleForm: {
        imageUrl1: ''
      },
      statusList: [
        {
          key: 0,
          name: '全部'
        },
        {
          key: 1,
          name: '待审核'
        },
        {
          key: 2,
          name: '已拒绝'
        },
        {
          key: 3,
          name: '已通过'
        }
      ],
      dataList: [
        {
          id: 1,
          no: 123,
          name: '瑞图科技',
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
      auditPass: '',
      dialogEditVisible: false,
      dialogEditVisible1: false
    }
  },
  activated () {
    // this.getDataList()
  },
  methods: {
    search () {
      console.log('aaa')
    },
    showAuditHistory () {
      this.dialogEditVisible = true
    },
    audit () {
      this.dialogEditVisible1 = true
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
.history-table {
    width: 90%;
    margin: 0 auto;
    border-collapse:collapse;
}
.history-table tr td {
    border: 1px solid #d8d8d8;
    text-align: center;
    height: 60px;
}
.table-head {
    font-size: 18px;
    font-weight: bold;
    background-color: rgb(249, 250, 252);
}
.audit-textarea {
    width: 80%;
}
</style>
