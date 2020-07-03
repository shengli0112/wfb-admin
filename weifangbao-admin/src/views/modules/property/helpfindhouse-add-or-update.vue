<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
          <el-form-item label="unionId:" prop="unionId">
          <el-input v-model="dataForm.unionId" placeholder="unionId"></el-input>
      </el-form-item>
          <el-form-item label="购房区域:" prop="areaId">
          <el-input v-model="dataForm.areaId" placeholder="购房区域"></el-input>
      </el-form-item>
          <el-form-item label="购房预算:" prop="budget">
          <el-input v-model="dataForm.budget" placeholder="购房预算"></el-input>
      </el-form-item>
          <el-form-item label="户型:" prop="apartment">
          <el-input v-model="dataForm.apartment" placeholder="户型"></el-input>
      </el-form-item>
          <el-form-item label="状态 0 停用 1启用:" prop="status">
          <el-input v-model="dataForm.status" placeholder="状态 0 停用 1启用"></el-input>
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
        unionId: '',
        areaId: '',
        budget: '',
        apartment: '',
        status: '',
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
        unionId: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        areaId: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        budget: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        apartment: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        status: [
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
      this.$http.get(`/helpfind/helpfindhouse/${this.dataForm.id}`).then(({ data: res }) => {
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
        this.$http[!this.dataForm.id ? 'post' : 'put']('/helpfind/helpfindhouse/', this.dataForm).then(({ data: res }) => {
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
