<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-sys__dict">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.dictName" :placeholder="$t('dict.dictName')" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="dataForm.pid === '0'">
          <el-input v-model="dataForm.dictType" :placeholder="$t('dict.dictType')" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="dataForm.pid !== '0'">
          <el-input v-model="dataForm.dictValue" :placeholder="$t('dict.dictValue')" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('sys:dict:save')" type="primary" @click="addOrUpdateHandle()">{{
            $t('add') }}
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('sys:dict:delete')" type="danger" @click="deleteHandle()">{{
            $t('deleteBatch') }}
          </el-button>
        </el-form-item>
      </el-form>
      <el-table
          v-loading="dataListLoading"
          :data="dataList"
          border
          @selection-change="dataListSelectionChangeHandle"
          @sort-change="dataListSortChangeHandle"
          style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="dictName" :label="$t('dict.dictName')" header-align="center"
                         align="center"></el-table-column>
        <el-table-column prop="dictType" :label="$t('dict.dictType')" header-align="center" align="center">
          <template slot-scope="scope">
            <span v-if="dataForm.pid !== '0'">{{ scope.row.dictType }}</span>
            <el-button v-else type="text" @click="childHandle(scope.row)">{{ scope.row.dictType }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column v-if="dataForm.pid !== '0'" prop="dictValue" label="字典值" header-align="center"
                         align="center"></el-table-column>
        <el-table-column prop="sort" :label="$t('dict.sort')" sortable="custom" header-align="center"
                         align="center"></el-table-column>
        <el-table-column prop="remark" :label="$t('dict.remark')" header-align="center"
                         align="center"></el-table-column>
        <el-table-column prop="createDate" :label="$t('dict.createDate')" sortable="custom"
                         header-align="center" align="center" width="180"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('sys:dict:update')" type="text" size="small"
                       @click="addOrUpdateHandle(scope.row)">{{ $t('update') }}
            </el-button>
            <el-button v-if="$hasPermission('sys:dict:delete')" type="text" size="small"
                       @click="deleteHandle(scope.row.id)">{{ $t('delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          v-if="dataForm.pid === '0'"
          :current-page="page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="limit"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="pageSizeChangeHandle"
          @current-change="pageCurrentChangeHandle">
      </el-pagination>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
      <el-dialog title="类型数据" :visible.sync="dialogTableVisible" width="70%">
        <el-button class="addBtn" v-if="$hasPermission('sys:dict:save')" type="primary" @click="addOrUpdateChildren()">
          {{
          $t('add') }}
        </el-button>
        <el-table
            :data="childrenList"
            border
            @selection-change="dataListSelectionChangeHandle"
            @sort-change="dataListSortChangeHandle"
            style="width: 100%;">
          <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
          <el-table-column prop="dictName" :label="$t('dict.dictName')" header-align="center"
                           align="center"></el-table-column>
          <el-table-column prop="dictType" :label="$t('dict.dictType')" header-align="center" align="center">
          </el-table-column>
          <el-table-column prop="dictValue" label="字典值" header-align="center"
                           align="center"></el-table-column>
          <el-table-column prop="sort" :label="$t('dict.sort')" sortable="custom" header-align="center"
                           align="center"></el-table-column>
          <el-table-column prop="remark" :label="$t('dict.remark')" header-align="center"
                           align="center"></el-table-column>
          <el-table-column prop="createDate" :label="$t('dict.createDate')" sortable="custom"
                           header-align="center" align="center" width="180"></el-table-column>
          <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
            <template slot-scope="scope">
              <el-button v-if="$hasPermission('sys:dict:update')" type="text" size="small"
                         @click="addOrUpdateChildren(scope.row)">{{ $t('update') }}
              </el-button>
              <el-button v-if="$hasPermission('sys:dict:delete')" type="text" size="small"
                         @click="deleteChildren(scope.row)">{{ $t('delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
      <el-dialog :visible.sync="childrenVisible" :title="!dataForm.id ? $t('add') : $t('update')"
                 :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form :model="childrenForm" :rules="dataRule" ref="childrenForm" @keyup.enter.native="dataFormSubmitHandle()"
                 label-width="120px">
          <el-form-item prop="dictName" :label="$t('dict.dictName')">
            <el-input v-model="childrenForm.dictName" :placeholder="$t('dict.dictName')"></el-input>
          </el-form-item>
          <el-form-item prop="dictValue" :label="$t('dict.dictValue')">
            <el-input v-model="childrenForm.dictValue" :placeholder="$t('dict.dictValue')"></el-input>
          </el-form-item>
          <el-form-item prop="sort" :label="$t('dict.sort')">
            <el-input-number v-model="childrenForm.sort" controls-position="right" :min="0"
                             :label="$t('dict.sort')"></el-input-number>
          </el-form-item>
          <el-form-item prop="remark" :label="$t('dict.remark')">
            <el-input v-model="childrenForm.remark" :placeholder="$t('dict.remark')"></el-input>
          </el-form-item>
        </el-form>
        <template slot="footer">
          <el-button @click="closeChildren()">{{ $t('cancel') }}</el-button>
          <el-button type="primary" @click="childrenFormSubmitHandle()">{{ $t('confirm') }}</el-button>
        </template>
      </el-dialog>
    </div>
  </el-card>
</template>

<script>
  import mixinViewModule from '@/mixins/view-module'
  import AddOrUpdate from './dict-add-or-update'
  import {moduleRoutes} from '@/router'
  import debounce from "lodash/debounce";

  export default {
    mixins: [mixinViewModule],
    data() {
      return {
        mixinViewModuleOptions: {
          activatedIsNeed: false,
          getDataListURL: '/sys/dict/page',
          getDataListIsPage: true,
          deleteURL: '/sys/dict',
          deleteIsBatch: true
        },
        dataForm: {
          pid: '0',
          dictName: '',
          dictType: '',
          dictValue: ''
        },
        childrenForm: {
          id: '',
          pid: '',
          dictName: '',
          dictType: '',
          dictValue: '',
          sort: 0,
          remark: ''
        },
        dataRule: {
          dictName: [
            {required: true, message: this.$t('validate.required'), trigger: 'blur'}
          ],
          dictType: [
            {required: true, message: this.$t('validate.required'), trigger: 'blur'}
          ],
          code: [
            {required: true, message: this.$t('validate.required'), trigger: 'blur'}
          ],
          dictValue: [
            {required: true, message: this.$t('validate.required'), trigger: 'blur'}
          ],
          sort: [
            {required: true, message: this.$t('validate.required'), trigger: 'blur'}
          ]
        },
        childrenVisible: false,
        dialogTableVisible: false,
        childrenList: [],
        parentData: []
      }
    },
    components: {
      AddOrUpdate
    },
    activated() {
      // 通过路由参数pid, 控制列表请求操作
      this.dataForm.pid = this.$route.params.pid || '0'
      if (this.dataForm.pid !== '0') {
        this.mixinViewModuleOptions.getDataListURL = '/sys/dict/list'
        this.mixinViewModuleOptions.getDataListIsPage = false
        this.dataForm.dictType = this.$route.params.type || ''
      }
      this.getDataList()
    },
    methods: {
      // 子级
      childHandle(row) {
        this.parentData = row
        this.dialogTableVisible = true
        this.$http.get('common/dictList?pid=' + row.id).then(({data: res}) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.childrenForm.pid = row.id
          this.childrenForm.dictType = row.dictType
          this.childrenList = res.data
        }).catch(() => {
        })
      },
      // 新增 / 修改
      addOrUpdateChildren(row = {}) {
        this.childrenVisible = true
        this.$nextTick(() => {
          this.childrenList.id = row.id
          this.childrenList.pid = this.childrenList.pid
          this.childrenList.dictType = row.dictType || this.childrenList.dictType || ''
          this.init()
        })
      },
      closeChildren() {
        this.childrenVisible = false
        this.childrenForm = {}
      },
      init() {
        this.childrenVisible = true
        this.$nextTick(() => {
          if (this.childrenList.id) {
            this.getInfo()
          }
        })
      },
      getInfo() {
        this.$http.get(`/sys/dict/${this.childrenList.id}`).then(({data: res}) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.childrenForm = {
            ...this.childrenForm,
            ...res.data
          }
        }).catch(() => {
        })
      },
      // 删除子级
      deleteChildren(row) {
        this.$confirm('确定进行[删除]操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete(`/sys/dict${true ? '' : '/' + row.id}`, true ? {'data': row.id ? [row.id] : this.dataListSelections.map(item => item[this.mixinViewModuleOptions.deleteIsBatchKey])} : {}
          ).then(({data: res}) => {
            if (res.code !== 0) {
              return this.$message.error(res.msg)
            }
            this.$message({
              message: this.$t('prompt.success'),
              type: 'success',
              duration: 800,
              onClose: () => {
                this.childHandle(this.parentData)
              }
            })
          }).catch(() => {
          })
        }).catch(() => {
        });
      },
      // 子级表单提交
      childrenFormSubmitHandle: debounce(function () {
        this.$refs['childrenForm'].validate((valid) => {
          if (!valid) {
            return false
          }
          this.$http[!this.childrenForm.id ? 'post' : 'put']('/sys/dict', this.childrenForm).then(({data: res}) => {
            if (res.code !== 0) {
              return this.$message.error(res.msg)
            }
            this.childHandle(this.parentData)
            this.childrenForm = {}
            // this.childrenList.push(this.childrenForm)
            this.$message({
              message: this.$t('prompt.success'),
              type: 'success',
              duration: 800,
              onClose: () => {
                this.childrenVisible = false
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
  .addBtn {
    margin: -30px 0 10px;
  }
</style>
