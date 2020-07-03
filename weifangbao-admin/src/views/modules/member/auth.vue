<template>
  <div>

    <el-card shadow="never" class="aui-card--fill">
      <div class="mod-menu">
        <div class="form-wrap">
          <el-form class="search-form" :inline="true" :model="dataForm" @keyup.enter.native="search()">
            <el-form-item label="会员帐号：">
              <el-input v-model="dataForm.username" placeholder="会员账号是手机号码" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-select v-model="dataForm.status" placeholder="状态" clearable>
                <el-option label="待审核" :value="1"></el-option>
                <el-option label="审核通过" :value="2"></el-option>
                <el-option label="审核拒绝" :value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- 数据列表 -->
        <el-table :data="dataList" v-loading="dataListLoading" stripe border>
          <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
          <el-table-column prop="avatar" label="用户头像" header-align="center" align="center" width="95">
            <template slot-scope="scope">
              <img :src="scope.row.avatar" alt="" class="userimg">
            </template>
          </el-table-column>
          <el-table-column prop="mobile" label="手机号" header-align="center" align="center">
            <template slot-scope="scope">
              {{scope.row.mobile}}
            </template>
          </el-table-column>
          <el-table-column prop="companyName" label="公司名称" header-align="center" align="center">
            <template slot-scope="scope">
              {{scope.row.companyName}}
            </template>
          </el-table-column>
          <el-table-column prop="companyAddress" label="公司地址" header-align="center" align="center">
            <template slot-scope="scope">
              {{scope.row.companyAddress}}
            </template>
          </el-table-column>
          <el-table-column prop="businessLicense" label="职业营照" header-align="center" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.businessLicense" alt="" class="campImg">
            </template>
          </el-table-column>
          <el-table-column prop="statusName" label="状态" header-align="center" align="center">
            <template slot-scope="scope">
              {{scope.row.statusName}}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" header-align="center" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="showDetail(scope.row.id)">详情</el-button>
              <el-button type="text" @click="showCheckDialog(scope.row.id,2)" v-if="scope.row.status == 1">通过</el-button>
              <el-button type="text" @click="showCheckDialog(scope.row.id,3)" v-if="scope.row.status == 1">拒绝</el-button>
              <!-- <el-button type="text" size="small" @click="audit()">账户明细</el-button> -->
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
        <!-- 详情弹窗 -->
        <el-dialog width='80%' :close-on-click-modal="false" v-if="dialogEditVisible1" :title="'会员认证详情'"
                   :visible.sync="dialogEditVisible1">
          <table class="history-table">
            <tr class="table-head">
              <td class="info-topic" colspan="2">实名认证</td>
            </tr>
            <tr>
              <td class="bg-dark">用户头像：</td>
              <td><img :src="info.avatar" alt="" class="cmpUserimg"></td>
            </tr>
            <tr>
              <td class="bg-dark">手机号：</td>
              <td class="info-cont">{{info.nickname}}</td>
            </tr>
            <tr>
              <td class="bg-dark">公司名称：</td>
              <td class="info-cont">{{info.companyName}}</td>
            </tr>
            <tr>
              <td class="bg-dark">门店地址：</td>
              <td class="info-cont">{{info.companyAddress}}</td>
            </tr>
            <tr>
              <td class="bg-dark">营业执照：</td>
              <td><img :src="info.businessLicense" style="max-height:200px; max-width: 200px; cursor:zoom-in;float:left;" alt=""
                       @click="showBigImg(info.businessLicense)"></td>
            </tr>
            <tr>
              <td class="bg-dark">门头照：</td>
              <td><img :src="info.companyPhoto" style="max-height:200px; max-width: 200px; cursor:zoom-in;float:left;" alt=""
                       @click="showBigImg(info.companyPhoto)"></td>
            </tr>
            <tr>
              <td class="bg-dark">审核状态：</td>
              <td class="info-cont">{{info.statusName}}</td>
            </tr>
            <tr>
              <td class="bg-dark">提交认证时间：</td>
              <td class="info-cont">{{info.createDate}}</td>
            </tr>
            <tr>
              <td class="bg-dark">认证通过时间：</td>
              <td class="info-cont">{{info.examineTime}}</td>
            </tr>
          </table>

          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogEditVisible1 = false">取消</el-button>
          </div>
        </el-dialog>
        <!-- 审核弹窗-->
        <el-dialog :close-on-click-modal="false" v-if="dialogEditVisible2" title="审核备注" :visible.sync="dialogEditVisible2">
          <el-input type="textarea" v-model="auditCont"></el-input>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogEditVisible2 = false">取 消</el-button>
            <el-button type="primary" @click="saveAudit()">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </el-card>


    <!-- 图片放大 -->
    <el-dialog
        :visible.sync="isShowBigImg"
        width="1040px">
      <div style="text-align:center;">
        <img style="min-width:480px;max-width:1000px;" :src="bigImgSrc" alt="">
      </div>
    </el-dialog>
  </div>


</template>

<script>
  import Cookies from 'js-cookie'

  export default {
    data(){
      return {
        status: '1',
        uploadUrl: '',
        storeId: '',
        timeRange: [],
        storeState: '',
        dataListLoading: false,
        checkStatus: '',
        dataForm: {
          username: '',
          nickname: '',
          status: null,
        },
        levelList: [],
        order: '',
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dialogEditVisible: false,
        dialogEditVisible1: false,
        dialogEditVisible2: false,
        dialogEditVisible3: false,
        dataList: [],
        info: {},
        // auditHistory: '',
        stateList: [],
        areaList: [],
        recordList: [],
        auditCont: '',
        auditResult: '',
        isShowBigImg: false, // 是否显示大图
        bigImgSrc: '', // 是否显示大图,
        checkId: ''
      }
    },
    activated(){
      this.uploadUrl = `${window.SITE_CONFIG['apiURL']}/sys/oss/upload?token=${Cookies.get('token')}`
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList(){
        this.dataListLoading = true
        this.$http({
          url:  'member/userauthentication/page',
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'username': this.dataForm.username,
            'nickname': this.dataForm.nickname,
            'status': this.dataForm.status
          })
        }).then(({data}) => {
          if(data && data.code === 0){
            console.log(data)
            this.dataList  = data.data.list;
            this.totalPage = data.data.total
          }else{
            this.dataList   = []
            this.totalCount = 0
          }
          this.dataListLoading = false
        })
      },
      search(){
        this.pageIndex = 1
        this.getDataList()
      },
      // showAuditHistory (id) {
      //     this.dialogEditVisible = true
      //     this.$http({
      //         url: this.$http.adornUrl('common/checkLog'),
      //         method: 'get',
      //         params: this.$http.adornParams({
      //             'id': id,
      //             'type': 5
      //         })
      //     }).then(({data}) => {
      //         if (data && data.code === 0) {
      //             // console.log(data)
      //             this.auditHistory = data.data
      //         } else {
      //         }
      //     })
      // },
      showDetail(id){
        this.dialogEditVisible1 = true
        this.getInfo(id)
        this.storeId = id
      },
      //获取详情
      getInfo(id){
        this.$http({
          url:'member/userauthentication/' + id,
          method: 'get',
          // params: this.$http.adornParams({
          // })
        }).then(({data}) => {
          if(data && data.code === 0){
            // console.log(data)
            this.info = data.data
            // console.log(this.timeRange)
          }else{
          }
        })
      },

      saveEdit(){
        // what ？？
        this.dialogEditVisible1 = false
      },
      editPercentageName(){
        this.$http({
          url: this.$http.adornUrl('store/store/platform_percentage'),
          method: 'post',
          data: this.$http.adornData({
            id: this.storeId,
            platformPercentage: this.info.platformPercentage
          })
        }).then(({data}) => {
          if(data && data.code === 0){
            console.log(data)
            this.$message.success('保存成功')
          }else{
          }
        })
      },
      editArea(){
        this.$http({
          url: this.$http.adornUrl('store/store/store_region'),
          method: 'post',
          data: this.$http.adornData({
            id: this.storeId,
            subordinateGarden: this.info.subordinateGarden
          })
        }).then(({data}) => {
          if(data && data.code === 0){
            console.log(data)
            this.$message.success('保存成功')
          }else{
          }
        })
      },
      editRegion(){
        this.$http({
          url: this.$http.adornUrl('store/store/store_region'),
          method: 'post',
          data: this.$http.adornData({
            id: this.storeId,
            subordinateRegion: this.info.subordinateRegion
          })
        }).then(({data}) => {
          if(data && data.code === 0){
            console.log(data)
            this.$message.success('保存成功')
          }else{
          }
        })
      },
      editDoor(){
        this.$http({
          url: this.$http.adornUrl('store/store/store_region'),
          method: 'post',
          data: this.$http.adornData({
            id: this.storeId,
            houseNumber: this.info.houseNumber
          })
        }).then(({data}) => {
          if(data && data.code === 0){
            console.log(data)
            this.$message.success('保存成功')
          }else{
          }
        })
      },
      //弹出框
      showCheckDialog(id, auditResult){
        this.dialogEditVisible2 = true
        this.auditResult        = auditResult
        this.id                 = id
        if(status != 1){
          showCheckDialog() == true
        }else{
          showCheckDialog() == false
        }
      },
      //通过或者拒绝
      saveAudit(){
        // console.log('saveAuditsaveAudit',this.id);
        this.dialogEditVisible2 = true
        this.dialogEditVisible1 = false
        this.$http({
          url: 'member/userauthentication/check',
          method: 'post',
          data: this.$http.adornData({
            id: this.id,
            status: this.auditResult,
            remark: this.auditCont,
          })
        }).then(({data}) => {
          if(data && data.code === 0){
            this.$message.success('操作成功')
            this.getDataList()
          }else{
          }
        })
        this.dialogEditVisible2 = false
      },
      // 分页
      changePage(pageData){
        this.pageData = pageData
        this.getDataList()
      },
      // 每页数
      sizeChangeHandle(val){
        this.pageSize  = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle(val){
        this.pageIndex = val
        this.getDataList()
      },
      // 上传电子签章成功
      handleUploadSuccess(res, file){
        if(res.code !== 0){
          return this.$message.error(res.msg)
        }
        this.info.eleSignature = res.data.src
        this.saveEleSignature()
      },
      // 保存 电子签章
      saveEleSignature(){
        this.$http({
          url: this.$http.adornUrl('store/store/e_signature'),
          method: 'post',
          data: this.$http.adornData({
            id: this.info.id,
            eleSignature: this.info.eleSignature
          })
        }).then(({data}) => {
          if(!data){
            this.$message.error('网络异常请稍后再试')
            return
          }
          if(data.code === 0){
            this.$message.success('保存成功')
          }else{
            this.$message.error(data.msg)
          }
        })
      },
      // 显示大图
      showBigImg(src){
        this.isShowBigImg = true
        this.bigImgSrc    = src
      }
    }
  }
</script>
<style scoped>
  .campImg{
    width  :180px;
    height :80px;
  }

  .cmpUserimg{
    width      :80px;
    height     :80px;
    margin-top :2px;
    float      :left;
  }

  .userimg{
    width      :80px;
    height     :80px;
    margin-top :2px;
  }

  .form-wrap{
    border       :1px solid #eee;
    box-sizing   :border-box;
    padding-top  :20px;
    margin-top   :10px;
    padding-left :20px;
  }

  .operate-wrap{
    height       :60px;
    line-height  :60px;
    border       :1px solid #eee;
    margin-top   :10px;
    padding-left :20px;
  }

  .audit-detail{
    color  :#17B3A3;
    cursor :pointer;
  }

  .order-select{
    float        :right;
    margin-right :10px;
  }

  .history-table{
    width           :90%;
    margin          :0 auto 20px;
    border-collapse :collapse;
  }

  .history-table tr td{
    border     :1px solid #d8d8d8;
    text-align :center;
    height     :50px;
    word-wrap  :break-word;
  }

  .table-head{
    font-size        :16px;
    font-weight      :bold;
    background-color :rgb(249, 250, 252);
  }

  .info-topic{
    text-align   :left !important;
    padding-left :10px;
  }

  .bg-dark{
    background-color :rgb(249, 250, 252);
    width            :160px;
  }

  .info-cont{
    min-width    :200px;
    text-align   :left !important;
    padding-left :10px;
  }

  .el-input{
    width :200px;
  }

  .audit-btn-wrap{
    width  :90%;
    margin :0 auto;
  }
</style>
