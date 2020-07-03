<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-aftersale__aftersale}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.orderSn" placeholder="订单编号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="id" label="ID" header-align="center" align="center"></el-table-column>
        <el-table-column prop="orderSn" label="订单编号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="applyTime" label="申请日期" header-align="center" align="center"></el-table-column>
        <el-table-column prop="applyRefundAmount" label="申请退款金额" header-align="center" align="center"></el-table-column>
        <el-table-column prop="refundAmount" label="实际退款金额" header-align="center" align="center"></el-table-column>
        <el-table-column prop="userNote" label="用户备注" header-align="center" align="center"></el-table-column>
        <el-table-column prop="approveNote" label="商家备注" header-align="center" align="center"></el-table-column>
        <el-table-column prop="afterSaleStatusName" label="审核状态" header-align="center" align="center"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="detailHandle(scope.row)">详情</el-button>
            <el-button type="text" size="small" @click="payback(scope.row)">退款</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="limit"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="pageSizeChangeHandle"
        @current-change="pageCurrentChangeHandle">
      </el-pagination>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="detail" @refreshDataList="getDataList" v-model="rowData"></add-or-update>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './aftersale-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      dialogVisible: false,
      mixinViewModuleOptions: {
        getDataListURL: '/order/aftersale/page',
        getDataListIsPage: true,
        deleteIsBatch: true
      },
      addOrUpdateVisible: false,
      rowData: {

      },
      dataForm: {
        id: ''
      }
    }
  },
  components: {
    AddOrUpdate
  },
  methods: {
    detailHandle: function(row){
      this.addOrUpdateVisible  = true;
      this.rowData = row;
      this.$nextTick(() => {
        this.$refs.detail.init()
      })
    },
    payback(row) {
        this.dialogVisible = true;
        this.$confirm('退款金额：' + row.refundAmount).then(_ => {
            this.$http['post']('/order/aftersale/',{id : row.id}).then(({data: res}) => {
                if(res.code !== 0){
                    return this.$message.error(res.msg)
                }
                this.$message({
                    message: this.$t('prompt.success'),
                    type: 'success',
                    duration: 500,
                    onClose: () => {
                        this.visible = false
                        this.$emit('refreshDataList',this.dataForm)
                    }
                })
            }).catch((data) => {
                if (!data) {
                    this.$message.error('退款失败!')
                    return
                }
            })
            }).catch(_ => {});
    }
  }
}
</script>
