<template>
<el-card shadow="never" class="aui-card--fill">
  <div class="mod-menu">
    <!-- <el-radio-group v-model="tabPosition">
        <el-radio-button label="a">全部商品（1000）</el-radio-button>
        <el-radio-button label="b">未申请上架（1000）</el-radio-button>
        <el-radio-button label="c">被拒绝上架（1000）</el-radio-button>
        <el-radio-button label="d">待审核上架（1000）</el-radio-button>
        <el-radio-button label="e">已上架（1000）</el-radio-button>
    </el-radio-group> -->
    <div class="form-wrap">
        <el-form class="search-form" :inline="true" :model="dataForm" @keyup.enter.native="search()">
            <el-form-item label="商品名称：">
                <el-input v-model="dataForm.name" placeholder="商品名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="上架状态：">
                <el-select v-model="dataForm.onSaleState" placeholder="上架状态" clearable>
                    <el-option label="上架" :value="4"></el-option>
                    <el-option label="下架" :value="5"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
              <el-button @click="search()">{{ $t('query') }}</el-button>
            </el-form-item>
        </el-form>
    </div>
    <div class="operate-wrap">
        <!-- <el-button type="primary">新增</el-button>
        <el-button type="primary">删除</el-button>
        <el-select v-model="order" placeholder="排序字段" class="order-select">
            <el-option label="商品名称" value="1"></el-option>
            <el-option label="添加时间倒序" value="2"></el-option>
            <el-option label="添加时间顺序" value="3"></el-option>
            <el-option label="上架审核状态" value="4"></el-option>
        </el-select> -->
    </div>
      <el-table v-loading="dataListLoading" :data="dataList" border
                @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
          <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
          <el-table-column prop="id" label="编号" width="175px" fixed="left" header-align="center"
                           align="center"></el-table-column>
          <el-table-column prop="storeName" label="商家名称" header-align="center" align="center"></el-table-column>
          <el-table-column prop="name" label="商品名称" width="240px" fixed="left" header-align="center"
                           align="center"></el-table-column>
          <el-table-column prop="mainPicture" label="商品主图" width="120px" header-align="center" align="center">
              <template slot-scope="scope">
                  <img :src="scope.row.mainPicture" class="identify-card">
              </template>
          </el-table-column>

          <el-table-column prop="spuSpecType" label="规格类型" sortable width="120px" header-align="center"
                           align="center">
              <template slot-scope="scope">
                  <label>{{scope.row.spuSpecType > 0 ? '单规格': '多规格'}}</label>
              </template>
          </el-table-column>
          <el-table-column prop="cate1Name" label="商品分类" width="240px" header-align="center"
                           align="left" sortable>
              <template slot-scope="scope">
                  <el-row>
                      <label><code class="code">一级分类</code><span
                              style="color: #0ea55d"> {{scope.row.cate1Name}}</span></label>
                  </el-row>
                  <el-row>
                      <label><code class="code">二级分类</code><span
                              style="color: #0ea55d"> {{scope.row.cate2Name}}</span></label>
                  </el-row>
                  <el-row>
                      <label><code class="code">三级分类</code><span
                              style="color: #0ea55d"> {{scope.row.cate3Name}}</span></label>
                  </el-row>
              </template>
          </el-table-column>
          <el-table-column prop="shopCateName" label="店铺分类" width="120px" header-align="center"
                           align="center" sortable></el-table-column>
          <el-table-column prop="brandName" label="品牌名称" width="160px" header-align="center"
                           align="center">
          </el-table-column>
          <el-table-column prop="integrity" label="信息完整度" width="120px" header-align="center"
                           align="center" sortable>
              <template slot-scope="scope">
                  <label v-if="scope.row.integrity === 100">已完善</label>
                  <label v-else-if="scope.row.integrity === 0" style="color: #f23000">待完善</label>
              </template>
          </el-table-column>
          <el-table-column prop="onSaleState" label="上架状态" width="120px" header-align="center" align="center"
                           sortable>
              <template slot-scope="scope">
                  <el-switch
                          v-model="scope.row.onSaleState"
                          active-color="#13ce66"
                          inactive-color="#ff4949"
                          :active-value='4'
                          :inactive-value='5'
                          @change="onChangeSwitchPromoteStatus(scope.row)">
                  </el-switch>
              </template>
          </el-table-column>
          <el-table-column prop="isNew" label="新品推荐" width="120px" header-align="center" align="center" sortable>
              <template slot-scope="scope">
                  <el-switch
                          v-model="scope.row.isNew"
                          active-color="#13ce66"
                          inactive-color="#ff4949"
                          :active-value='1'
                          :inactive-value='0'
                          @change="changeNewStatus(scope.row)">
                  </el-switch>
              </template>
          </el-table-column>
          <el-table-column prop="isPromote" label="平台推荐" width="120px" header-align="center" align="center"
                           sortable>
              <template slot-scope="scope">
                  <!--<label>{{scope.row.isPromote? '是': '否'}}</label>-->
                  <el-switch
                          v-model="scope.row.isPromote"
                          active-color="#13ce66"
                          inactive-color="#ff4949"
                          :active-value='1'
                          :inactive-value='0'
                          @change="changePromote(scope.row)">
                  </el-switch>
              </template>
          </el-table-column>
          <!--<el-table-column :label="$t('handle')" header-align="center" align="center" width="150">
              <template slot-scope="scope">
                  <el-button v-if="$hasPermission('goods:goodsspu:update')" type="text" size="small"
                             @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}
                  </el-button>
                  <el-button v-if="$hasPermission('goods:goodsspu:delete')" type="text" size="small"
                             @click="deleteHandle(scope.row.id)">{{ $t('delete') }}
                  </el-button>
              </template>
          </el-table-column>-->
      </el-table>
    <el-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="totalCount"
          layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
  </div>
</el-card>
</template>

<script>
export default {
  data () {
    return {
      dataListLoading: false,
      tabPosition: 'a',
      dataForm: {
        storeName: '',
        username: '',
        cateId: '',
        goodsName: ''
      },
      dataList: [],
      classList: [],
      brandList: [],
      order: '',
      options: [],
      pageIndex: 0,
      pageSize: 10,
      totalCount: 0
    }
  },
  activated () {
    this.getDataList()
    this.getCates()
  },
  methods: {
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('goods/goodsspu/page'),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'name': this.dataForm.name,
          'onSaleState': this.dataForm.onSaleState
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(data)
          this.dataList = data.data.list
          this.totalCount = data.data.total
        } else {
          this.dataList = []
          this.totalCount = 0
        }
        this.dataListLoading = false
      })
    },
    getCates() {
      this.$http({
        url: this.$http.adornUrl('goods/category/list_tree'),
        method: 'get',
        params: this.$http.adornParams({

        })
      }).then(({ data }) => {
        let temp = data.data
        // 删除最后一层多余的children
        for (let i = 0; i < temp.length; i++) {
          for (let j = 0; j < temp[i].children.length; j++) {
            for (let k = 0; k < temp[i].children[j].children.length; k++) {
              delete temp[i].children[j].children[k]['children']
            }
          }
        }
        console.log(temp);

        this.options = temp
      })
    },
    search () {
      this.pageIndex = 1
      this.getDataList()
    },
    changeNewStatus(val) {
        let dto = {};
        dto.isNew = val.isNew;
        dto.id = val.id;
        this.$http['post']('/goods/goodsspu/is_new', dto).then(({data: res}) => {
            if (res.code !== 0) {
                return this.$message.error(res.msg)
            }
            this.$message({
                message: this.$t('prompt.success'),
                type: 'success',
                duration: 1000,
                onClose: () => {
                }
            })
        }).catch(() => {
        });
    },
    changePromote(val) {
        let dto = {};
        dto.isPromote = val.isPromote;
        dto.id = val.id;
        this.$http['post']('/goods/goodsspu/is_promote', dto).then(({data: res}) => {
            if (res.code !== 0) {
                return this.$message.error(res.msg)
            }
            this.$message({
                message: this.$t('prompt.success'),
                type: 'success',
                duration: 1000,
                onClose: () => {
                }
            })
        }).catch(() => {
        });
    },
    handleChange(data) {
      this.dataForm.cateId = data[2]
      this.search()
    },
    // 每页数
    sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
    },
    onChangeSwitchPromoteStatus(val) {
      let dto = {};
      dto.onSaleState = val.onSaleState;
      dto.goodsSpuId = val.id;
      this.$http['post']('/goods/goodsspu/on_sale_state', dto).then(({data: res}) => {
          if (res.code !== 0) {
              return this.$message.error(res.msg)
          }
          this.$message({
              message: this.$t('prompt.success'),
              type: 'success',
              duration: 1000,
              onClose: () => {
              }
          })
      }).catch(() => {
      });
    }
  }
}
</script>
<style scoped>
.form-wrap {
    border: 1px solid #eee;
    box-sizing: border-box;
    padding-top: 20px;
    margin-top: 10px;
    padding-left: 20px;
}
.operate-wrap {
    height: 60px;
    line-height: 60px;
    border: 1px solid #eee;
    margin-top: 10px;
    padding-left: 20px;
}
.order-select {
    float: right;
    margin-right: 10px;
}
.el-button+.el-button {
  margin-left: 0;
}
.code {
    color: #9fc7fb;
    background-color: #e6effb;
    margin: 0 4px;
    display: inline-block;
    padding: 1px 5px;
    font-size: 12px;
    border-radius: 3px;
    height: 18px;
    line-height: 18px;
    font-family: Menlo, Monaco, Consolas, Courier, monospace;
}
.identify-card {
    width: 50px;
    height: 50px;
}
</style>
