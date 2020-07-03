<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false"
             :close-on-press-escape="false">
    <el-form class="dataForm" :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()"
             :label-width="$i18n.locale === 'en-US' ? '160px' : '130px'">
      <el-form-item label="楼盘:" prop="propertyName">
        <el-input :disabled="true" v-model="dataForm.propertyName" placeholder="楼盘"></el-input>
      </el-form-item>
      <el-form-item label="报备人:" prop="nickname">
        <el-input :disabled="true" v-model="dataForm.nickname" placeholder="报备人"></el-input>
      </el-form-item>
      <el-form-item label="报备人手机号:" prop="reportMobile">
        <el-input :disabled="true" v-model="dataForm.reportMobile" placeholder="报备人手机号"></el-input>
      </el-form-item>
      <el-form-item label="客户名称:" prop="customerName">
        <el-input :disabled="true" v-model="dataForm.customerName" placeholder="客户名称"></el-input>
      </el-form-item>
      <el-form-item label="客户手机号:" prop="mobile">
        <el-input :disabled="true" v-model="dataForm.mobile" placeholder="客户手机号"></el-input>
      </el-form-item>
      <el-form-item label="报备时间:" prop="createDate">
        <el-input :disabled="true" v-model="dataForm.createDate" placeholder="报备时间"></el-input>
      </el-form-item>
      <el-form-item label="看房时间:" prop="appointTime">
        <el-input :disabled="true" v-model="dataForm.appointTime" placeholder="看房时间"></el-input>
      </el-form-item>
      <el-form-item label="认购时间:" prop="subscriptionTime">
        <el-input :disabled="true" v-model="dataForm.subscriptionTime" placeholder="认购时间"></el-input>
      </el-form-item>
      <el-form-item label="签约时间:" prop="signingTime">
        <el-input :disabled="true" v-model="dataForm.signingTime" placeholder="签约时间"></el-input>
      </el-form-item>
      <el-form-item label="失效时间:" prop="invalidTime">
        <el-input :disabled="true" v-model="dataForm.invalidTime" placeholder="失效时间"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="dataForm.status" placeholder="请选择" @change="changeStatusName(dataForm.status)">
          <el-option
              v-for="item in status"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
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
        data() {
            return {
                visible: false,
                dataForm: {
                    id: '',
                    unionId: '',
                    propertyId: '',
                    customerId: '',
                    customerName:'',
                    reportMobile:'',
                    appointTime: '',
                    subscriptionTime: '',
                    signingTime: '',
                    invalidTime: '',
                    status: '',
                    statusName: '',
                    sort: '',
                    createDate: '',
                    updateDate: '',
                    creator: '',
                    updater: '',
                    isDeleted: ''
                },
                status: [{
                    value: 1,
                    label: "已报备"
                }, {
                    value: 2,
                    label: "已看房"
                }, {
                    value: 3,
                    label: "已认购"
                }, {
                    value: 4,
                    label: "已签约"
                }, {
                    value: 5,
                    label: "已失效"
                }],
            }
        },
        computed: {
            dataRule() {
                return {
                    status: [
                        {required: true, message: this.$t('validate.required'), trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            formatDate(date) {
                // 判断时间是否已转换为字符串格式
                if ((date instanceof String) || (typeof date).toLowerCase() == 'string') {
                    return date
                } else {
                    let y = date.getFullYear();
                    let m = date.getMonth() + 1;
                    m = m < 10 ? ('0' + m) : m;
                    let d = date.getDate();
                    d = d < 10 ? ('0' + d) : d;
                    let h = date.getHours();
                    let minute = date.getMinutes();
                    minute = minute < 10 ? ('0' + minute) : minute;
                    let second = date.getSeconds();
                    second = minute < 10 ? ('0' + second) : second;
                    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
                }
            },
            changeStatusName(value) {
                let _this = this
                this.status.forEach(function (item) {
                    if (item.value == value) {
                        _this.dataForm.statusName = item.label
                    }
                })
            },
            init() {
                this.visible = true
                this.$nextTick(() => {
                    this.$refs['dataForm'].resetFields()
                    if (this.dataForm.id) {
                        this.getInfo()
                    }
                })
            },
            // 获取信息
            getInfo() {
                this.$http.get(`/report/report/${this.dataForm.id}`).then(({data: res}) => {
                    if (res.code !== 0) {
                        return this.$message.error(res.msg)
                    }
                    this.dataForm = {
                        ...this.dataForm,
                        ...res.data
                    }
                }).catch(() => {
                })
            },
            // 表单提交
            dataFormSubmitHandle: debounce(function () {
                this.$refs['dataForm'].validate((valid) => {
                    if (!valid) {
                        return false
                    }
                    this.$http[!this.dataForm.id ? 'post' : 'put']('/report/report/', this.dataForm).then(({data: res}) => {
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
                    }).catch(() => {
                    })
                })
            }, 1000, {'leading': true, 'trailing': false})
        }
    }
</script>
<style scoped>
  .dataForm{
    margin: 0 100px 0 0;
  }
</style>
