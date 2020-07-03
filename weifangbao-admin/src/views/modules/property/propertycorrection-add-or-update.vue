<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
          <el-form-item label="楼盘id:" prop="propertyId">
          <el-input v-model="dataForm.propertyId" placeholder="楼盘id"></el-input>
      </el-form-item>
          <el-form-item label="错误描述:" prop="description">
          <el-input v-model="dataForm.description" placeholder="错误描述"></el-input>
      </el-form-item>
          <el-form-item label="联系方式:" prop="contactInfo">
          <el-input v-model="dataForm.contactInfo" placeholder="联系方式"></el-input>
      </el-form-item>
          <el-form-item label="截图:" prop="screenshot">
          <el-input v-model="dataForm.screenshot" placeholder="截图"></el-input>
      </el-form-item>
          <el-form-item label="上报者id:" prop="reporterId">
          <el-input v-model="dataForm.reporterId" placeholder="上报者id"></el-input>
      </el-form-item>
          <el-form-item label="排序字段 小值在前:" prop="sort">
          <el-input v-model="dataForm.sort" placeholder="排序字段 小值在前"></el-input>
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
        propertyId: '',
        description: '',
        contactInfo: '',
        screenshot: '',
        reporterId: '',
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
        propertyId: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        description: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        contactInfo: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        screenshot: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        reporterId: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        sort: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        updateDate: [
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
      this.$http.get(`/property/propertycorrection/${this.dataForm.id}`).then(({ data: res }) => {
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
        this.$http[!this.dataForm.id ? 'post' : 'put']('/property/propertycorrection/', this.dataForm).then(({ data: res }) => {
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
