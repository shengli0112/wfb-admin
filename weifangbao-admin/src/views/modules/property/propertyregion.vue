<template>
  <div>
    <el-card class="box-card" shadow="never">
      <el-form class="form" :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.regionName" placeholder="名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="search()">{{ $t('query') }}</el-button>
        </el-form-item>
        <!--        <el-form-item>-->
        <!--          <el-button type="info" @click="exportHandle()">{{ $t('export') }}</el-button>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item>-->
        <!--          <el-button v-if="$hasPermission('property:propertyregion:delete')" type="danger" @click="deleteHandle()">{{-->
        <!--            $t('deleteBatch') }}-->
        <!--          </el-button>-->
        <!--        </el-form-item>-->
      </el-form>
    </el-card>
    <el-card shadow="never" class="aui-card--fill">
      <div class="header">
        <div class="back" v-if="city != null && dataForm.parentId !=0">
          <p class="city">当前城市：{{city}}</p>
          <p class="back-btn" @click="returnDataList()">返回城市列表 <i class="el-icon-back"></i></p>
        </div>
        <div class="add">
          <el-button v-if="$hasPermission('property:propertyregion:add') && dataForm.parentId == 0"
                     type="primary"
                     @click="addOrUpdateHandle()">
            {{$t('add') }}城市
          </el-button>
          <el-button v-if="$hasPermission('property:propertyregion:add') && dataForm.parentId != 0"
                     type="primary"
                     @click="addOrUpdateHandle()">
            {{$t('add') }}区
          </el-button>
        </div>
      </div>
      <div class="mod-message__propertyregion}">
        <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle"
                  style="width: 100%;" height="500">
          <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
          <el-table-column prop="regionName" label="名称" header-align="center" align="center"></el-table-column>
          <el-table-column label="状态" header-align="center" align="center">
            <template slot-scope="scope">
              <el-switch
                  v-model="scope.row.isShow"
                  :active-value=1
                  :inactive-value=0
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="changeShow($event,scope.row.id)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="sort" label="排序" header-align="center" align="center"></el-table-column>
          <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
            <template slot-scope="scope">
              <el-button v-if="$hasPermission('property:propertyregion:update')" type="text" size="small"
                         @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}
              </el-button>
              <el-button v-if="scope.row.parentId == 0" type="text" size="small"
                         @click="showViewSubordinate(scope.row.id,scope.row.regionName)">{{
                $t('viewSubordinate') }}
              </el-button>
              <el-button v-if="$hasPermission('property:propertyregion:delete')" type="text" size="small"
                         @click="deleteHandle(scope.row.id)">{{ $t('delete') }}
              </el-button>
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
        <add-or-update :parent-id="dataForm.parentId" v-if="addOrUpdateVisible" ref="addOrUpdate"
                       @refreshDataList="getDataList"></add-or-update>
      </div>
    </el-card>
  </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import AddOrUpdate from './propertyregion-add-or-update'

    export default {
        mixins: [mixinViewModule],
        data() {
            return {
                mixinViewModuleOptions: {
                    getDataListURL: '/property/propertyregion/page',
                    getDataListIsPage: true,
                    exportURL: '/property/propertyregion/export',
                    deleteURL: '/property/propertyregion',
                    deleteIsBatch: true
                },
                city: null,
                cityList: null,
                dataForm: {
                    parentId: 0,
                    regionName: ''
                }
            }
        },
        created() {
            this.getPId()
        },
        watch: {
            parentId: function (val) {
                if (val) {
                    this.dataForm.parentId = val
                }
            }
        },
        methods: {
            getPId: function (parentId) {
                if (parentId != undefined) {
                    this.dataForm.parentId = parentId
                }
            },
            search: function () {
                this.$http.get('property/propertyregion/page?regionName=' + this.dataForm.regionName).then(({data: res}) => {
                    if (res.code !== 0) {
                        return this.$message.error(res.msg)
                    }
                    this.dataList = res.data.list
                }).catch(() => {
                })
            },
            changeShow(isShow, id) {
                let data = {"isShow": isShow, "id": id}
                this.$http.put('/property/propertyregion', data).then(({data: res}) => {
                    if (res.code !== 0) {
                        return this.$message.error(res.msg)
                    }
                    this.$message({
                        message: '状态已修改',
                        type: 'success'
                    });
                }).catch(() => {
                })
            },
            showViewSubordinate(id, regionName) {
                this.$http.get('/property/propertyregion/page?parentId=' + id).then(({data: res}) => {
                    if (res.code !== 0) {
                        return this.$message.error(res.msg)
                    }
                    this.city = regionName
                    this.dataForm.parentId = id
                    this.cityList = this.dataList
                    this.dataList = res.data.list
                }).catch(() => {
                })
            },
            returnDataList() {
                this.dataForm.parentId = 0
                this.city = null
                this.dataList = this.cityList
            }
        },
        components: {
            AddOrUpdate
        }
    }
</script>
<style scoped>
  .box-card {
    margin-bottom: 10px;
  }

  .form {
    height: 40px;
  }

  .header {
    margin-bottom: 20px;
  }


  .add {
    margin: 10px 0 20px;
  }


  .back {
    float: right;
    display: inline-block;
    margin-top: -10px;
  }

  .back:after {
    content: "";
    clear: both;
  }

  .back-btn {
    font-size: 14px;
    display: inline-block;
    cursor: pointer;
  }

  .city {
    font-size: 16px;
    margin-right: 20px;
    display: inline-block;
    border-right: 2px solid #dcdfe6;
    padding-right: 10px;
  }
</style>
