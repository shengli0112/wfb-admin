<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-advertising__adv}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.apName" placeholder="广告位名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('advertising:adv:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('advertising:adv:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="id" label="id" header-align="center" align="center"></el-table-column>
        <el-table-column prop="apName" label="广告位名称" header-align="center" align="center"></el-table-column>
        <el-table-column prop="title" label="描述" header-align="center" align="center"></el-table-column>
        <el-table-column prop="url" label="链接地址" header-align="center" align="center"></el-table-column>
        <el-table-column prop="imageUrl" label="内容图片URL" header-align="center" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.imageUrl" class="identify-card">
          </template>
        </el-table-column>
        <el-table-column prop="clickNum" label="广告点击率" header-align="center" align="center"></el-table-column>
        <el-table-column prop="sort" label="拥有广告数" header-align="center" align="center"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('advertising:adv:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('advertising:adv:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
import AddOrUpdate from './adv-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/advertising/adv/page',
        getDataListIsPage: true,
        deleteURL: '/advertising/adv',
        deleteIsBatch: true
      },
      dataForm: {
        apName: ''
      }
    }
  },
  components: {
    AddOrUpdate
  }
}
</script>
<style scoped>
  .identify-card {
    width: 40px;
    height: 40px;
    margin-right: 10px;
  }
</style>
