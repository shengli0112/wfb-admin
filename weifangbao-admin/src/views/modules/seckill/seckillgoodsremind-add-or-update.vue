<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
          <el-form-item label="用户ID" prop="userId">
          <el-input v-model="dataForm.userId" placeholder="用户ID"></el-input>
      </el-form-item>
          <el-form-item label="秒杀商品ID" prop="secGoodsSkuId">
          <el-input v-model="dataForm.secGoodsSkuId" placeholder="秒杀商品ID"></el-input>
      </el-form-item>
          <el-form-item label="添加时间" prop="addTime">
          <el-input v-model="dataForm.addTime" placeholder="添加时间"></el-input>
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
          <el-form-item label="" prop="isDeleted">
          <el-input v-model="dataForm.isDeleted" placeholder=""></el-input>
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
        userId: '',
        secGoodsSkuId: '',
        addTime: '',
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
        userId: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        secGoodsSkuId: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        addTime: [
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
      this.$http.get(`/seckill/seckillgoodsremind/${this.dataForm.id}`).then(({ data: res }) => {
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
        this.$http[!this.dataForm.id ? 'post' : 'put']('/seckill/seckillgoodsremind/', this.dataForm).then(({ data: res }) => {
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
