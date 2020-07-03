<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false"
             :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()"
             :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
      <el-form-item label="业务用户类型" prop="userType">
        <el-input v-model="dataForm.userType" placeholder="业务用户类型"></el-input>
      </el-form-item>
      <el-form-item label="业务用户id" prop="userId">
        <el-input v-model="dataForm.userId" placeholder="业务用户id"></el-input>
      </el-form-item>
      <el-form-item label="推送平台" prop="platform">
        <el-input v-model="dataForm.platform" placeholder="推送平台"></el-input>
      </el-form-item>
      <el-form-item label="推送目标" prop="receiver">
        <el-input v-model="dataForm.receiver" placeholder="推送目标"></el-input>
      </el-form-item>
      <el-form-item label="消息标题" prop="msgTitle">
        <el-input v-model="dataForm.msgTitle" placeholder="消息标题"></el-input>
      </el-form-item>
      <el-form-item label="消息内容" prop="msgContent">
        <el-input v-model="dataForm.msgContent" placeholder="消息内容"></el-input>
      </el-form-item>
      <el-form-item label="附加字段" prop="extras">
        <el-input v-model="dataForm.extras" placeholder="附加字段"></el-input>
      </el-form-item>
      <el-form-item label="业务参数" prop="params">
        <el-input v-model="dataForm.params" placeholder="业务参数"></el-input>
      </el-form-item>
      <el-form-item label="期望推送时间" prop="pushTime">
        <el-input v-model="dataForm.pushTime" placeholder="期望推送时间"></el-input>
      </el-form-item>
      <el-form-item label="是否已推送" prop="isPushed">
        <el-input v-model="dataForm.isPushed" placeholder="是否已推送"></el-input>
      </el-form-item>
      <el-form-item label="创建时间" prop="createDate">
        <el-input v-model="dataForm.createDate" placeholder="创建时间"></el-input>
      </el-form-item>
      <el-form-item label="更新时间" prop="updateDate">
        <el-input v-model="dataForm.updateDate" placeholder="更新时间"></el-input>
      </el-form-item>
      <el-form-item label="创建者id" prop="creator">
        <el-input v-model="dataForm.creator" placeholder="创建者id"></el-input>
      </el-form-item>
      <el-form-item label="更新者id" prop="updater">
        <el-input v-model="dataForm.updater" placeholder="更新者id"></el-input>
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
                    userType: '',
                    userId: '',
                    platform: '',
                    receiver: '',
                    msgTitle: '',
                    msgContent: '',
                    extras: '',
                    params: '',
                    pushTime: '',
                    isPushed: '',
                    sort: '',
                    createDate: '',
                    updateDate: '',
                    creator: '',
                    updater: '',
                    isDeleted: ''
                },
                dataRule:{
                    userType: [
                        {required: true, message: this.$t('validate.required'), trigger: 'blur'}
                    ],
                    userId: [
                        {required: true, message: this.$t('validate.required'), trigger: 'blur'}
                    ],
                    platform: [
                        {required: true, message: this.$t('validate.required'), trigger: 'blur'}
                    ],
                    receiver: [
                        {required: true, message: this.$t('validate.required'), trigger: 'blur'}
                    ],
                    msgTitle: [
                        {required: true, message: this.$t('validate.required'), trigger: 'blur'}
                    ],
                    msgContent: [
                        {required: true, message: this.$t('validate.required'), trigger: 'blur'}
                    ],
                    extras: [
                        {required: true, message: this.$t('validate.required'), trigger: 'blur'}
                    ],
                    params: [
                        {required: true, message: this.$t('validate.required'), trigger: 'blur'}
                    ],
                    pushTime: [
                        {required: true, message: this.$t('validate.required'), trigger: 'blur'}
                    ],
                    isPushed: [
                        {required: true, message: this.$t('validate.required'), trigger: 'blur'}
                    ],
                    sort: [
                        {required: true, message: this.$t('validate.required'), trigger: 'blur'}
                    ],
                    createDate: [
                        {required: true, message: this.$t('validate.required'), trigger: 'blur'}
                    ],
                    updateDate: [
                        {required: true, message: this.$t('validate.required'), trigger: 'blur'}
                    ],
                    creator: [
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
        computed: {
            // dataRule () {
            //     return {
            //         userType: [
            //             {required: true, message: this.$t('validate.required'), trigger: 'blur'}
            //         ],
            //         userId: [
            //             {required: true, message: this.$t('validate.required'), trigger: 'blur'}
            //         ],
            //         platform: [
            //             {required: true, message: this.$t('validate.required'), trigger: 'blur'}
            //         ],
            //         receiver: [
            //             {required: true, message: this.$t('validate.required'), trigger: 'blur'}
            //         ],
            //         msgTitle: [
            //             {required: true, message: this.$t('validate.required'), trigger: 'blur'}
            //         ],
            //         msgContent: [
            //             {required: true, message: this.$t('validate.required'), trigger: 'blur'}
            //         ],
            //         extras: [
            //             {required: true, message: this.$t('validate.required'), trigger: 'blur'}
            //         ],
            //         params: [
            //             {required: true, message: this.$t('validate.required'), trigger: 'blur'}
            //         ],
            //         pushTime: [
            //             {required: true, message: this.$t('validate.required'), trigger: 'blur'}
            //         ],
            //         isPushed: [
            //             {required: true, message: this.$t('validate.required'), trigger: 'blur'}
            //         ],
            //         sort: [
            //             {required: true, message: this.$t('validate.required'), trigger: 'blur'}
            //         ],
            //         createDate: [
            //             {required: true, message: this.$t('validate.required'), trigger: 'blur'}
            //         ],
            //         updateDate: [
            //             {required: true, message: this.$t('validate.required'), trigger: 'blur'}
            //         ],
            //         creator: [
            //             {required: true, message: this.$t('validate.required'), trigger: 'blur'}
            //         ],
            //         updater: [
            //             {required: true, message: this.$t('validate.required'), trigger: 'blur'}
            //         ],
            //         isDeleted: [
            //             {required: true, message: this.$t('validate.required'), trigger: 'blur'}
            //         ]
            //     }
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
                })
            },
            // 获取信息
            getInfo () {
                this.$http.get(`/message/pushmessage/${this.dataForm.id}`).then(({data: res}) => {
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
                    this.$http[!this.dataForm.id ? 'post' : 'put']('/message/pushmessage/', this.dataForm).then(({data: res}) => {
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
