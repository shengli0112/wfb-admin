<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
          <el-form-item label="秒杀活动ID" prop="secId">
          <el-input v-model="dataForm.secId" placeholder="秒杀活动ID"></el-input>
      </el-form-item>
          <el-form-item label="秒杀时段ID" prop="tbId">
          <el-input v-model="dataForm.tbId" placeholder="秒杀时段ID"></el-input>
      </el-form-item>
          <el-form-item label="商品SKUID" prop="goodsSkuId">
          <el-input v-model="dataForm.goodsSkuId" placeholder="商品SKUID"></el-input>
      </el-form-item>
          <el-form-item label="商品秒杀价" prop="secPrice">
          <el-input v-model="dataForm.secPrice" placeholder="商品秒杀价"></el-input>
      </el-form-item>
          <el-form-item label="活动剩余库存" prop="secNum">
          <el-input v-model="dataForm.secNum" placeholder="活动剩余库存"></el-input>
      </el-form-item>
          <el-form-item label="参与秒杀活动商品数量" prop="secLimit">
          <el-input v-model="dataForm.secLimit" placeholder="参与秒杀活动商品数量"></el-input>
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
        secId: '',
        tbId: '',
        goodsSkuId: '',
        secPrice: '',
        secNum: '',
        secLimit: '',
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
        secId: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        tbId: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        goodsSkuId: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        secPrice: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        secNum: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        secLimit: [
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
      this.$http.get(`/seckill/seckillgoods/${this.dataForm.id}`).then(({ data: res }) => {
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
        this.$http[!this.dataForm.id ? 'post' : 'put']('/seckill/seckillgoods/', this.dataForm).then(({ data: res }) => {
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
