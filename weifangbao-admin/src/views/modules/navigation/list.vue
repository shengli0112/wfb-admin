<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-demo__news">
      <el-form :inline="true">
        <el-form-item>
          <el-button type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
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
        <el-table-column prop="title" :label="$t('news.title')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="typeName" :label="$t('help.type')" header-align="center" align="center" width="180"></el-table-column>
        <el-table-column prop="sort" :label="$t('menu.sort')" header-align="center" align="center" width="180"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
            <el-button type="text" size="small" @click="previewHandle(scope.row.id)">{{ $t('preview') }}</el-button>
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
import AddOrUpdate from './help-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/helpcenter/content/page',
        getDataListIsPage: true,
        deleteURL: '/helpcenter/content',
        deleteIsBatch: true
      }
    }
  },
  methods: {
    previewHandle () {
    }
  },
  watch: {
  },
  components: {
    AddOrUpdate
  }
}
</script>
