<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'" :model="dataForm" :rules="dataRule" @keyup.enter.native="dataFormSubmitHandle()"
             ref="dataForm">
      <el-form-item label="导航名称" prop="name">
        <el-input placeholder="导航名称" v-model="dataForm.name"></el-input>
      </el-form-item>
      <el-form-item label="导航图标" prop="icon">
        <!--<el-input placeholder="导航图标URL" v-model="dataForm.icon"></el-input>-->
        <el-upload :action="uploadUrl" :on-success="handleSuccess" :show-file-list="false" class="post-uploader">
          <img :src="dataForm.icon" class="identify-card" v-if="dataForm.icon">
          <i class="el-icon-plus post-uploader-icon" v-else></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="终端类型" prop="type">
        <el-input placeholder="终端类型 0-PC端,1-手机端" v-model="dataForm.type"></el-input>
      </el-form-item>
      <el-form-item label="页面链接" prop="pageUrl">
        <el-input placeholder="页面链接" v-model="dataForm.pageUrl"></el-input>
      </el-form-item>
      <!--<el-form-item label="所属导航模块" prop="positionId">
        <el-input placeholder="所属导航模块ID" v-model="dataForm.positionId"></el-input>
      </el-form-item>-->
      <el-form-item label="是否显示" prop="showFlag">
        <el-input placeholder="是否显示" v-model="dataForm.showFlag"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input placeholder="排序" v-model="dataForm.sort"></el-input>
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
      uploadUrl: '',
      dataForm: {
        id: '',
        name: '',
        icon: '',
        type: '',
        pageUrl: '',
        positionId: '',
        showFlag: '',
        sort: '',
        creator: '',
        createDate: '',
        updater: '',
        updateDate: ''
      }
    }
  },
  computed: {
    dataRule () {
      return {
        name: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        icon: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        type: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        pageUrl: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        positionId: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        showFlag: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        sort: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        creator: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        createDate: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        updater: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        updateDate: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.uploadUrl = `${window.SITE_CONFIG['apiURL']}/sys/oss/upload`
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/fastNavigation/fastnavigation/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
      }).catch(() => {})
    },
    handleSuccess (res, file) {
      if (res.code !== 0) {
        return this.$message.error(res.msg)
      }
      this.dataForm.icon = res.data.src
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$http[!this.dataForm.id ? 'post' : 'put']('/fastNavigation/fastnavigation/', this.dataForm).then(({ data: res }) => {
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
