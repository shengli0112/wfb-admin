<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
          <el-form-item label="名称" prop="name">
          <el-input v-model="dataForm.name" placeholder="广告位置名"></el-input>
      </el-form-item>
          <el-form-item label="简介" prop="intro">
          <el-input v-model="dataForm.intro" placeholder="广告位简介"></el-input>
      </el-form-item>
          <el-form-item label="展示方式" prop="displayMode">
            <el-select v-model="value" placeholder="请选择">
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
      </el-form-item>
          <el-form-item label="高度(px)" prop="height">
          <el-input v-model="dataForm.height" placeholder="广告位高度"></el-input>
      </el-form-item>
          <el-form-item label="宽度(px)" prop="width">
          <el-input v-model="dataForm.width" placeholder="广告位宽度"></el-input>
      </el-form-item>
          <el-form-item label="单价" prop="price">
          <el-input v-model="dataForm.price" placeholder="广告位单价"></el-input>
      </el-form-item>
          <el-form-item label="占位图" prop="defaultSpaceImage">
            <el-upload
                action="https://jsonplaceholder.typicode.com/posts/"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
            </el-upload>
      </el-form-item>
          <el-form-item label="显示终端" prop="displayTerminal">
            <el-select v-model="value2" placeholder="请选择">
              <el-option
                  v-for="item in options2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
      </el-form-item>
          <el-form-item label="排序" prop="sort">
          <el-input v-model="dataForm.sort" placeholder="排序"></el-input>
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
        name: '',
        intro: '',
        displayMode: '',
        height: '',
        width: '',
        price: '',
        clickNum: '',
        defaultSpaceImage: '',
        displayTerminal: '',
        sort: '',
        creator: '',
        createDate: '',
        updater: '',
        updateDate: '',
        isDeleted: ''
      },
      options: [{
          value: '0001',
          label: '多图轮播'
      }, {
          value: '0002',
          label: '单图'
      }, ],
      value: '',
      options2: [{
          value: '0001',
          label: '手机'
      }, {
          value: '0002',
          label: '电脑'
      }, ],
      value2: ''
    }
  },
  computed: {
    dataRule () {
      return {
        name: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        intro: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        displayMode: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        height: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        width: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        price: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        clickNum: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        defaultSpaceImage: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        displayTerminal: [
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
      this.$http.get(`/advertising/advposition/${this.dataForm.id}`).then(({ data: res }) => {
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
        this.$http[!this.dataForm.id ? 'post' : 'put']('/advertising/advposition/', this.dataForm).then(({ data: res }) => {
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
