<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
          <el-form-item label="订单号" prop="orderSn">
            <span>{{dataForm.orderSn}}</span>
      </el-form-item>
        <el-form-item label="申请时间" prop="storeId">
          <span>{{dataForm.applyTime}}</span>
        </el-form-item>
        <el-form-item label="用户账号" prop="username">
          <span>{{dataForm.username}}</span>
        </el-form-item>
        <el-form-item label="用户电话" prop="userMobile">
          <span>{{dataForm.userMobile}}</span>
        </el-form-item>
        <el-form-item label="申请退款金额" prop="applyRefundAmount">
          <span>{{dataForm.applyRefundAmount}}</span>
        </el-form-item>
        <el-form-item label="用户备注" prop="userNote">
          <span>{{dataForm.userNote}}</span>
        </el-form-item>
        <el-form-item label="商家账号" prop="sellerAccount">
          <span>{{dataForm.sellerAccount}}</span>
        </el-form-item>
        <el-form-item label="商家电话" prop="sellerMobile">
          <span>{{dataForm.sellerMobile}}</span>
        </el-form-item>
        <el-form-item label="商家退款金额" prop="refundAmount">
          <span>{{dataForm.refundAmount}}</span>
        </el-form-item>
        <el-form-item label="商家备注" prop="approveNote">
          <span>{{dataForm.approveNote}}</span>
        </el-form-item>
      </el-form>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
export default {
  props: ['value'],
  data () {
    return {
      visible: false,
      dataForm: {

      }
    }
  },
  methods: {
    init () {
      this.visible = true;
        this.$nextTick(() => {
            this.dataForm = {
                ...this.value,
            }
        })
    }
  }
}
</script>
