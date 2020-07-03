<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false" width="60%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">
      <el-form-item prop="title" :label="$t('news.title')">
        <el-input v-model="dataForm.title" :placeholder="$t('news.title')"></el-input>
      </el-form-item>
      <el-form-item prop="typeId" :label="$t('help.type')">
        <el-select v-model="dataForm.typeId" :placeholder="$t('help.type')" clearable>
          <el-option v-for="item in typeList" :label="item.name" :value="item.id" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="content" :label="$t('news.content')">
        <!-- 富文本编辑器, 容器 -->
        <div id="J_quillEditor"></div>
        <!-- 自定义上传图片功能 (使用element upload组件) -->
        <el-upload
          :action="uploadUrl"
          :show-file-list="false"
          :before-upload="uploadBeforeUploadHandle"
          :on-success="uploadSuccessHandle"
          style="display: none;">
          <el-button ref="uploadBtn" type="primary" size="small">{{ $t('upload.button') }}</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item prop="showFlag" :label="$t('help.show')">
        <el-switch
          v-model="dataForm.showFlag"
          active-color="#13ce66"
          inactive-color="#ff4949"
          :active-value=1
          :inactive-value=0>
        </el-switch>
      </el-form-item>
      <el-form-item prop="sort" :label="$t('dept.sort')">
        <el-input v-model="dataForm.sort" :placeholder="$t('dept.sort')" type="number"></el-input>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import Cookies from 'js-cookie'
import debounce from 'lodash/debounce'
import 'quill/dist/quill.snow.css'
import Quill from 'quill'
export default {
  data () {
    return {
      visible: false,
      quillEditor: null,
      quillEditorToolbarOptions: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block', 'image'],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['clean']
      ],
      uploadUrl: '',
      dataForm: {
        id: '',
        title: '',
        typeId: null,
        content: '',
        sort: null,
        showFlag: 1
      },
      typeList: [],
      dataRule: {
        title: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        content: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' },
          { validator: (rule, value, callback) => {
            if (this.quillEditor.getLength() <= 1) {
              return callback(new Error(this.$t('validate.required')))
            }
            callback()
          }, trigger: 'blur' }
        ],
        typeId: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    // dataRule () {
    //   var validateContent = (rule, value, callback) => {
    //     if (this.quillEditor.getLength() <= 1) {
    //       return callback(new Error(this.$t('validate.required')))
    //     }
    //     callback()
    //   }
    //   return {
    //     title: [
    //       { required: true, message: this.$t('validate.required'), trigger: 'blur' }
    //     ],
    //     content: [
    //       { required: true, message: this.$t('validate.required'), trigger: 'blur' },
    //       { validator: validateContent, trigger: 'blur' }
    //     ],
    //     typeId: [
    //       { required: true, message: this.$t('validate.required'), trigger: 'blur' }
    //     ]
    //   }
    // }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        if (this.quillEditor) {
          this.quillEditor.deleteText(0, this.quillEditor.getLength())
        } else {
          this.quillEditorHandle()
        }
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.getInfo()
        }
        this.getType()
      })
    },
    getType () {
      this.$http.get(`helpcenter/type/all`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.typeList = res.data
      }).catch(() => {})
    },
    // 富文本编辑器
    quillEditorHandle () {
      this.quillEditor = new Quill('#J_quillEditor', {
        modules: {
          toolbar: this.quillEditorToolbarOptions
        },
        theme: 'snow'
      })
      // 自定义上传图片功能 (使用element upload组件)
      this.uploadUrl = `${window.SITE_CONFIG['apiURL']}/sys/oss/upload?token=${Cookies.get('token')}`
      this.quillEditor.getModule('toolbar').addHandler('image', () => {
        this.$refs.uploadBtn.$el.click()
      })
      // 监听内容变化，动态赋值
      this.quillEditor.on('text-change', () => {
        this.dataForm.content = this.quillEditor.root.innerHTML
      })
    },
    // 上传图片之前
    uploadBeforeUploadHandle (file) {
      if (file.type !== 'image/jpg' && file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif') {
        this.$message.error('只支持jpg、png、gif格式的图片！')
        return false
      }
    },
    // 上传图片成功
    uploadSuccessHandle (res, file, fileList) {
      if (res.code !== 0) {
        return this.$message.error(res.msg)
      }
      this.quillEditor.insertEmbed(this.quillEditor.getSelection().index, 'image', res.data.src)
    },
    // 获取信息
    getInfo () {
      this.$http.get(`helpcenter/content/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = res.data
        this.quillEditor.root.innerHTML = this.dataForm.content
      }).catch(() => {})
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      console.log(this.dataForm)
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$http[!this.dataForm.id ? 'post' : 'put'](
          'helpcenter/content',
          this.dataForm,
          { headers: { 'content-type': 'application/x-www-form-urlencoded' } }
        ).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 800,
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
