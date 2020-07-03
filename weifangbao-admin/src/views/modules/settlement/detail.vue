<template>
  <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :title="$t('detail')" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px" ref="dataForm">
      <el-form-item label="订单编号:" prop="orderSn">
        <el-input placeholder="订单编号" readonly v-model="dataForm.orderSn"></el-input>
      </el-form-item>
      <el-form-item label="结算编号:" prop="settlementSn">
        <el-input :value="dataForm.settlementSn" placeholder="结算编号"></el-input>
      </el-form-item>
      <el-form-item label="订单支付金额:" prop="orderAmount">
        <el-input placeholder="订单支付金额" readonly v-model="dataForm.orderAmount"></el-input>
      </el-form-item>
      <el-form-item label="退款金额:" prop="refundAmount">
        <el-input placeholder="退款金额" readonly v-model="dataForm.refundAmount"></el-input>
      </el-form-item>
      <el-form-item label="平台抽成金额:" prop="platCutAmount">
        <el-input placeholder="平台抽成金额" readonly v-model="dataForm.platCutAmount"></el-input>
      </el-form-item>
      <el-form-item label="结算金额:" prop="settlementAmount">
        <el-input placeholder="结算金额" readonly v-model="dataForm.settlementAmount"></el-input>
      </el-form-item>
      <el-form-item label="结算时间:" prop="settlementTime">
        <el-input placeholder="结算时间" readonly v-model="dataForm.settlementTime"></el-input>
      </el-form-item>
      <el-form-item label="打款状态" prop="payStatusName"> <!--  0：未打款  1：已打款  payStatusName=未打款-->
        {{dataForm.payStatusName}}
      </el-form-item>
      <el-form-item label="打款时间:" prop="payTime" v-if="dataForm.payStatus==1">
        <el-input placeholder="打款时间" readonly v-model="dataForm.payTime"></el-input>
        <!--        <el-date-picker default-time="12:00:00" type="datetime" v-if="dataForm.payStatus!=1" v-model="dataForm.payTime" value-format="yyyy-MM-dd HH:mm:ss"/>-->
      </el-form-item>
      <el-form-item label="备注信息:" prop="remark">
        <el-input placeholder="备注信息" readonly v-model="dataForm.remark"></el-input>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('close') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>

  export default {
    data(){
      return {
        visible: false,

        dataForm: {
          id: '',
          settlementAmount: '',
          settlementTime: '',
          remark: '',
        }
      }
    },
    computed: {
      dataRule(){
        return {
          payTime: [
            {required: this.dataForm.payStatus != 1, message: this.$t('validate.required'), trigger: 'blur'}
          ],
        }
      }
    },
    methods: {
      init(){
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if(this.dataForm.id){
            this.getInfo()
          }
        })
      },
      // 获取信息
      getInfo(){
        this.$http.get(`/settlement/ordersettlement/${this.dataForm.id}`).then(({data: res}) => {
          if(res.code !== 0){
            return this.$message.error(res.msg)
          }
          this.dataForm = {
            ...this.dataForm,
            ...res.data
          }
        }).catch(() => {
        })
      },

    }
  }
</script>
