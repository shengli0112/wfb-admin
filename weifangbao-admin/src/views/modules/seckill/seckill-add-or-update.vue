<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
          <el-form-item label="商家ID" prop="storeId">
          <el-input v-model="dataForm.storeId" placeholder="商家ID"></el-input>
      </el-form-item>
          <el-form-item label="活动标题" prop="actiTitle">
          <el-input v-model="dataForm.actiTitle" placeholder="秒杀活动标题"></el-input>
      </el-form-item>
          <el-form-item label="活动开始日期" prop="actiBeginTime">
            <el-date-picker
                v-model="dataForm.actiBeginTime"
                align="right"
                type="date"
                placeholder="选择日期"
                :picker-options="pickerOptions">
            </el-date-picker>
      </el-form-item>
          <el-form-item label="活动结束日期" prop="actiEndTime">
            <el-date-picker
                v-model="dataForm.actiEndTime"
                align="right"
                type="date"
                placeholder="选择日期"
                :picker-options="pickerOptions">
            </el-date-picker>
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
        storeId: '',
        actiTitle: '',
        actiBeginTime: '',
        actiEndTime: '',
        reviewStatus: '',
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
        storeId: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        actiTitle: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        actiBeginTime: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        actiEndTime: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        reviewStatus: [
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
      this.$http.get(`/seckill/seckill/${this.dataForm.id}`).then(({ data: res }) => {
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
        this.$http[!this.dataForm.id ? 'post' : 'put']('/seckill/seckill/', this.dataForm).then(({ data: res }) => {
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
