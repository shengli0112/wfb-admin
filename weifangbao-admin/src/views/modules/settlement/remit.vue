<template>
  <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible" title="打款">
    <el-form :model="dataForm" :rules="dataRule" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px" ref="dataForm">
      <el-form-item label="结算金额:" prop="settlementAmount">
        <el-input placeholder="结算金额" readonly v-model="detailData.settlementAmount"></el-input>
      </el-form-item>
      <el-form-item label="备注信息:" prop="remark">
        <el-input placeholder="备注信息" v-model="dataForm.remark"></el-input>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button @click="dataFormSubmitHandle">确认打款</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import debounce from 'lodash/debounce'

  export default {
    data(){
      return {
        visible: false,
        detailData: {},
        dataForm: {
          id: '',
          settlementAmount: '',
          remark: '',
        }
      }
    },
    computed: {
      dataRule(){
        return {
          payTime: [
            {required: true, message: this.$t('validate.required'), trigger: 'blur'}
          ],
        }
      }
    },
    methods: {
      init(){
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.getInfo()
        })
      },
      // 获取信息
      getInfo(){
        this.dataForm.id = this.detailData.id;
        this.dataForm.settlementAmount = this.detailData.settlementAmount;
      },
      // 表单提交
      dataFormSubmitHandle: debounce(function(){
        this.$refs['dataForm'].validate((valid) => {
          if(!valid){
            return false
          }
          this.$http['post']('/settlement/ordersettlement/pay', this.dataForm).then(({data: res}) => {
            if(res.code !== 0){
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
          }).catch(() => {
          })
        })
      }, 1000, {'leading': true, 'trailing': false})
    }
  }
</script>
