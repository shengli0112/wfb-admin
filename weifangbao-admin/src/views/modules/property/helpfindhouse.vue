<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-helpfind__helpfindhouse}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-select v-model="searchForm.city" placeholder="请选择城市" :clearable="true" @change="searchRegion"
                   >
            <el-option
                v-for="item in cityList"
                :key="item.id"
                :label="item.regionName"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.region" placeholder="请选择区域" :clearable="true">
            <el-option
                v-for="item in region"
                :key="item.id"
                :label="item.regionName"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.apartment" placeholder="请选择户型" :clearable="true">
            <el-option
                v-for="item in apartment"
                :key="item.id"
                :label="item.dictName"
                :value="item.dictName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search()">{{ $t('query') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="areaName" label="区域" header-align="center" align="center"></el-table-column>
        <el-table-column prop="apartment" label="户型" header-align="center" align="center"></el-table-column>
        <el-table-column prop="budget" label="预算（万元）" header-align="center" align="center"></el-table-column>
        <el-table-column prop="nickname" label="需求人" header-align="center" align="center"></el-table-column>
        <el-table-column prop="mobile" label="手机号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="updateDate" label="最后更新时间" header-align="center" align="center"></el-table-column>
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
      <!--      &lt;!&ndash; 弹窗, 新增 / 修改 &ndash;&gt;-->
      <!--      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>-->
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate     from './helpfindhouse-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
          getDataListURL: 'property/helpfindhouse/page',
        getDataListIsPage: true,
          exportURL: '/helpfind/helpfindhouse/export',
          deleteURL: '/helpfind/helpfindhouse',
          deleteIsBatch: true
      },
        cityList: [],
        region: [],
        apartment: [],
        searchForm: {
            city: '',
            region: '',
            apartment: '',
        },
    }
  },
    created() {
        this.$http.get(`property/propertyregion/list?parentId=0`).then(({data: res}) => {
            if (res.code !== 0) {
                return this.$message.error(res.msg)
            }
            this.cityList = res.data
            console.log(this.cityList)
        }).catch(() => {
        }),
            this.$http.get(`common/dictList?pid=1099945308021941004&dictType=sale_apartment`).then(({data: res}) => {
                if (res.code !== 0) {
                    return this.$message.error(res.msg)
                }
                this.apartment = res.data
                // console.log(this.apartment)
            }).catch(() => {
            })

    },
    methods: {
        searchRegion() {
            if (this.searchForm.city == ''){
                this.searchForm.region=''
                this.region=[]
            }else{
                this.$http.get(`property/propertyregion/list?parentId=` + this.searchForm.city).then(({data: res}) => {
                    if (res.code !== 0) {
                        return this.$message.error(res.msg)
                    }
                    this.region = res.data
                    // console.log(this.region)
                    this.searchForm.region = res.data[0].id
                    // console.log(this.searchForm.city)
                }).catch(() => {
                })
            }
        },
        search() {
            // console.log(this.searchForm.region,this.searchForm.apartment)
            this.$http.get('property/helpfindhouse/page?page=1&limit=10&areaId=' + this.searchForm.region + '&apartment=' + this.searchForm.apartment).then(({data: res}) => {
                if (res.code !== 0) {
                    return this.$message.error(res.msg)
                }
                this.dataList = res.data.list
                // console.log(this.dataList)
            }).catch(() => {
            })
        }
    },
  components: {
    // AddOrUpdate
  }
}
</script>
