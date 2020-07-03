<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-advertising__advposition}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.id" placeholder="id" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('advertising:advposition:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="id" label="id" header-align="center" align="center"></el-table-column>
        <el-table-column prop="name" label="名称" header-align="center" align="center"></el-table-column>
        <el-table-column prop="intro" label="简介" header-align="center" align="center"></el-table-column>
        <el-table-column prop="displayMode" label="展示方式" header-align="center" align="center"></el-table-column>
        <el-table-column prop="height" label="高度(px)" header-align="center" align="center"></el-table-column>
        <el-table-column prop="width" label="宽度(px)" header-align="center" align="center"></el-table-column>
        <el-table-column prop="price" label="单价" header-align="center" align="center"></el-table-column>
        <el-table-column prop="clickNum" label="点击率" header-align="center" align="center"></el-table-column>
        <el-table-column prop="displayTerminal" label="显示终端" header-align="center" align="center"></el-table-column>
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
import AddOrUpdate from './advposition-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/advertising/advposition/page',
        getDataListIsPage: true,
        deleteURL: '/advertising/advposition',
        deleteIsBatch: true
      },
      dataForm: {
        id: ''
      }
    }
  },
  components: {
    AddOrUpdate
  }
}
</script>
