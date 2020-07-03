<template>
  <el-card class="aui-card--fill" shadow="never">
    <div class="mod-demo__news">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input :placeholder="$t('news.title')" clearable v-model="dataForm.title"></el-input>
        </el-form-item>
        <el-form-item label="文章分类：">
          <el-cascader :options="options" @change="handleChange" clearable></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <div class="lay-btn">
          <el-form-item>
            <el-button @click="deleteHandle()" type="danger">{{ $t('deleteBatch') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="addOrUpdateHandle()" type="primary">{{ $t('add') }}</el-button>
          </el-form-item>
        </div>
      </el-form>
      <el-table :data="dataList" @selection-change="dataListSelectionChangeHandle"
                @sort-change="dataListSortChangeHandle" border=""
                style="width: 100%;" v-loading="dataListLoading">
        <el-table-column align="center" header-align="center" type="selection" width="50"></el-table-column>
        <el-table-column :label="$t('news.title')" align="center" header-align="center" prop="title"></el-table-column>
        <el-table-column :label="$t('help.type')" align="center" header-align="center" prop="finalClassName"
                         width="180"></el-table-column>
        <el-table-column align="center" header-align="center" label="点击量/评论量" prop="createDate">
          <template slot-scope="scope">{{scope.row.click}}/{{scope.row.commentCount}}</template>
        </el-table-column>
        <el-table-column :label="$t('sms.status')" align="center" header-align="center"
                         prop="statusValue"></el-table-column>
        <el-table-column :label="$t('news.pubDate')" align="center" header-align="center"
                         prop="publicTime"></el-table-column>
        <el-table-column :label="$t('dept.sort')" align="center" header-align="center" prop="sort"></el-table-column>
        <el-table-column :label="$t('handle')" align="center" fixed="right" header-align="center" width="150">
          <template slot-scope="scope">
            <el-button @click="preview(scope.row.id)" size="small" type="text">{{ $t('preview') }}</el-button>
            <el-button @click="addOrUpdateHandle(scope.row.id)" size="small" type="text">{{ $t('update') }}</el-button>
            <el-button @click="deleteHandle(scope.row.id)" size="small" type="text">{{ $t('delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          :current-page="page"
          :page-size="limit"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          @current-change="pageCurrentChangeHandle"
          @size-change="pageSizeChangeHandle"
          layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update @refreshDataList="getDataList" ref="addOrUpdate" v-if="addOrUpdateVisible"></add-or-update>
    </div>
  </el-card>
</template>

<script>
  import mixinViewModule from "@/mixins/view-module";
  import AddOrUpdate from "./article-add-or-update";

  export default {
    mixins: [mixinViewModule],
    data() {
      return {
        url: '',
        mixinViewModuleOptions: {
          getDataListURL: window.SITE_CONFIG['OPEN_API_HOME'] + "sys/article/page",
          getDataListIsPage: true,
          deleteURL:  window.SITE_CONFIG['OPEN_API_HOME'] + "sys/article",
          deleteIsBatch: true
        },
        /* dataList: [
                    {
                      'className': 'string',
                      'click': 0,
                      'commentCount': 0,
                      'id': 0,
                      'publicTime': 'string',
                      'sort': 0,
                      'status': 0,
                      'title': 'string'
                    }
                  ], */
        options: [],
        dataForm: {
          title: "",
          startDate: "",
          endDate: "",
          classId: ''
        }
      };
    },
    components: {
      AddOrUpdate
    },
    activated() {
      this.getCates();
    },
    methods: {
      preview(id) {
        var url = SITE_CONFIG["OPEN_H5_HOME"] + "/article_detail?id=" + id
        const preview = '<div class="photoImg"><iframe class="content" src=' + url + '></iframe></div>';
        this.$alert(preview, {
          dangerouslyUseHTMLString: true
        });
      },
      handleChange(data) {
        this.dataForm.classId = data[1]
        this.getDataList()
      },
      getCates() {
        this.$http({
          url:  window.SITE_CONFIG['OPEN_API_HOME'] + "sys/articleclass/all",
          method: "get"
        }).then(({data}) => {
          let temp = data.data;
          // 删除最后一层多余的children
          for (let i = 0; i < temp.length; i++) {
            temp[i].label = temp[i].name
            temp[i].value = temp[i].id
            for (let j = 0; j < temp[i].children.length; j++) {
              temp[i].children[j].label = temp[i].children[j].name
              temp[i].children[j].value = temp[i].children[j].id
              delete temp[i].children[j]["children"];
            }
          }
          console.log(temp);
          this.options = temp;
        });
      }
    }
  };
</script>
<style>
  .lay-btn {
    display: flex;
    flex-direction: row-reverse;
  }

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

  /*::-webkit-scrollbar{*/
  /*  width :12px;*/
  /*}*/

  /*!*滚动槽*!*/
  /*::-webkit-scrollbar-track{*/
  /*  -webkit-box-shadow :inset 0 0 6px rgba(0, 0, 0, 0.3);*/
  /*  border-radius      :10px;*/
  /*}*/

  /*!* 滚动条滑块 *!*/
  /*::-webkit-scrollbar-thumb{*/
  /*  border-radius      :10px;*/
  /*  background         :rgba(0, 0, 0, 0.1);*/
  /*  -webkit-box-shadow :inset 0 0 6px rgba(0, 0, 0, 0.5);*/
  /*}*/

  /*::-webkit-scrollbar-thumb:window-inactive{*/
  /*  background :rgba(255, 0, 0, 0.4);*/
  /*}*/
</style>
