<template>
  <el-card class="aui-card--fill" shadow="never">
    <div class="mod-sys__menu">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-button @click="addOrUpdateHandle()" type="primary">{{ $t('add') }}
          </el-button>
        </el-form-item>
      </el-form>
      <el-table :data="dataList" border style="width: 100%;" v-loading="dataListLoading">
        <table-tree-column :label="$t('menu.name')" header-align="center" prop="name"></table-tree-column>
        <el-table-column :label="$t('menu.sort')" align="center" header-align="center" prop="sort"></el-table-column>
        <el-table-column align="center" header-align="center" label="链接" prop="id">
          <template slot-scope="scope">
            <el-link :href="getPreviewUrl(scope.row.id)" target="_blank" type="primary">{{getPreviewUrl(scope.row.id)}}</el-link>
          </template>
        </el-table-column>
        <el-table-column :label="$t('handle')" align="center" fixed="right" header-align="center" width="150">
          <template slot-scope="scope">
<!--            <el-button @click="preview(scope.row.id)" size="small" type="text">{{ $t('preview') }}</el-button>-->
            <el-button @click="addOrUpdateHandle(scope.row.id)" size="small" type="text">{{ $t('update') }}</el-button>
            <el-button @click="deleteHandle(scope.row.id)" size="small" type="text">{{ $t('delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update @refreshDataList="getDataList" ref="addOrUpdate" v-if="addOrUpdateVisible"></add-or-update>
    </div>
  </el-card>
</template>

<script>
  import mixinViewModule from '@/mixins/view-module'
  import TableTreeColumn from '@/components/table-tree-column'
  import AddOrUpdate from './class-add-or-update'

  export default {
    mixins: [mixinViewModule],
    data(){
      return {
        mixinViewModuleOptions: {
          getDataListURL: SITE_CONFIG['OPEN_API_HOME'] + 'sys/articleclass/all',
          deleteURL: SITE_CONFIG['OPEN_API_HOME'] + 'sys/articleclass',
          deleteIsBatch: true
        }
      }
    },
    components: {
      TableTreeColumn,
      AddOrUpdate
    },
    methods: {
      getPreviewUrl(id){
        let url = SITE_CONFIG["OPEN_H5_HOME"] + "/article_list?id=" + id
        return url;
      },
      preview(id){
        let preview = '<div class="photoImg"><iframe class="content" src=' + this.getPreviewUrl(id) + '></iframe></div>';
        this.$alert(preview, {
          dangerouslyUseHTMLString: true
        });
      }
    }
  }
</script>
<style >
  /*.photoImg{*/
  /*  background-image  :url('./../imgs/Phone4.png');*/
  /*  background-size   :492px 100%;*/
  /*  background-repeat :no-repeat;*/
  /*  height            :812px;*/
  /*  margin-top        :-54px;*/
  /*  margin-left       :143px;*/
  /*}*/

  /*.el-message-box{*/
  /*  width            :700px;*/
  /*  height           :750px;*/
  /*  background-color :transparent !important;*/
  /*  border           :0;*/
  /*  box-shadow       :none;*/
  /*  margin-right     :100px;*/
  /*}*/

  /*.content{*/
  /*  width  :326px;*/
  /*  height :513px;*/
  /*  margin :177px 0 0 79px;*/
  /*  border :0;*/
  /*}*/

  /*.el-message-box__btns{*/
  /*  display :none;*/
  /*}*/

  /*.el-message-box__headerbtn{*/
  /*  top       :4px;*/
  /*  right     :-3px;*/
  /*  font-size :35px;*/
  /*  z-index   :1000;*/
  /*}*/
</style>