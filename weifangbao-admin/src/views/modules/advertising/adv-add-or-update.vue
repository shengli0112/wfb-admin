<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false"
             :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()"
             :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
      <el-form-item label="广告位" prop="apId">
        <el-select v-model="dataForm.apId" placeholder="请选择">
          <el-option
              v-for="item in advOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="内容描述" prop="title">
        <el-input v-model="dataForm.title" placeholder="广告内容描述"></el-input>
      </el-form-item>
      <el-form-item label="链接地址" prop="url">
        <!--        <el-input v-model="dataForm.url" placeholder="链接地址"></el-input>-->
        <el-select style="margin-right: 10px" v-model="url" clearable placeholder="请选择链接地址">
          <el-option v-for="item in adv_url" :key="item.id" :label="item.dictName" :value="item.dictValue"></el-option>
        </el-select>
        <div style="display: inline-block;width: 66.5%">
          <el-input
              placeholder="请输入参数，例：id=1"
              v-model="list"
              clearable>
          </el-input>
        </div>
      </el-form-item>
      <el-form-item label="内容图片" prop="imageUrl">
        <el-upload :action="uploadUrl" :on-success="handleSuccess" :show-file-list="false" class="post-uploader">
          <img :src="dataForm.imageUrl" class="identify-card" v-if="dataForm.imageUrl">
          <i class="el-icon-plus post-uploader-icon" v-else></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="点击率" prop="clickNum">
        <el-input v-model="dataForm.clickNum" placeholder="广告点击率"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model="dataForm.sort" placeholder="排序字段"></el-input>
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
        uploadUrl: '',
        dataForm: {
          id: '',
          apId: '',
          title: '',
          url: '',
          imageUrl: '',
          clickNum: '',
          sort: '',
          creator: '',
          createDate: '',
          updater: '',
          updateDate: '',
          isDeleted: '',
        },
        advOptions: [{
          id: '',
          name: ''
        }],
        adv_url: [],
        get_url: [],
        url: '',
        list: '',
        value: ''
      }
    },
    computed: {
      dataRule() {
        return {
          apId: [
            {required: true, message: this.$t('validate.required'), trigger: 'blur'}
          ],
          title: [
            {required: true, message: this.$t('validate.required'), trigger: 'blur'}
          ],
          imageUrl: [
            {required: true, message: this.$t('validate.required'), trigger: 'blur'}
          ],
          clickNum: [
            {required: true, message: this.$t('validate.required'), trigger: 'blur'}
          ],
          sort: [
            {required: true, message: this.$t('validate.required'), trigger: 'blur'}
          ],
          creator: [
            {required: true, message: this.$t('validate.required'), trigger: 'blur'}
          ],
          createDate: [
            {required: true, message: this.$t('validate.required'), trigger: 'blur'}
          ],
          updater: [
            {required: true, message: this.$t('validate.required'), trigger: 'blur'}
          ],
          updateDate: [
            {required: true, message: this.$t('validate.required'), trigger: 'blur'}
          ],
          isDeleted: [
            {required: true, message: this.$t('validate.required'), trigger: 'blur'}
          ]
        }
      }
    },
    created() {
      this.$http.get('common/dictList?pid=1201673866284371970').then(({data: res}) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.adv_url = res.data
      }).catch(() => {
      })  //获取链接
    },
    methods: {
      init() {
        this.visible = true
        this.uploadUrl = `${window.SITE_CONFIG['apiURL']}/sys/oss/upload`
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.getInfo()
          }
          this.getAdList()
        })
      },
      // 获取信息
      getInfo() {
        this.$http.get(`/advertising/adv/${this.dataForm.id}`).then(({data: res}) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.dataForm = {
            ...this.dataForm,
            ...res.data
          }
          this.get_url = this.dataForm.url.split("?")
          this.url = this.get_url[0]
          this.list = this.get_url[1]
        }).catch(() => {
        })
      },
      getAdList() {
        this.$http.get(`/advertising/advposition/page?page=1&&limit=100`).then(({data: res}) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.advOptions = res.data.list;
        })
      },
      handleSuccess(res, file) {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm.imageUrl = res.data.src
      },
      // 表单提交
      dataFormSubmitHandle: debounce(function () {
        if (this.list == undefined) {
          this.list = ''
        }
        if (this.list != '') {
          this.dataForm.url = this.url + "?" + this.list
        } else {
          this.dataForm.url = this.url + this.list
        }
        this.$refs['dataForm'].validate((valid) => {
          if (!valid) {
            return false
          }
          this.$http[!this.dataForm.id ? 'post' : 'put']('/advertising/adv/', this.dataForm).then(({data: res}) => {
            if (res.code !== 0) {
              return this.$message.error(res.msg)
            }
            this.url = ''
            this.list = ''
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
  .identify-card {
    width: 100px;
    height: 100px;
    margin-right: 10px;
  }
</style>
