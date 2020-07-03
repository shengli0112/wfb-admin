<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false" width="600px">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">
      <el-form-item prop="levelName" :label="$t('member.lvName')">
        <el-input v-model="dataForm.levelName" :placeholder="$t('member.lvName')"></el-input>
        <p class="input-tip">设置会员等级名称</p>
      </el-form-item>
      <el-form-item prop="upgrade" :label="$t('member.lvCondition')">
        <el-checkbox-group v-model="conditions">
          <div>
            <el-checkbox label="累计积分满"></el-checkbox>
            <div class="Condition-wrap">
              <el-input v-model="dataForm.minIntegral">
                <template slot="append">分</template>
              </el-input>
            </div>
          </div>
          <div >
            <el-checkbox label="消费额度满"></el-checkbox>
            <div class="Condition-wrap">
              <el-input v-model="dataForm.quota">
                <template slot="append">元</template>
              </el-input>
            </div>
          </div>
        </el-checkbox-group>
        <div v-if="conditions.length == 2">
          <el-radio v-model="dataForm.relation" :label="1">或</el-radio>
          <el-radio v-model="dataForm.relation" :label="2">且</el-radio>
        </div>
      </el-form-item>
      <el-form-item prop="goodsDiscount" :label="$t('member.discount')">
        <el-input v-model="dataForm.goodsDiscount" type="number">
          <template slot="append">%</template>
        </el-input>
        <p class="input-tip">折扣率单位为百分比，如输入90，表示该会员等级的用户可以以商品原价的90%购买</p>
      </el-form-item>
      <el-form-item prop="description" :label="$t('member.description')">
        <el-input v-model="dataForm.description" type="textarea">
        </el-input>
        <p class="input-tip">会员等级描述信息</p>
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
      conditions: [],
      dataForm: {
        id: '',
        levelName: '',
        content: '',
        upgrade: null,
        minIntegral: '',
        quota: '',
        relation: 1,
        goodsDiscount: null,
        description: ''
      },
      dataRule: {
        levelName: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        goodsDiscount: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        upgrade: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    // dataRule () {
    //   return {
    //     levelName: [
    //       { required: true, message: this.$t('validate.required'), trigger: 'blur' }
    //     ],
    //     goodsDiscount: [
    //       { required: true, message: this.$t('validate.required'), trigger: 'blur' }
    //     ],
    //     upgrade: [
    //       { required: true, message: this.$t('validate.required'), trigger: 'blur' }
    //     ]
    //   }
    // }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        // this.$refs['dataForm'].resetFields()
        this.conditions = []
        const id = this.dataForm.id
        this.dataForm = {
          id: id,
          levelName: '',
          content: '',
          upgrade: null,
          minIntegral: '',
          quota: '',
          relation: 1,
          goodsDiscount: null,
          description: ''
        }
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/member/level/info?id=${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = res.data[0]
        if (this.dataForm.upgrade === 1) {
          this.conditions = ['累计积分满']
        } else if (this.dataForm.upgrade === 2) {
          this.conditions = ['消费额度满']
        } else if (this.dataForm.upgrade === 3) {
          this.conditions = ['累计积分满', '消费额度满']
        }
      }).catch(() => {})
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$http[!this.dataForm.id ? 'post' : 'put'](
          '/member/level',
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
  },
  watch: {
    conditions (val) {
      console.log(val)
      if (val[0] === '累计积分满' && val.length === 1) {
        console.log(1)
        this.dataForm.upgrade = 1
      } else if (val[0] === '消费额度满' && val.length === 1) {
        console.log(2)
        this.dataForm.upgrade = 2
      } else if (val.length === 2) {
        console.log(3)
        this.dataForm.upgrade = 3
      } else if (val.length === 0) {
        console.log(4)
        this.dataForm.upgrade = null
      }
    }
  }
}
</script>

<style scoped>
.Condition-wrap {
  display: inline-block;
  margin-left: 20px;
}
</style>
