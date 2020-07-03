<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-fastNavigation__fastnavigation}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.name" placeholder="导航名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('fastNavigation:fastnavigation:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('fastNavigation:fastnavigation:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="name" label="导航名称" header-align="center" align="center"></el-table-column>
        <el-table-column prop="icon" label="导航图标" header-align="center" align="center">
          <template slot-scope="scope">
          <img :src="scope.row.icon" class="identify-card">
          </template>
        </el-table-column>
        <el-table-column prop="type" label="终端类型" header-align="center" align="center">
          <template slot-scope="scope">
            {{scope.row.type?'手机端':'PC端'}}
          </template>
        </el-table-column>
        <el-table-column prop="pageUrl" label="页面链接" header-align="center" align="center"></el-table-column>
        <!--<el-table-column prop="positionId" label="所属导航模块" header-align="center" align="center"></el-table-column>-->
        <el-table-column prop="showFlag" label="是否显示" header-align="center" align="center">
          <template slot-scope="scope">
            {{scope.row.showFlag?'是':'否'}}
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" header-align="center" align="center"></el-table-column>
        <el-table-column prop="createDate" label="创建时间" header-align="center" align="center"></el-table-column>
        <el-table-column prop="updateDate" label="更新时间" header-align="center" align="center"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button  type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button  type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
import AddOrUpdate from './fastnavigation-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/fastNavigation/fastnavigation/page',
        getDataListIsPage: true,
        deleteURL: '/fastNavigation/fastnavigation',
        deleteIsBatch: true
      },
      dataForm: {
        id: '',
        name:'',
        icon:''
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
