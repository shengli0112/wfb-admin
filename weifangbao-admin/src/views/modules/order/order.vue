<template>
<el-card shadow="never" class="aui-card--fill">
  <div class="mod-menu">
    <el-radio-group v-model="checkStatus">
        <el-radio-button label="">全部订单（1000）</el-radio-button>
        <el-radio-button label="1">待付款（1000）</el-radio-button>
        <el-radio-button label="2">待发货（1000）</el-radio-button>
        <el-radio-button label="3">已发货（1000）</el-radio-button>
        <el-radio-button label="4">已完成（1000）</el-radio-button>
        <el-radio-button label="5">已关闭（1000）</el-radio-button>
        <el-radio-button label="6">申请售后（1000）</el-radio-button>
    </el-radio-group>
    <div class="form-wrap">
        <el-form class="search-form" :inline="true" :model="dataForm" @keyup.enter.native="search()">
            <el-form-item label="订单编号：">
                <el-input v-model="dataForm.orderSn" placeholder="订单编号"></el-input>
            </el-form-item>
            <el-form-item label="店铺名称：">
                <el-input v-model="dataForm.storeName" placeholder="店铺名称"></el-input>
            </el-form-item>
            <el-form-item label="商家账号：">
                <el-input v-model="dataForm.sellerName" placeholder="商家账号"></el-input>
            </el-form-item>
            <el-form-item label="用户账号：">
                <el-input v-model="dataForm.username" placeholder="用户账号"></el-input>
            </el-form-item>
        </el-form>
    </div>
    <div class="operate-wrap">
        <el-button type="primary">导出</el-button>
        <!-- <el-button type="primary">删除</el-button> -->
    </div>
    <!-- 数据列表 -->
    <el-table :data="dataList" v-loading="dataListLoading" stripe border>
      <el-table-column prop="orderSn" label="订单编号" header-align="center" align="center"></el-table-column>
      <el-table-column prop="storeName" label="店铺名称" header-align="center" align="center"></el-table-column>
      <el-table-column prop="username" label="用户账号" header-align="center" align="center"></el-table-column>
      <el-table-column prop="totalAmount" label="订单金额" header-align="center" align="center"></el-table-column>
      <el-table-column prop="payName" label="支付方式" header-align="center" align="center"></el-table-column>
      <el-table-column prop="" label="订单来源" header-align="center" align="center"></el-table-column>
      <el-table-column prop="orderStatusName" label="订单状态" header-align="center" align="center"></el-table-column>
      <el-table-column fixed="right" label="操作" header-align="center" align="center">
        <template slot-scope="scope">
            <el-button type="text" size="small"  @click="showDetail(scope.row.id)">查看订单</el-button>
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
    <el-dialog  width='80%' :close-on-click-modal="false" v-if="dialogEditVisible" title="订单详情" :visible.sync="dialogEditVisible">
        <div class="order-status">
        当前订单状态：{{ordersEntity.orderStatusName}}
        <el-button class="print-btn" type="primary">打印</el-button>
        </div>
        <!-- 基本信息 -->
        <div class="order-name"><i class="el-icon-info"></i> 基本信息</div>
        <table class="order-table"  width='100%' cellpadding='0' cellspacing='0'>
        <tr class="table-header">
            <td>订单编号</td>
            <td>发货单流水号</td>
            <td>用户账号</td>
            <td>支付方式</td>
            <td>订单来源</td>
            <td>订单类型</td>
        </tr>
        <tr>
            <td>{{ordersEntity.orderSn}}</td>
            <td>{{ordersEntity.order_sn}}</td>
            <td>{{ordersEntity.username}}</td>
            <td>{{ordersEntity.payName}}</td>
            <td>{{ordersEntity.order_amount}}</td>
            <td>{{ordersEntity.promType}}</td>
        </tr>
        <tr class="table-header">
            <td>配送方式</td>
            <td>物流单号</td>
            <td>自动确认收货时间</td>
            <td>订单可得仙币</td>
            <td>订单可得成长值</td>
            <td>活动信息</td>
        </tr>
        <tr>
            <td>{{ordersEntity.deliveryName}}</td>
            <td>{{ordersEntity.pay_status_name}}</td>
            <td>{{ordersEntity.confirmTime}}</td>
            <td>{{ordersEntity.add_time}}</td>
            <td>{{ordersEntity.pay_time}}</td>
            <td>{{ordersEntity.invoice_title}}</td>
        </tr>
        </table>
        <!-- 发票信息 -->
        <div class="order-name" v-if="order.orderInvoice !== null"><i class="el-icon-info"></i> 发票信息</div>
        <table class="order-table" v-if="order.orderInvoice !== null"  width='100%' cellpadding='0' cellspacing='0'>
            <tr>
                <td class="tips-topic">发票类型</td>
                <td class="tips-cont">发票抬头</td>
                <td class="tips-topic">税号</td>
                <td class="tips-cont">备注</td>
            </tr>
            <tr>
                <td class="tips-topic"></td>
                <td class="tips-cont"></td>
                <td class="tips-topic"></td>
                <td class="tips-cont"></td>
            </tr>
        </table>
        <!-- 收货人信息 -->
        <div class="order-name"><i class="el-icon-info"></i> 收货人信息</div>
        <table class="order-table"  width='100%' cellpadding='0' cellspacing='0'>
        <tr class="table-header">
            <td>收货人</td>
            <td>手机号码</td>
            <td>邮政编码</td>
            <td>收货地址</td>
        </tr>
        <tr>
            <td>{{ordersEntity.consignee}}</td>
            <td>{{ordersEntity.mobile}}</td>
            <td>{{ordersEntity.zipcode}}</td>
            <td>{{ordersEntity.province}}{{ordersEntity.city}}{{ordersEntity.district}}{{ordersEntity.address}}</td>
        </tr>
        </table>
        <!-- 商品信息 -->
        <div class="order-name"><i class="el-icon-info"></i> 商品信息</div>
        <table class="order-table"  width='100%' cellpadding='0' cellspacing='0'>
            <tr class="table-header">
                <td>商品名称</td>
                <td>商品图片</td>
                <td>价格/货号</td>
                <td>属性</td>
                <td>数量</td>
                <td>库存</td>
                <td>小计</td>
            </tr>
            <tr v-for="item in ordersEntity.goodsList" :key="item.id">
                <td>{{item.goodsName}}</td>
                <td><img style="width:60px" :src="item.picUrl" alt=""></td>
                <td>{{item.goodsPrice}}</td>
                <td></td>
                <td>{{item.goodsNum}}</td>
                <td>{{item.stock}}</td>
                <td></td>
            </tr>
        </table>
        <!-- 费用信息 -->
        <div class="order-name"><i class="el-icon-info"></i> 费用信息</div>
        <table class="order-table"  width='100%' cellpadding='0' cellspacing='0'>
        <tr class="table-header">
            <td>商品合计</td>
            <td>运费</td>
            <td>优惠券抵扣</td>
            <td>仙币抵扣</td>
        </tr>
        <tr>
            <td>{{ordersEntity.total_amount}}</td>
            <td>{{ordersEntity.shipping_price}}</td>
            <td>{{ordersEntity.coupon_price}}</td>
            <td>{{ordersEntity.order_amount}}</td>
        </tr>
        <tr class="table-header">
            <td>活动优惠</td>
            <td>折扣金额</td>
            <td>订单总金额</td>
            <td>应付款金额</td>
        </tr>
        <tr>
            <td>{{ordersEntity.total_amount}}</td>
            <td>{{ordersEntity.couponPrice}}</td>
            <td>{{ordersEntity.totalAmount}}</td>
            <td>{{ordersEntity.orderAmount}}</td>
        </tr>
        </table>
        <!-- 操作信息 -->
        <div class="order-name"><i class="el-icon-info"></i> 操作信息</div>
        <table class="order-table"  width='100%' cellpadding='0' cellspacing='0'>
        <tr class="table-header">
            <td>操作者</td>
            <td>操作时间</td>
            <td>订单状态</td>
            <td>付款状态</td>
            <td>付款状态</td>
            <td>备注</td>
        </tr>
        <tr>
            <td>{{ordersEntity.consignee_name}}</td>
            <td>{{ordersEntity.consignee_mobile}}</td>
            <td>{{ordersEntity.consignee_address}}</td>
            <td>{{ordersEntity.shipping_name}}</td>
            <td>{{ordersEntity.consignee_address}}</td>
            <td>{{ordersEntity.shipping_name}}</td>
        </tr>
        </table>
      <div slot="footer" class="dialog-footer">
      <el-button @click="dialogEditVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogEditVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</el-card>
</template>

<script>
export default {
  data () {
    return {
      storeId: '',
      timeRange: [],
      storeState: '',
      dataListLoading: false,
      checkStatus: '',
      dataForm: {
        orderSn: '',
        storeName: '',
        sellerName: '',
        username: ''
      },
      levelList: [],
      order: '',
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dialogEditVisible: false,
      dialogEditVisible1: false,
      dialogEditVisible2: false,
      dataList: [],
      info: {},
      auditHistory: '',
      stateList: [],
      areaList: [],
      recordList: [],
      auditCont: '',
      auditResult: '',
      ordersEntity: ''
    }
  },
  activated () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('orders/order/page'),
        method: 'get',
        params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'orderSn': this.dataForm.orderSn,
            'username': this.dataForm.username,
            'sellerName': this.dataForm.sellerName,
            'storeName': this.dataForm.storeName
        })
      }).then(({ data }) => {
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
    search () {
      this.pageIndex = 1
      this.getDataList()
    },
    showDetail (id) {
        this.dialogEditVisible = true
        this.$http({
            url: this.$http.adornUrl('orders/order/' + id + ''),
            method: 'get',
            params: this.$http.adornParams({})
        }).then(({ data }) => {
            if (data && data.code === 0) {
            console.log(data)
              this.ordersEntity = data.data
            } else {
                this.dataList = []
                this.totalCount = 0
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
    border-collapse:collapse;
}
.history-table tr td {
    border: 1px solid #d8d8d8;
    text-align: center;
    height: 50px;
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
.order-name {
  height: 60px;
  line-height: 60px;
  padding-left: 20px;
  font-size: 16px;
}
.order-table {
  border-collapse:collapse;
}
.order-table tr td {
  height: 50px;
  text-align: center;
}
.table-header td {
  background-color: #F9FAFC;
}
table,table tr th, table tr td {
  border:1px solid #e8e8e8;
}
.order-status {
  height: 60px;
  line-height: 60px;
  background-color: #f3f3f3;
  margin-top: 20px;
  padding-left: 20px;
  font-size: 16px;
}
.print-btn {
    float: right;
    margin-top: 10px;
    margin-right: 10px;
}
</style>
