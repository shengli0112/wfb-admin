<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-seckill__seckill}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.actiTitle" placeholder="活动标题" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('seckill:seckill:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('seckill:seckill:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="id" label="ID" header-align="center" align="center"></el-table-column>
        <el-table-column prop="storeName" label="商家名称" header-align="center" align="center"></el-table-column>
        <el-table-column prop="actiTitle" label="活动标题" header-align="center" align="center"></el-table-column>
        <el-table-column prop="actiBeginTime" label="活动开始日期" header-align="center" align="center"></el-table-column>
        <el-table-column prop="actiEndTime" label="活动结束日期" header-align="center" align="center"></el-table-column>
        <el-table-column prop="reviewStatus" label="审核状态" header-align="center" align="center">
          <template slot-scope="scope"> {{getStatusStr(scope.row.reviewStatus)}}</template>
        </el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('seckill:seckill:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('seckill:seckill:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './seckill-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/seckill/seckill/page',
        getDataListIsPage: true,
        deleteURL: '/seckill/seckill',
        deleteIsBatch: true
      },
      dataForm: {
        id: ''
      }
    }
  },
  components: {
    AddOrUpdate
  },
  methods: {
    getStatusStr: function(status){
      // 审核状态 0待审核 1通过，2拒绝
      if(status == 0){
        return '待审核';
      }
      if(status == 1){
        return '通过';
      }
      if(status == 2){
        return '拒绝';
      }
      return status;
    }
  }
}
</script>
