<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false"
             :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()"
             :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
      <el-form-item label="名称:" prop="regionName">
        <el-input v-model="dataForm.regionName" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="排序:" prop="sort">
        <el-input v-model="dataForm.sort" placeholder="请输入排序"></el-input>
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
                    parentId: this.parentId,
                    regionName: '',
                    sort: '',
                    createDate: '',
                    updateDate: '',
                    creator: '',
                    updater: '',
                    isDeleted: ''
                }
            }
        },
        props: ['parentId'],
        created() {

        },
        watch: {
            parentId: function (val) {
                if (val) {
                    this.parentId = val
                }
            }
        },
        computed: {
            dataRule() {
                return {
                    parentId: [
                        {required: true, message: this.$t('validate.required'), trigger: 'blur'}
                    ],
                    regionName: [
                        {required: true, message: this.$t('validate.required'), trigger: 'blur'}
                    ],
                    sort: [
                        {required: true, message: this.$t('validate.required'), trigger: 'blur'}
                    ],
                    updateDate: [
                        {required: true, message: this.$t('validate.required'), trigger: 'blur'}
                    ],
                    updater: [
                        {required: true, message: this.$t('validate.required'), trigger: 'blur'}
                    ],
                    isDeleted: [
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
                this.$http.get(`/property/propertyregion/${this.dataForm.id}`).then(({data: res}) => {
                    if (res.code !== 0) {
                        return this.$message.error(res.msg)
                    }
                    this.dataForm = {
                        ...this.dataForm,
                        ...res.data
                    }
                    console.log(this.dataForm)
                }).catch(() => {
                })
            },
            // 表单提交
            dataFormSubmitHandle: debounce(function () {
                this.dataForm.parentId = this.parentId
                this.$emit('getPId',this.parentId)
                this.$refs['dataForm'].validate((valid) => {
                    if (!valid) {
                        return false
                    }
                    this.$http[!this.dataForm.id ? 'post' : 'put']('/property/propertyregion/', this.dataForm).then(({data: res}) => {
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
