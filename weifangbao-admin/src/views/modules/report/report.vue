<template>
  <div>
    <el-card shadow="never" class="aui-card--fill">
      <el-form class="dataForm" :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.propertyName" placeholder="楼盘名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.reportMobile" placeholder="报备人手机号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.mobile" placeholder="客户手机号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="dataForm.status" filterable clearable placeholder="请选择">
            <el-option
                v-for="item in status"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search()">{{ $t('query') }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="never" class="aui-card--fill">
      <div class="mod-report__report}">
        <el-table v-loading="dataListLoading" :data="dataList" border
                  @selection-change="dataListSelectionChangeHandle"
                  style="width: 100%;">
          <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
          <el-table-column prop="propertyName" label="楼盘名称" header-align="center" align="center"></el-table-column>
          <el-table-column prop="nickname" label="报备人" header-align="center" align="center"></el-table-column>
          <el-table-column prop="reportMobile" label="报备人手机号" header-align="center" align="center"></el-table-column>
          <el-table-column prop="customerName" label="客户" header-align="center" align="center"></el-table-column>
          <el-table-column prop="mobile" label="客户手机号" header-align="center" align="center"></el-table-column>
          <el-table-column prop="createDate" label="报备时间" header-align="center" align="center"></el-table-column>
          <el-table-column prop="status" label="状态" header-align="center"
                           align="center">
            <template slot-scope="scope">
              <el-tag
                  :type="scope.row.status == 1 ? 'success' : 'primary'||scope.row.status == 2 ? 'warning' : 'primary'||scope.row.status == 3 ? 'warning' : 'primary'||scope.row.status == 4 ? 'success' : 'primary'||scope.row.status == 5 ? 'warning' : 'primary'"
                  close-transition>{{scope.row.statusName}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
            <template slot-scope="scope">
              <el-button v-if="$hasPermission('report:report:update')" type="text" size="small"
                         @click="addOrUpdateHandle(scope.row.id)">查看/编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
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
      </div>
    </el-card>
  </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import AddOrUpdate from './report-add-or-update'

    export default {
        mixins: [mixinViewModule],
        data() {
            return {
                mixinViewModuleOptions: {
                    getDataListURL: '/report/report/page',
                    getDataListIsPage: true,
                    exportURL: '/report/report/export',
                    deleteURL: '/report/report',
                    deleteIsBatch: true
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
                dataForm: {
                    propertyName: '',
                    reportMobile: '',
                    mobile: '',
                    status: ''
                },
                TableData: []
            }
        },
        methods: {

        },
        components: {
            AddOrUpdate
        }
    }
</script>
<style scoped>
  .dataForm {
    height: 40px;
  }
</style>
