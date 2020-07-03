<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false"
             :close-on-press-escape="false" width="40%">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()"
             label-width="120px">
      <el-form-item prop="appType" label="APP类型" :required="true">
        <el-select v-model="dataForm.appType" clearable>
          <el-option v-for="item in typeList" :value="item.key" :label="item.value" :key="item.key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="versionNumber" label="展示版本号" :required="true">
        <el-input v-model="dataForm.versionNumber" placeholder="如： 1.2.3"></el-input>
      </el-form-item>

      <el-form-item prop="versionInfo" label="版本信息">
        <el-input type="textarea" v-model="dataForm.versionInfo" placeholder="如：修复已知Bug"></el-input>
      </el-form-item>

      <el-form-item label="上传App" prop="url" :required="true">
        <el-upload :action="uploadUrl" :show-file-list="false" :on-progress="onProgress" :before-upload="beforeupload" :on-success="onUploadSuccess"
                   class="upload-wrap">
          <el-input v-model="dataForm.url" placeholder="点击上传"></el-input>
        </el-upload>
        <el-progress :percentage="percent" v-if="percent" :status="status" style="margin-top: 10px"></el-progress>
      </el-form-item>
      <el-form-item prop="isForceUpdate" label="是否强制更新">
        <el-switch v-model="dataForm.isForceUpdate" active-value="1" inactive-value="0"></el-switch>
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
    import Cookies from 'js-cookie'

    export default {
        data () {
            return {
                visible: false,
                uploadUrl: '',
                typeList: [{key: '1', value: '用户Android端'}, {key: '2', value: '商家Android端'}],
                dataForm: {
                    appType: '',
                    versionNumber: '',
                    versionInfo: '',
                    url: '',
                    isForceUpdate: '0'
                },
                percent: 0,
                status:'',
                inderval: ()=>{}
            }
        },
        computed: {},

        methods: {
            init () {
                this.visible = true
                this.uploadUrl = `${window.SITE_CONFIG['apiURL']}sys/oss/upload?token=${Cookies.get('token')}`

                this.$nextTick(() => {
                    this.$refs['dataForm'].resetFields()
                    this.percent = 0;
                    if (this.dataForm.id) {
                        this.getInfo()
                    }
                })
            },
            // 获取信息
            getInfo () {
                this.$http.get(`/appversion/${this.dataForm.id}`).then(({data: res}) => {
                    if (res.code !== 0) {
                        return this.$message.error(res.msg)
                    }
                    this.dataForm = res.data
                    this.dataForm.isForceUpdate = this.dataForm.isForceUpdate == 0 ? '0' : '1'

                }).catch(() => {
                })
            },
            beforeupload(e) {              
            },
            // onProgress
            onProgress (e) {
              if (e.percent >= 100) {
                let index = 0
                this.inderval = setInterval(()=>{
                  index += (100 - index)/10
                  this.percent = Math.floor(index)
                },500)
              }   
            },
            onUploadSuccess (res, file) {
                clearInterval(this.inderval)
                if (!res) {
                    return this.$message.error('网络异常请稍后再试')
                }
                if (res.code !== 0) {
                    return this.$message.error(res.msg)
                }
                this.percent = 100
                this.status = 'success'
                this.dataForm.url = res.data.src
            },
            // 表单提交
            dataFormSubmitHandle: debounce(function () {
              console.log(1111);
              
                console.log(this.dataForm)
                this.$refs['dataForm'].validate((valid) => {
                    if (!valid) {
                        return false
                    }
                    this.$http[!this.dataForm.id ? 'post' : 'put'](
                        '/appversion',
                        this.dataForm,
                        {headers: {'content-type': 'application/json'}}
                    ).then(({data: res}) => {
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
                    }).catch(() => {
                    })
                })
            }, 1000, {'leading': true, 'trailing': false}),

        }
    }
</script>

<style>
  .upload-wrap .el-upload {
    display: block;
  }
</style>
