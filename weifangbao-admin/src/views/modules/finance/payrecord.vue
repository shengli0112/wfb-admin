<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-finance__payrecord}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.id" placeholder="会员账号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.id" placeholder="订单编号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="payModeValue" clearable placeholder="请选择">
            <el-option
                v-for="item in payMode"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
              v-model="payDatePicker"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="充值日期"
              end-placeholder="充值日期"
              :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="payType" label="充值类型" header-align="center" align="center"></el-table-column>
        <el-table-column prop="payMode" label="支付方式" header-align="center" align="center"></el-table-column>
        <el-table-column prop="platformFlowNumber" label="平台流水号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="orderId" label="订单编号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="amount" label="充值金额" header-align="center" align="center"></el-table-column>
        <el-table-column prop="remarks" label="备注信息" header-align="center" align="center"></el-table-column>
        <el-table-column prop="userId" label="充值会员账号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="createDate" label="支付时间" header-align="center" align="center"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('finance:payrecord:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('finance:payrecord:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './payrecord-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/finance/payrecord/page',
        getDataListIsPage: true,
        deleteURL: '/finance/payrecord',
        deleteIsBatch: true
      },
        payMode:[{
            value: '0',
            label: '未知渠道'
        }, {
            value: '1',
            label: '支付宝'
        }, {
            value: '2',
            label: '微信支付'
        }, {
            value: '3',
            label: '银联支付'
        }, {
            value: '4',
            label: '信用卡支付'
        }],
        payModeValue:'',
      dataForm: {
        id: ''
      },
        pickerOptions: {
            shortcuts: [{
                text: '最近一周',
                onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                }
            }, {
                text: '最近一个月',
                onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                }
            }, {
                text: '最近三个月',
                onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                }
            }]
        },
        payDatePicker: '',
    }
  },
  components: {
    AddOrUpdate
  }
}
</script>
