<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-menu">
      <el-radio-group v-model="checkStatus">
        <el-radio-button label="">全部店铺（1000）</el-radio-button>
        <el-radio-button label="1">入驻待审核（1000）</el-radio-button>
        <el-radio-button label="2">入驻审核拒绝（1000）</el-radio-button>
        <el-radio-button label="3">入驻审核通过（1000）</el-radio-button>
        <el-radio-button label="4">修改待审核（1000）</el-radio-button>
        <el-radio-button label="5">修改审核拒绝（1000）</el-radio-button>
        <el-radio-button label="6">修改审核通过（1000）</el-radio-button>
      </el-radio-group>
      <div class="form-wrap">
        <el-form class="search-form" :inline="true" :model="dataForm" @keyup.enter.native="search()">
          <el-form-item label="店铺编号：">
            <el-input v-model="dataForm.number" placeholder="店铺编号"></el-input>
          </el-form-item>
          <el-form-item label="店铺名称：">
            <el-input v-model="dataForm.name" placeholder="店铺名称"></el-input>
          </el-form-item>
          <el-form-item label="店铺等级：">
            <el-select v-model="dataForm.levle" @change="search()">
              <el-option v-for="(item, index)  in levelList" :key="index" :label="item.name" :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="operate-wrap">
        <el-button type="primary">导出</el-button>
        <!-- <el-button type="primary">删除</el-button> -->
      </div>
      <!-- 数据列表 -->
      <el-table :data="dataList" v-loading="dataListLoading" stripe border>
        <el-table-column prop="id" label="店铺编号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="storeName" label="店铺名称" header-align="center" align="center"></el-table-column>
        <el-table-column prop="username" label="店铺主账号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="storeEndTime" label="有效日期" header-align="center" align="center"></el-table-column>
        <el-table-column prop="storeRecommendName" label="是否推荐" header-align="center" align="center"></el-table-column>
        <el-table-column prop="sort" label="排序" header-align="center" align="center"></el-table-column>
        <el-table-column prop="platformPercentageName" label="平台抽成比率" header-align="center"
                         align="center"></el-table-column>
        <el-table-column prop="grade_name" label="店铺等级" header-align="center" align="center"></el-table-column>
        <el-table-column prop="storeCheckStatusName" label="入驻审核状态" header-align="center" align="center">
          <template slot-scope="scope">
            {{scope.row.storeCheckStatusName}}<br>
            <span class="audit-detail" @click="showAuditHistory(scope.row.id)">审核详情</span>
          </template>
        </el-table-column>
        <el-table-column prop="storeCheckStatusName" label="修改审核状态" header-align="center" align="center">
          <template slot-scope="scope">
            {{scope.row.storeCheckStatusName}}<br>
            <span class="audit-detail" @click="getRecordList1(scope.row.id)">审核详情</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="showDetail(scope.row.id)">查看</el-button>
            <el-button type="text" size="small" @click="del(scope.row.id)">删除</el-button>
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
      <!-- 审核详情弹窗 -->
      <el-dialog :close-on-click-modal="false" v-if="dialogEditVisible" title="审核详情" :visible.sync="dialogEditVisible">
        <table class="history-table">
          <tr class="table-head">
            <td>审核时间</td>
            <td>审核人员</td>
            <td>审核结果</td>
            <td>反馈详情</td>
          </tr>
          <tr v-for="item in auditHistory" :key="item.id">
            <td>{{item.createDate}}</td>
            <td>{{item.adminName}}</td>
            <td>{{item.resultName}}</td>
            <td>{{item.cause}}</td>
          </tr>
        </table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogEditVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogEditVisible = false">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 店铺详情弹窗 -->
      <el-dialog width='80%' :close-on-click-modal="false" v-if="dialogEditVisible1"
                 :title="'店铺详情-' + info.applyTypeName" :visible.sync="dialogEditVisible1">
        <table class="history-table" v-if="info.applyType === 1">
          <tr class="table-head">
            <td class="info-topic" colspan="6">公司及联系人信息</td>
          </tr>
          <tr>
            <td class="bg-dark">公司名称</td>
            <td class="info-cont">{{info.companyName}}</td>
            <td class="bg-dark">公司网址</td>
            <td class="info-cont" colspan="3">{{info.companyWebsite}}</td>
          </tr>
          <tr>
            <td class="bg-dark">公司所在地</td>
            <td class="info-cont">{{info.companyLocation}}</td>
            <td class="bg-dark">公司详细地址</td>
            <td class="info-cont">{{info.companyAddress}}</td>
            <td class="bg-dark">公司电话</td>
            <td class="info-cont">{{info.companyTelephone}}</td>
          </tr>
          <tr>
            <td class="bg-dark">邮政编码</td>
            <td class="info-cont">{{info.companyZipcode}}</td>
            <td class="bg-dark">电子邮箱</td>
            <td class="info-cont">{{info.companyEmail}}</td>
            <td class="bg-dark">传真</td>
            <td class="info-cont">{{info.companyFax}}</td>
          </tr>
          <tr>
            <td class="bg-dark">联系人姓名</td>
            <td class="info-cont">{{info.contactsName}}</td>
            <td class="bg-dark">联系人电话</td>
            <td class="info-cont">{{info.contactsMobile}}</td>
            <td class="bg-dark">联系人邮箱</td>
            <td class="info-cont">{{info.contactsEmail}}</td>
          </tr>
        </table>
        <table class="history-table" v-if="info.applyType === 1">
          <tr class="table-head">
            <td class="info-topic" colspan="6">营业执照信息（副本）</td>
          </tr>
          <tr>
            <td class="bg-dark">营业执照号</td>
            <td class="info-cont">{{info.businessLicenceNumber}}</td>
            <td class="bg-dark">成立日期</td>
            <td class="info-cont">{{info.businessRegisteDate}}</td>
            <td class="bg-dark">注册资本（万元）</td>
            <td class="info-cont">{{info.regCapital}}</td>
          </tr>
          <tr>
            <td class="bg-dark">法定代表人姓名</td>
            <td>{{info.legalPerson}}</td>
            <td class="bg-dark">营业执照有效期</td>
            <td colspan="3">{{info.businessDate}}</td>
          </tr>

          <tr>
            <td class="bg-dark">营业执照所在地</td>
            <td>{{info.businessLicenceLocation}}</td>
            <td class="bg-dark">详细地址</td>
            <td colspan="3">{{info.businessLicenceAddress}}</td>
          </tr>
          <tr>
            <td class="bg-dark">经营范围</td>
            <td class="info-cont" colspan="5">{{info.businessScope}}</td>
          </tr>
        </table>
        <table class="history-table" v-if="info.applyType === 1">
          <tr class="table-head">
            <td class="info-topic" colspan="2">税务登记证</td>
          </tr>
          <tr>
            <td class="bg-dark">纳税人类型</td>
            <td class="info-cont">{{info.taxpayerName}}</td>
          </tr>
          <tr>
            <td class="bg-dark">纳税人税码</td>
            <td class="info-cont">{{info.taxRateName}}</td>
          </tr>
        </table>
        <table class="history-table">
          <tr class="table-head">
            <td class="info-topic" colspan="2">开户行信息</td>
          </tr>
          <tr>
            <td class="bg-dark">银行开户名</td>
            <td class="info-cont">{{info.bankAccountName}}</td>
          </tr>
          <tr>
            <td class="bg-dark">公司银行账号</td>
            <td class="info-cont">{{info.bankAccountNumber}}</td>
          </tr>
          <tr>
            <td class="bg-dark">开户银行支行名称</td>
            <td class="info-cont">{{info.bankBranchName}}</td>
          </tr>
          <tr>
            <td class="bg-dark">开户银行所在地</td>
            <td class="info-cont">{{info.bankLocation}}</td>
          </tr>
        </table>
        <table class="history-table">
          <tr class="table-head">
            <td class="info-topic" colspan="2">店铺经营信息</td>
          </tr>
          <tr>
            <td class="bg-dark">商家账号</td>
            <td class="info-cont">{{info.username}}</td>
          </tr>
          <tr>
            <td class="bg-dark">店铺分类</td>
            <td class="info-cont">{{info.typeName}}</td>
          </tr>
          <tr>
            <td class="bg-dark">入驻类型</td>
            <td class="info-cont">{{info.applyTypeName}}</td>
          </tr>
          <tr>
            <td class="bg-dark">店铺名称</td>
            <td class="info-cont">{{info.storeName}}</td>
          </tr>
          <tr>
            <td class="bg-dark">收费标准（元/年）</td>
            <td class="info-cont">
              <el-input v-model="info.grade_price" @change="editGradePrice()"></el-input>
            </td>
          </tr>
          <tr>
            <td class="bg-dark">店铺有效期</td>
            <td class="info-cont">
              <el-date-picker
                  v-model="timeRange"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="editTime"
                  >
              </el-date-picker>
            </td>
          </tr>
          <tr>
            <td class="bg-dark">店铺负责人</td>
            <td class="info-cont">
              {{info.storePersonName}}
            </td>
          </tr>
          <tr>
            <td class="bg-dark">负责人手机号码</td>
            <td class="info-cont">{{info.storePersonMobile}}</td>
          </tr>
          <tr>
            <td class="bg-dark">负责人QQ号码</td>
            <td class="info-cont">{{info.storePersonQq}}</td>
          </tr>
          <tr>
            <td class="bg-dark">负责人邮箱</td>
            <td class="info-cont">{{info.storePersonEmail}}</td>
          </tr>
          <tr>
            <td class="bg-dark">店铺所在地</td>
            <td class="info-cont">{{info.storeLocation}}</td>
          </tr>
          <tr>
            <td class="bg-dark">详细地址</td>
            <td class="info-cont">{{info.storeAddress}}</td>
          </tr>
          <tr>
            <td class="bg-dark">平台抽成比例</td>
            <td class="info-cont">
              <el-input v-model="info.platformPercentage" @blur="editPercentageName()"></el-input>
              %
            </td>
          </tr>
          <tr>
            <td class="bg-dark">店铺状态</td>
            <td class="info-cont">
              <el-radio-group v-model="info.storeStatus">
                <el-radio :label="1">开启中</el-radio>
                <el-radio :label="2">已关闭</el-radio>
              </el-radio-group>
            </td>
          </tr>
        </table>
        <table class="history-table">
          <tr class="table-head">
            <td class="info-topic" colspan="2">实体店信息</td>
          </tr>
          <tr>
            <td class="bg-dark">所属园区</td>
            <td class="info-cont">
              <el-select v-model="info.subordinateGarden" placeholder="请选择" @change="editArea()">
                <el-option
                    v-for="item in stateList"
                    :key="item.id"
                    :label="item.gardenName"
                    :value="item.gardenName">
                </el-option>
              </el-select>
            </td>
          </tr>
          <tr>
            <td class="bg-dark">所属区域</td>
            <td class="info-cont">
              <el-select v-model="info.subordinateRegion" placeholder="请选择" @change="editRegion()">
                <el-option
                    v-for="item in areaList"
                    :key="item.id"
                    :label="item.regionName"
                    :value="item.regionName">
                </el-option>
              </el-select>
            </td>
          </tr>
          <tr>
            <td class="bg-dark">门牌号</td>
            <td class="info-cont">
              <el-input v-model="info.houseNumber" @change="editDoor()"></el-input>
            </td>
          </tr>
        </table>
        <table class="history-table">
          <tr class="table-head">
            <td class="info-topic" colspan="2">证件信息</td>
          </tr>
          <tr v-if="info.applyType === 1">
            <td class="bg-dark">企业营业执照副本</td>
            <td class="info-cont">
              <img style="width:100px" :src="info.businessLicenceCert" alt="">
            </td>
          </tr>
          <tr v-if="info.applyType === 1">
            <td class="bg-dark">法人身份证</td>
            <td class="info-cont">
              <img style="width:100px" :src="info.legalIdentityCertFront" alt="">
              <img style="width:100px" :src="info.legalIdentityCertBack" alt="">
              <img style="width:100px" :src="info.legalIdentityCertHand" alt="">
            </td>
          </tr>
          <tr>
            <td class="bg-dark">店铺负责人身份证</td>
            <td class="info-cont">
              <img style="width:100px" :src="info.storePersonCertFront" alt="">
              <img style="width:100px" :src="info.storePersonCertBack" alt="">
              <img style="width:100px" :src="info.storePersonCertHand" alt="">
            </td>
          </tr>

          <tr v-if="info.applyType === 1">
            <td class="bg-dark">开户银行所在地</td>
            <td class="info-cont">{{info.bankLocation}}</td>
          </tr>
        </table>
        <el-form :model="dataForm" ref="classForm" status-icon label-width="120px" style="margin-left: 66px">
          <el-form-item label="上传电子签章：" prop="name">
            <el-upload
                class="post-uploader"
                :action="uploadUrl"
                :show-file-list="false"
                :on-success="handleUploadSuccess">
              <img v-if="info.eleSignature" :src="info.eleSignature" class="post">
              <i v-else class="el-icon-plus post-uploader-icon"></i>
              <div slot="tip" class="el-upload__tip">图标尺寸为200*200px，大小不能超过200KB，图片只能为jpg、png、gif格式</div>
            </el-upload>
          </el-form-item>


        </el-form>


        <table class="history-table" style="table-layout:fixed;width:auto">
          <tr class="table-head">
            <td class="info-topic" width="50">序号</td>
            <td class="info-topic" width="50">类型</td>
            <td class="info-topic" width="100">字段</td>
            <td class="info-topic" width="100">原值</td>
            <td class="info-topic" width="200">新值</td>
            <td class="info-topic" width="100">日期</td>
            <td class="info-topic" width="100">结果</td>
            <td class="info-topic" width="100">备注</td>
            <td class="info-topic" width="60">操作人</td>
          </tr>
          <tr v-for="item in recordList" :key="item.id">
            <td>{{item.sort}}</td>
            <td>{{item.actionTypeName}}</td>
            <td>{{item.columnValue}}</td>
            <td>{{item.oldValue}}</td>
            <td>{{item.newValue}}</td>
            <td>{{item.createDate}}</td>
            <td>{{item.resultName}}</td>
            <td>{{item.remark}}</td>
            <td>{{item.updater}}</td>
          </tr>
        </table>
        <div class="audit-btn-wrap">
          <!--<el-button type="primary" @click="saveEdit()">保存</el-button>-->
          <el-button v-if="info.storeCheckStatus == 1 || info.storeCheckStatus == 4" type="primary" @click="audit(2)">
            审批通过
          </el-button>
          <el-button v-if="info.storeCheckStatus == 1 || info.storeCheckStatus == 4" type="primary" @click="audit(3)">
            审批拒绝
          </el-button>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogEditVisible1 = false">关 闭</el-button>
          <!-- <el-button type="primary" @click="dialogEditVisible1 = false">确 定</el-button> -->
        </div>
      </el-dialog>
      <!-- 审核弹窗 -->
      <el-dialog :close-on-click-modal="false" v-if="dialogEditVisible2" title="店铺审核"
                 :visible.sync="dialogEditVisible2">
        <el-input type="textarea" v-model="auditCont"></el-input>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel()">取 消</el-button>
          <el-button type="primary" @click="saveAudit">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog :close-on-click-modal="false" v-if="dialogEditVisible3" title="修改审核状态记录"
                 :visible.sync="dialogEditVisible3">
        <table class="history-table" style="table-layout:fixed">
          <tr class="table-head">
            <td class="info-topic" width="50">序号</td>
            <td class="info-topic" width="50">类型</td>
            <td class="info-topic" width="100">字段</td>
            <td class="info-topic" width="100">原值</td>
            <td class="info-topic" width="200">新值</td>
            <td class="info-topic" width="100">日期</td>
            <td class="info-topic" width="100">结果</td>
            <td class="info-topic" width="100">备注</td>
            <td class="info-topic" width="60">操作人</td>
          </tr>
          <tr v-for="item in recordList" :key="item.id">
            <td>{{item.sort}}</td>
            <td>{{item.actionTypeName}}</td>
            <td>{{item.columnValue}}</td>
            <td>{{item.oldValue}}</td>
            <td>{{item.newValue}}</td>
            <td>{{item.createDate}}</td>
            <td>{{item.resultName}}</td>
            <td>{{item.remark}}</td>
            <td>{{item.updater}}</td>
          </tr>
        </table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogEditVisible3 = false">取 消</el-button>
          <el-button type="primary" @click="dialogEditVisible3 = false">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </el-card>
</template>

<script>
    import Cookies from 'js-cookie'

    export default {
        data () {
            return {
                uploadUrl: '',
                storeId: '',
                timeRange: [],
                storeState: '',
                dataListLoading: false,
                checkStatus: '',
                dataForm: {
                    number: '',
                    name: '',
                    level: '',
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
                auditHistory: '',
                stateList: [],
                areaList: [],
                recordList: [],
                auditCont: '',
                auditResult: ''
            }
        },
        activated () {
            this.uploadUrl = `${window.SITE_CONFIG['apiURL']}/sys/oss/upload?token=${Cookies.get('token')}`
            this.getDataList()
            this.getStateList()
            this.getAreaList()
            // this.getRecordList()
        },
        methods: {
            // 获取数据列表
            getDataList () {
                this.dataListLoading = true
                this.$http({
                    url: this.$http.adornUrl('store/store/page'),
                    method: 'get',
                    params: this.$http.adornParams({
                        'page': this.pageIndex,
                        'limit': this.pageSize,
                        'id': this.dataForm.number,
                        'store_name': this.dataForm.name,
                        'store_check_status': this.checkStatus,
                        'grade_id': this.dataForm.levle
                    })
                }).then(({data}) => {
                    if (data && data.code === 0) {
                        console.log(data)
                        this.dataList = data.data.list
                        this.totalPage = data.data.total
                    } else {
                        this.dataList = []
                        this.totalCount = 0
                    }
                    this.dataListLoading = false
                })
            },
            cancel(){
              console.log(this.auditCont);
              this.dialogEditVisible2 = false
              this.auditCont = '';

            },
            search () {
                this.pageIndex = 1
                this.getDataList()
            },
            getStateList () {
                this.$http({
                    url: this.$http.adornUrl('store/storegarden/list'),
                    method: 'get',
                    params: this.$http.adornParams({})
                }).then(({data}) => {
                    if (data && data.code === 0) {
                        console.log('所属园区-----', data)
                        this.stateList = data.data
                    } else {
                    }
                })
            },
            getAreaList () {
                this.$http({
                    url: this.$http.adornUrl('store/storeregion/list'),
                    method: 'get',
                    params: this.$http.adornParams({})
                }).then(({data}) => {
                    if (data && data.code === 0) {
                        console.log('所属区域-----', data)
                        this.areaList = data.data
                    } else {
                    }
                })
            },
            showAuditHistory (id) {
                this.dialogEditVisible = true
                this.$http({
                    url: this.$http.adornUrl('common/checkLog'),
                    method: 'get',
                    params: this.$http.adornParams({
                        'id': id,
                        'type': 1
                    })
                }).then(({data}) => {
                    if (data && data.code === 0) {
                        console.log(data)
                        this.auditHistory = data.data
                    } else {
                    }
                })
            },
            showDetail (id) {
                this.dialogEditVisible1 = true
                this.getInfo(id)
                this.getRecordList(id)
                this.storeId = id
            },
            getInfo (id) {
                this.$http({
                    url: this.$http.adornUrl('store/store/' + id + ''),
                    method: 'get',
                    params: this.$http.adornParams({
                        'id': id
                    })
                }).then(({data}) => {
                    if (data && data.code === 0) {
                        this.timeRange = []
                        // console.log(data)
                        this.$nextTick(()=>{
                          this.info = data.data
                          this.timeRange.push(data.data.storeTime || '')
                          this.timeRange.push(data.data.storeEndTime || '')
                        })
                        console.log(this.timeRange)
                    } else {
                    }
                })
            },
            getRecordList1 (id) {
                this.dialogEditVisible3 = true
                this.getRecordList(id)
            },
            getRecordList (id) {
                // this.dialogEditVisible = true
                this.$http({
                    url: this.$http.adornUrl('store/store/update_examine'),
                    method: 'get',
                    params: this.$http.adornParams({
                        'id': id
                    })
                }).then(({data}) => {
                    if (data && data.code === 0) {
                        console.log(data)
                        this.recordList = data.data
                    } else {
                    }
                })
            },
            saveEdit () {
                // what ？？
                this.dialogEditVisible1 = false
            },
            editPercentageName () {
                this.$http({
                    url: this.$http.adornUrl('store/store/platform_percentage'),
                    method: 'post',
                    data: this.$http.adornData({
                        id: this.storeId,
                        platformPercentage: this.info.platformPercentage
                    })
                }).then(({data}) => {
                    if (data && data.code === 0) {
                        console.log(data)
                        this.$message.success('保存成功')
                    } else {
                    }
                })
            },
            editArea () {
                this.$http({
                    url: this.$http.adornUrl('store/store/store_region'),
                    method: 'post',
                    data: this.$http.adornData({
                        id: this.storeId,
                        subordinateGarden: this.info.subordinateGarden
                    })
                }).then(({data}) => {
                    if (data && data.code === 0) {
                        console.log(data)
                        this.$message.success('保存成功')
                    } else {
                    }
                })
            },
            editRegion () {
                this.$http({
                    url: this.$http.adornUrl('store/store/store_region'),
                    method: 'post',
                    data: this.$http.adornData({
                        id: this.storeId,
                        subordinateRegion: this.info.subordinateRegion
                    })
                }).then(({data}) => {
                    if (data && data.code === 0) {
                        console.log(data)
                        this.$message.success('保存成功')
                    } else {
                    }
                })
            },
            editTime () {
                if (this.timeRange.length !== 2) {
                  return
                }
                this.$http({
                    url: this.$http.adornUrl('store/store/store_time'),
                    method: 'post',
                    data: this.$http.adornData({
                        id: this.storeId,
                        storeTime:this.timeRange[0],
                        storeEndTime: this.timeRange[1]
                    })
                }).then(({data}) => {
                    if (data && data.code === 0) {
                        console.log(data)
                        this.$message.success('保存成功')
                    } else {
                    }
                })
            },
            editGradePrice () {
                if (!this.info.grade_price) {
                  return
                }
                this.$http({
                    url: this.$http.adornUrl('store/store/grade_price'),
                    method: 'post',
                    data: this.$http.adornData({
                        id: this.storeId,
                        gradePrice:this.info.grade_price
                    })
                }).then(({data}) => {
                    if (data && data.code === 0) {
                        console.log(data)
                        this.$message.success('保存成功')
                    } else {
                    }
                })
            },
            editDoor () {
                this.$http({
                    url: this.$http.adornUrl('store/store/store_region'),
                    method: 'post',
                    data: this.$http.adornData({
                        id: this.storeId,
                        houseNumber: this.info.houseNumber
                    })
                }).then(({data}) => {
                    if (data && data.code === 0) {
                        console.log(data)
                        this.$message.success('保存成功')
                    } else {
                    }
                })
            },
            audit (auditResult) {
                this.dialogEditVisible2 = true
                if (auditResult == 2) {
                    this.auditResult = 2
                } else if (auditResult == 3) {
                    this.auditResult = 3
                }
            },
            saveAudit () {
                this.dialogEditVisible2 = false
                this.dialogEditVisible1 = false
                this.$http({
                    url: this.$http.adornUrl('store/store/examine'),
                    method: 'post',
                    data: this.$http.adornData({
                        id: this.storeId,
                        checkStatus: this.auditResult,
                        remark: this.auditCont
                    })
                }).then(({data}) => {
                    if (data && data.code === 0) {
                        this.$message.success('审核成功')
                        this.getDataList()
                    } else {
                    }
                })
            },
            del (id) {
                this.$confirm(`确定删除吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http({
                        url: this.$http.adornUrl('store/store'),
                        method: 'delete',
                        data: this.$http.adornData(
                            [id]
                        )
                    }).then(({data}) => {
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
                }).catch(() => {
                })
            },
            // 分页
            changePage (pageData) {
                this.pageData = pageData
                this.getDataList()
            },
            // 每页数
            sizeChangeHandle (val) {
                this.pageSize = val
                this.pageIndex = 1
                this.getDataList()
            },
            // 当前页
            currentChangeHandle (val) {
                this.pageIndex = val
                this.getDataList()
            },
            // 上传电子签章成功
            handleUploadSuccess (res, file) {
                if (res.code !== 0) {
                    return this.$message.error(res.msg)
                }
                this.info.eleSignature = res.data.src
                this.saveEleSignature()
            },
            // 保存 电子签章
            saveEleSignature () {
                this.$http({
                    url: this.$http.adornUrl('store/store/e_signature'),
                    method: 'post',
                    data: this.$http.adornData({
                        id: this.info.id,
                        eleSignature: this.info.eleSignature
                    })
                }).then(({data}) => {
                    if (!data) {
                        this.$message.error('网络异常请稍后再试')
                        return
                    }
                    if (data.code === 0) {
                        this.$message.success('保存成功')
                    } else {
                        this.$message.error(data.msg)
                    }
                })
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

  .audit-detail {
    color: #17B3A3;
    cursor: pointer;
  }

  .order-select {
    float: right;
    margin-right: 10px;
  }

  .history-table {
    width: 90%;
    margin: 0 auto 20px;
    border-collapse: collapse;
  }

  .history-table tr td {
    border: 1px solid #d8d8d8;
    text-align: center;
    height: 50px;
    word-wrap: break-word;
  }

  .table-head {
    font-size: 16px;
    font-weight: bold;
    background-color: rgb(249, 250, 252);
  }

  .info-topic {
    text-align: left !important;
    padding-left: 10px;
  }

  .bg-dark {
    background-color: rgb(249, 250, 252);
    width: 160px;
  }

  .info-cont {
    min-width: 200px;
    text-align: left !important;
    padding-left: 10px;
  }

  .el-input {
    width: 200px;
  }

  .audit-btn-wrap {
    width: 90%;
    margin: 0 auto;
  }
</style>
