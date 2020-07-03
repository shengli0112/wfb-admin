<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-demo__news">
      <el-button type="primary" @click="addOrUpdateHandle()" style="margin-bottom:20px;">添加等级</el-button>
      <el-table
        v-loading="dataListLoading"
        :data="dataList"
        border
        @selection-change="dataListSelectionChangeHandle"
        @sort-change="dataListSortChangeHandle"
        style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="levelName" label="等级名称" header-align="center" align="center"></el-table-column>
        <el-table-column prop="upgrade" label="升级条件" header-align="center" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.upgrade == 1">累计积分</span>
            <span v-if="scope.row.upgrade == 2">消费额度</span>
            <span v-if="scope.row.upgrade == 3">同时满足</span>
          </template>
        </el-table-column>
        <el-table-column prop="goodsDiscount" label="折扣率(%)" header-align="center" align="center"></el-table-column>
        <el-table-column
          :label="$t('handle')"
          fixed="right"
          header-align="center"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small"  @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
        @current-change="pageCurrentChangeHandle"
      ></el-pagination>
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './level-detail'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/member/level/page',
        getDataListIsPage: true,
        deleteURL: '/member/level',
        deleteIsBatch: true
      }
    }
  },
  watch: {
  },
  components: {
    AddOrUpdate
  }
}
</script>

<style scoped>
</style>
