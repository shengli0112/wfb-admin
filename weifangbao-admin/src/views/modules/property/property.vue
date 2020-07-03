<template>
  <div>
    <el-card shadow="never">
      <el-form class="form-inline" :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.propertyName" placeholder="楼盘名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.mobile" placeholder="发布人手机号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="city" clearable placeholder="请选择城市" @change="getAreaList">
            <el-option
                v-for="item in cityList"
                :key="item.id"
                :label="item.regionName"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="dataForm.area" clearable placeholder="请选择地区">
            <el-option
                v-for="item in areaList"
                :key="item.id"
                :label="item.regionName"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search()">{{ $t('query') }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="never" class="aui-card--fill">
      <div class="mod-message__property}">
        <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle"
                  style="width: 100%;">
          <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
          <el-table-column prop="sort" label="排序" header-align="center" align="center" width="50">
            <template slot-scope="scope">
              <el-input class="changeSort" v-model="scope.row.sort" @blur="changeSort(scope.row)"/>
            </template>
          </el-table-column>
          <el-table-column prop="id" label="ID" header-align="center" align="center"></el-table-column>
          <el-table-column prop="propertyName" label="楼盘名称" header-align="center" align="center"></el-table-column>
          <el-table-column prop="areaName" label="区域" header-align="center" align="center"></el-table-column>
          <el-table-column prop="saleAddress" label="地址" header-align="center" align="center"></el-table-column>
          <el-table-column prop="nickname" label="发布人" header-align="center" align="center"></el-table-column>
          <el-table-column prop="totalPrice" label="均价(万元/㎡)" header-align="center" align="center"></el-table-column>
          <el-table-column prop="openingDate" label="开盘时间" header-align="center" align="center"></el-table-column>
          <el-table-column prop="isTop" label="置顶" header-align="center" align="center">
            <template slot-scope="scope">
              <el-switch
                  v-model="scope.row.isTop"
                  :active-value=1
                  :inactive-value=0
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="changeTop($event,scope.row.id)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="isNew" label="最近楼盘" header-align="center" align="center">
            <template slot-scope="scope">
              <el-switch
                  v-model="scope.row.isNew"
                  :active-value=1
                  :inactive-value=0
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="changeMark(scope.row.id,'isNew',$event)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="isDiscount" label="折扣好房" header-align="center" align="center">
            <template slot-scope="scope">
              <el-switch
                  v-model="scope.row.isDiscount"
                  :active-value=1
                  :inactive-value=0
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="changeMark(scope.row.id,'isDiscount',$event)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="isPop" label="网红楼盘" header-align="center" align="center">
            <template slot-scope="scope">
              <el-switch
                  v-model="scope.row.isPop"
                  :active-value=1
                  :inactive-value=0
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="changeMark(scope.row.id,'isPop',$event)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="propertyStatusName" label="上架状态" header-align="center"
                           align="center">
            <template slot-scope="scope">
              <el-tag
                  v-if="scope.row.propertyStatus != 4&&scope.row.propertyStatus != 5"
                  :type="scope.row.propertyStatusName == '审核中' ? 'warning' : 'primary'||scope.row.propertyStatusName == '待审核' ? 'info' : 'primary'||scope.row.propertyStatusName == '驳回' ? 'danger' : 'primary'"
                  close-transition>{{scope.row.propertyStatusName}}
              </el-tag>
              <el-switch
                  v-else
                  v-model="scope.row.propertyStatus"
                  :active-value=4
                  :inactive-value=5
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="changeShow($event,scope.row.id)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column :label="$t('handle')" header-align="center" align="center" width="180">
            <template slot-scope="scope">
              <el-button v-if="scope.row.propertyStatus ==1" type="text" size="small" @click="trueStatus(scope.row)">
                通过
              </el-button>
              <el-button v-if="scope.row.propertyStatus ==1" type="text" size="small"
                         @click="falseStatus(scope.row)">拒绝
              </el-button>
              <el-button v-if="$hasPermission('property:property:update')" type="text"
                         size="small"
                         @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}
              </el-button>
              <el-button v-if="$hasPermission('property:property:delete')" type="text" size="small"
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
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
      </div>
    </el-card>
  </div>

</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import AddOrUpdate from './property-add-or-update'

    export default {
        mixins: [mixinViewModule],
        data() {
            return {
                mixinViewModuleOptions: {
                    getDataListURL: '/property/property/page',
                    getDataListIsPage: true,
                    exportURL: '/property/property/export',
                    deleteURL: '/property/property',
                    deleteIsBatch: true
                },
                dataForm: {
                    propertyName: '',
                    mobile: '',
                    area: ''
                },
                options: [],
                value: '',
                cityList: [],  //城市列表
                city: '',  //选中的城市
                areaList: [],  //地区列表
                area: '',  //选中的地区
            }
        },
        created() {
            this.getTableList();
            this.getCityList()
        },
        methods: {
            getCityList() {
                this.$http.get('/property/propertyregion/list?parentId=0').then(({data: res}) => {
                    if (res.code !== 0) {
                        return this.$message.error(res.msg)
                    }
                    this.cityList = res.data
                }).catch(() => {
                })  //获取区域
            },
            // 获取城市列表
            getAreaList(e) {
                let obj = {};
                if (e != '') {
                    obj = this.cityList.find((item) => {//这里的userList就是上面遍历的数据源
                        return item.id === e;//筛选出匹配数据
                    });
                }
                if (obj.parentId != '0' || obj.parentId == undefined || e == undefined) {
                    this.dataForm.area = ''
                    this.areaList = ''
                } else {
                    // console.log("选中的城市数据", obj.id, obj.regionName);//我这边的name就是对应label的
                    this.$http.get('/property/propertyregion/list?parentId=' + e).then(({data: res}) => {
                        if (res.code !== 0) {
                            return this.$message.error(res.msg)
                        }
                        this.areaList = res.data
                    }).catch(() => {
                    })  //获取区域
                }
            },
            getTableList() {
                this.$http.get('property/propertyregion/list').then(({data: res}) => {
                    if (res.code !== 0) {
                        return this.$message.error(res.msg)
                    }
                    this.options = res.data
                }).catch(() => {
                })
            },
            trueStatus(row) {
                this.$prompt('请输入备注', '确认通过？', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(({value}) => {
                    let data = {"propertyStatus": 2, "id": row.id, "remark": value}
                    this.$http.put('property/property/check', data).then(({data: res}) => {
                        if (res.code !== 0) {
                            return this.$message.error(res.msg)
                        }
                        this.getDataList()
                    }).catch(() => {
                    })
                    this.$message({
                        type: 'success',
                        message: '已通过'
                    });
                }).catch(() => {
                });
            },
            falseStatus(row) {
                this.$prompt('请输入备注', '确认拒绝？', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(({value}) => {
                    let data = {"propertyStatus": 3, "id": row.id, "remark": value}
                    this.$http.put('property/property/check', data).then(({data: res}) => {
                        if (res.code !== 0) {
                            return this.$message.error(res.msg)
                        }
                        this.getDataList()
                    }).catch(() => {
                    })
                    this.$message({
                        type: 'danger',
                        message: '已拒绝'
                    });
                }).catch(() => {
                });
            },
            changeSort(row) {
                let data = {"id": row.id, "sort": row.sort}
                this.$http.put('property/property', data).then(({data: res}) => {
                    if (res.code !== 0) {
                        return this.$message.error(res.msg)
                    }
                    this.getDataList()
                }).catch(() => {
                })
            },
            search: function () {
                this.$http.get('property/property/page?propertyName=' + this.dataForm.propertyName + '&area=' + this.dataForm.area + '&mobile=' + this.dataForm.mobile).then(({data: res}) => {
                    if (res.code !== 0) {
                        return this.$message.error(res.msg)
                    }
                    this.dataList = res.data.list
                    console.log(this.dataForm)
                }).catch(() => {
                })
            },
            changeShow(isShow, id) {
                let data = {"propertyStatus": isShow, "id": id}
                this.$http.put('/property/property', data).then(({data: res}) => {
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
            changeTop(isTop, id) {
                let data = {"isTop": isTop, "id": id}
                this.$http.put('/property/property/isTop', data).then(({data: res}) => {
                    if (res.code !== 0) {
                        return this.$message.error(res.msg)
                    }
                    this.getDataList()
                    this.$message({
                        message: '状态已修改',
                        type: 'success'
                    });
                }).catch(() => {
                })
            },
            changeMark( id,key,value) {
                let data = { "id": id};
                data[key]=value;
                this.$http.put('/property/property', data).then(({data: res}) => {
                    if (res.code !== 0) {
                        return this.$message.error(res.msg)
                    }
                    this.getDataList()
                    this.$message({
                        message: '状态已修改',
                        type: 'success'
                    });
                }).catch(() => {
                })
            }
        },
        components: {
            AddOrUpdate
        }
    }
</script>
<style scoped>
  .form-inline {
    height: 40px;
  }

  .add {
    margin-bottom: 20px;
  }

  .changeSort >>> .el-input__inner {
    text-align: center;
    padding: 0;
  }
</style>
