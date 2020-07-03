<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-sys__menu">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-button type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}
          </el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border style="width: 100%;">
        <el-table-column prop="id" label="ID" header-align="center" align="center"></el-table-column>
        <el-table-column label="APP类型" header-align="center" align="center">
          <template slot-scope="scope">
            {{ getAppTypeName(scope.row.appType) }}
          </template>
        </el-table-column>
        <el-table-column prop="versionNumber" label="展示版本号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="versionInfo" label="版本信息" header-align="center" align="left"></el-table-column>
        <el-table-column prop="isForceUpdate" label="是否强制更新" header-align="center" align="center">
          <template slot-scope="scope">
            {{ scope.row.isForceUpdate==1?'是':'否'}}
          </template>
        </el-table-column>
        <el-table-column prop="url" label="url" header-align="center" align="left"></el-table-column>
        <el-table-column prop="createDate" label="发布时间" header-align="center" align="center"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
  </el-card>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import AddOrUpdate from './add-or-update'

    export default {
        components: {
            AddOrUpdate
        },
        mixins: [mixinViewModule],

        data () {
            return {
                mixinViewModuleOptions: {
                    getDataListURL: '/appversion/page',
                    deleteURL: '/appversion',
                    deleteIsBatch: true,
                    getDataListIsPage: true
                }
            }
        },
        methods: {
            // 计算属性的 getter
            getAppTypeName: function (type) {
                switch (type) {
                    case 1: return '用户Android端'
                    case 2: return '商家Android端'
                    default: return ''
                }
            }
        }
    }
</script>
