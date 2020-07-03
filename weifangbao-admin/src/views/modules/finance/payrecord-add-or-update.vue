<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
          <el-form-item label="充值类型" prop="payType">
          <el-input v-model="dataForm.payType" placeholder="充值类型"></el-input>
      </el-form-item>
          <el-form-item label="支付方式" prop="payMode">
          <el-input v-model="dataForm.payMode" placeholder="支付方式"></el-input>
      </el-form-item>
          <el-form-item label="平台流水号" prop="platformFlowNumber">
          <el-input v-model="dataForm.platformFlowNumber" placeholder="平台流水号"></el-input>
      </el-form-item>
          <el-form-item label="订单id" prop="orderId">
          <el-input v-model="dataForm.orderId" placeholder="订单id"></el-input>
      </el-form-item>
          <el-form-item label="充值金额" prop="amount">
          <el-input v-model="dataForm.amount" placeholder="充值金额"></el-input>
      </el-form-item>
          <el-form-item label="备注信息" prop="remarks">
          <el-input v-model="dataForm.remarks" placeholder="备注信息"></el-input>
      </el-form-item>
          <el-form-item label="充值会员ID" prop="userId">
          <el-input v-model="dataForm.userId" placeholder="充值会员ID"></el-input>
      </el-form-item>
          <el-form-item label="排序" prop="sort">
          <el-input v-model="dataForm.sort" placeholder="排序"></el-input>
      </el-form-item>
          <el-form-item label="创建时间" prop="createDate">
          <el-input v-model="dataForm.createDate" placeholder="创建时间"></el-input>
      </el-form-item>
          <el-form-item label="更新时间" prop="updateDate">
          <el-input v-model="dataForm.updateDate" placeholder="更新时间"></el-input>
      </el-form-item>
          <el-form-item label="创建者ID" prop="creator">
          <el-input v-model="dataForm.creator" placeholder="创建者ID"></el-input>
      </el-form-item>
          <el-form-item label="更新者ID" prop="updater">
          <el-input v-model="dataForm.updater" placeholder="更新者ID"></el-input>
      </el-form-item>
      </el-form>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        id: '',
        payType: '',
        payMode: '',
        platformFlowNumber: '',
        orderId: '',
        amount: '',
        remarks: '',
        userId: '',
        sort: '',
        createDate: '',
        updateDate: '',
        creator: '',
        updater: '',
        isDeleted: ''
      }
    }
  },
  computed: {
    dataRule () {
      return {
        payType: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        payMode: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        platformFlowNumber: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        orderId: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        amount: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        remarks: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        userId: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        sort: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        createDate: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        updateDate: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        creator: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        updater: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        isDeleted: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/finance/payrecord/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
      }).catch(() => {})
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$http[!this.dataForm.id ? 'post' : 'put']('/finance/payrecord/', this.dataForm).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.visible = false
              this.$emit('refreshDataList')
            }
          })
        }).catch(() => {})
      })
    }, 1000, { 'leading': true, 'trailing': false })
  }
}
</script>
