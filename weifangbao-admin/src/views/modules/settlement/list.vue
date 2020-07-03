<template>
  <el-card class="aui-card--fill" shadow="never">
    <div class="mod-settlement__settlement}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
<!--        <el-form-item>-->
<!--          <el-input clearable placeholder="id" v-model="dataForm.id"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item>-->
<!--          <el-button @click="getDataList()">{{ $t('query') }}</el-button>-->
<!--        </el-form-item>-->
<!--        <el-form-item>-->
<!--          <el-button @click="exportHandle()" type="info">{{ $t('export') }}</el-button>-->
<!--        </el-form-item>-->
        <el-form-item>
          <el-button @click="addOrUpdateHandle()" type="primary" v-if="$hasPermission('settlement:settlement:add')">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="deleteHandle()" type="danger" v-if="$hasPermission('settlement:settlement:delete')">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="dataList" @selection-change="dataListSelectionChangeHandle" border style="width: 100%;" v-loading="dataListLoading">
        <el-table-column align="center" header-align="center" type="selection" width="50"></el-table-column>
        <el-table-column align="center" header-align="center" label="订单编号" prop="orderSn" width="160"></el-table-column>
        <el-table-column align="center" header-align="center" label="结算编号" prop="settlementSn" width="160"></el-table-column>
        <el-table-column align="center" header-align="center" label="商家账号" prop="sellerAccount" width="150"></el-table-column>
        <el-table-column align="center" header-align="center" label="商家名称" prop="storeName" width="200"></el-table-column>
<!--        <el-table-column align="center" header-align="center" label="退款金额" prop="refundAmount"></el-table-column>-->
<!--        <el-table-column align="center" header-align="center" label="平台抽成金额" prop="platCutAmount"></el-table-column>-->
        <el-table-column align="right" header-align="center" label="结算金额" prop="settlementAmount" width="100"></el-table-column>
        <el-table-column align="center" header-align="center" label="结算时间" prop="settlementTime" width="180"></el-table-column>
        <el-table-column align="center" header-align="center" label="打款状态" prop="payStatus">
          <template slot-scope="scope">
            <span >{{scope.row.payStatus==1?'已打款':'未打款'}}</span>
          </template>
        </el-table-column> <!--0：未打款  1：已打款-->
        <el-table-column align="center" header-align="center" label="打款时间" prop="payTime" width="180"></el-table-column>
        <el-table-column :label="$t('handle')" align="center" fixed="right" header-align="center" width="150">
          <template slot-scope="scope">
            <el-button @click="addOrUpdateHandle(scope.row.id)" size="small" type="text" >{{ $t('detail') }}</el-button>
            <el-button @click="remitHandle(scope.row)" size="small" type="text" v-if="scope.row.payStatus!=1">打款</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          :current-page="page"
          :page-size="limit"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          @current-change="pageCurrentChangeHandle"
          @size-change="pageSizeChangeHandle"
          layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
      <!-- 弹窗, 新增 / 修改 -->
      <remit @refreshDataList="getDataList" ref="remit" v-if="remitVisible"></remit>
      <add-or-update @refreshDataList="getDataList" ref="addOrUpdate" v-if="addOrUpdateVisible"></add-or-update>
    </div>
  </el-card>
</template>

<script>
  import mixinViewModule from '@/mixins/view-module'
  import Remit from './remit'
  import AddOrUpdate from './detail'

  export default {
    mixins: [mixinViewModule],
    data(){
      return {
        remitVisible: false,
        mixinViewModuleOptions: {
          getDataListURL: '/settlement/ordersettlement/page',
          getDataListIsPage: true,
          exportURL: '/settlement/ordersettlement/export',
          deleteURL: '/settlement/ordersettlement',
          deleteIsBatch: true
        },
        dataForm: {
          id: ''
        }
      }
    },
    components: {
      Remit,AddOrUpdate
    },
    methods: {
      remitHandle: function(data){
        console.log(data);
        this.remitVisible = true;
        this.$nextTick(() => {
          this.$refs.remit.detailData = data;
          this.$refs.remit.init();
        })
      }
    }
  }
</script>
