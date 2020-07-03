<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-message propertycorrection}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.description" placeholder="反馈内容" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="dataForm.status" placeholder="状态" clearable>
            <el-option label="未处理" :value="0"></el-option>
            <el-option label="已处理" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="search()" type="primary" icon="el-icon-search">{{ $t('query') }}</el-button>
        </el-form-item>
      </el-form>
      <!--列表-->
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle"
                style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="description" label="反馈内容" header-align="center" align="center"></el-table-column>
        <el-table-column prop="pictures" label="图片" header-align="center" align="center">
          <template slot-scope="scope">
            <div class="imgs" style="width: 20%; height: 20%; margin:auto;display: inline-block"
                 v-for="(item,index) in scope.row.pictures" :key="index"
                 @click="showBigPic(item)">
              <img style="width: 100%; height: 100%" :src="item"/>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="contactInfo" label="联系方式" header-align="center" align="center"></el-table-column>
        <el-table-column prop="createDate" label="反馈时间" header-align="center" align="center"></el-table-column>
        <el-table-column prop="statusName" label="状态" header-align="center" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 0" type="warning" size="medium">{{ scope.row.statusName }}</el-tag>
            <el-tag v-if="scope.row.status == 1" type="success" size="medium">{{ scope.row.statusName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('handle')" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status == 0" type="text" @click="changeDetail(scope.row)">处理</el-button>
            <el-button v-else style="visibility:hidden">处理</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
          :current-page="page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="limit"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="pageSizeChangeHandle"
          @current-change="pageCurrentChangeHandle">
      </el-pagination>
    </div>
    <el-dialog
        :visible.sync="dialogVisible"
        width="40%">
      <div style="width: 100%;height: 100%">
        <img style="width: 100%;height: 100%" :src="img"/>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'

    export default {
        mixins: [mixinViewModule],
        data() {
            return {
                mixinViewModuleOptions: {
                    getDataListURL: 'feedback/feedback/page',
                    getDataListIsPage: true,
                    exportURL: '',
                    deleteURL: '',
                    deleteIsBatch: true
                },
                total:0,
                dataForm: {
                    description: '',
                    status: ''
                },
                dialogVisible: false,
                dataListLoading: false,
                dataList: [],// 获取的数据
                img: '' //图片数组
            }
        },
        created() {
            this.getDataList()
        },
        methods: {
            search() {
                this.$http.get('feedback/feedback/page?description=' + this.dataForm.description + '&status=' + this.dataForm.status).then(({data: res}) => {
                    if (res.code !== 0) {
                        return this.$message.error(res.msg)
                    }
                    res.data.list.forEach(function (item, index) {
                        res.data.list[index].pictures = JSON.parse(item.pictures)
                    })
                    this.total = res.data.total
                    this.dataList = res.data.list
                }).catch(() => {
                })
            },
            getDataList() {
                this.$http.get('feedback/feedback/page').then(({data: res}) => {
                    if (res.code !== 0) {
                        return this.$message.error(res.msg)
                    }
                    res.data.list.forEach(function (item, index) {
                        res.data.list[index].pictures = JSON.parse(item.pictures)
                    })
                    this.total = res.data.total
                    this.dataList = res.data.list
                }).catch(() => {
                })
            },
            showBigPic(img) {
                this.img = img
                this.dialogVisible = true
            },
            changeDetail(row) {
                this.$confirm('处理该反馈, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.put('feedback/feedback', {"id": row.id, "status": "1"}).then(({data: res}) => {
                        if (res.code !== 0) {
                            return this.$message.error(res.msg)
                        }
                        this.getDataList()
                        this.$message({
                            type: 'success',
                            message: '处理成功!'
                        });
                    }).catch(() => {
                    })
                }).catch(() => {
                });
            }
        }
    }
</script>
<style scoped>
  .imgs:hover {
    cursor: zoom-in;
  }
</style>