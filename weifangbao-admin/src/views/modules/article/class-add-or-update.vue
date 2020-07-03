<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false" width="40%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">
      <el-form-item prop="name" :label="$t('help.type')">
        <el-input v-model="dataForm.name" :placeholder="$t('help.type')"></el-input>
      </el-form-item>
      <el-form-item prop="pid" label="上级分类">
        <el-select v-model="dataForm.pid" clearable>
          <el-option v-for="item in classList" :label="item.name" :value="item.id" :key="item.id"></el-option>
        </el-select>
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
  import debounce from 'lodash/debounce'

  export default {
  data () {
    return {
      visible: false,
      uploadUrl: '',
      classList: [],
      dataForm: {
        pid: '0',
        name: '',
        sort: 0
      },
      typeList: [],
      dataRule: {
        name: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        sort: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    // dataRule () {
    //   return {
    //     name: [
    //       { required: true, message: this.$t('validate.required'), trigger: 'blur' }
    //     ],
    //     sort: [
    //       { required: true, message: this.$t('validate.required'), trigger: 'blur' }
    //     ]
    //   }
    // }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.getInfo()
        }
        this.getClass()
      })
    },
    getClass () {
      this.$http.get( window.SITE_CONFIG['OPEN_API_HOME'] + 'sys/articleclass/list/0').then(({data: res}) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        let list = res.data
        list.unshift({
          name: '顶级分类',
          id: '0'
        })
        this.classList = list
      }).catch(() => {})
    },
    // 获取信息
    getInfo () {
      this.$http.get( window.SITE_CONFIG['OPEN_API_HOME'] + `sys/articleclass/${this.dataForm.id}`).then(({data: res}) => {
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
          window.SITE_CONFIG['OPEN_API_HOME'] + 'sys/articleclass',
          this.dataForm,
          { headers: { 'content-type': 'application/json' } }
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
