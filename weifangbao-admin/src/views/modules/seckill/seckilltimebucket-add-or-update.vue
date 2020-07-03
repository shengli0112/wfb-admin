<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false"
             :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()"
             :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
      <el-form-item label="开始时间" prop="beginTime">
        <el-time-select
            v-model="dataForm.beginTime"
            :picker-options="{
                  start: '00:00',
                  step: '01:00',
                  end: '24:00'
                }"
            value-format="HH:mm"
            placeholder="选择时间">
        </el-time-select>
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-time-select
            v-model="dataForm.endTime"
            :picker-options="{
                  start: '00:00',
                  step: '01:00',
                  end: '24:00'
                }"
            value-format="HH:mm"
            placeholder="选择时间">
        </el-time-select>
      </el-form-item>
      <el-form-item label="场次名称" prop="title">
        <el-input v-model="dataForm.title" placeholder="秒杀时段标题"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="dataForm.sort" @change="handleChange" :min="1" :max="9999" label="描述文字"></el-input-number>
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
                    beginTime: '',
                    endTime: '',
                    title: '',
                    sort: ''
                }
            }
        },
        computed: {
            dataRule() {
                return {
                    beginTime: [
                        {required: true, message: this.$t('validate.required'), trigger: 'blur'}
                    ],
                    endTime: [
                        {required: true, message: this.$t('validate.required'), trigger: 'blur'}
                    ],
                    title: [
                        {required: true, message: this.$t('validate.required'), trigger: 'blur'}
                    ],
                    sort: [
                        {required: true, message: this.$t('validate.required'), trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
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
                this.$http.get(`/seckill/seckilltimebucket/${this.dataForm.id}`).then(({data: res}) => {
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
                    this.$http[!this.dataForm.id ? 'post' : 'put']('/seckill/seckilltimebucket/', this.dataForm).then(({data: res}) => {
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
