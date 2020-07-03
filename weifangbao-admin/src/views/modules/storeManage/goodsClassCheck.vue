<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-demo__news">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="search()">
        <el-form-item>
          <el-input v-model="dataForm.shopName" placeholder="店铺名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.shopAccount" placeholder="商家账号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="dataForm.status" placeholder="审核状态" clearable>
            <el-option v-for="item in statusList" :label="item.name" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="search()">{{ $t('query') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="dataListLoading"
        :data="dataList"
        border
        @selection-change="dataListSelectionChangeHandle"
        @sort-change="dataListSortChangeHandle"
        style="width: 100%;"
      >
        <el-table-column prop="id" label="编号" header-align="center" align="left" width="180">
        </el-table-column>
        <el-table-column prop="shopName" label="商家名称" header-align="center" align="left" width="180">
        </el-table-column>
        <el-table-column prop="shopAccount" label="商家账号" header-align="center" align="left" width="180">
        </el-table-column>
        <el-table-column
          prop="cate1Name"
          label="一级分类名称"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column prop="cate2Name" label="二级分类名称" header-align="center" align="center">
        </el-table-column>
        <el-table-column prop="cate3Name" label="三级分类名称" header-align="center" align="center"></el-table-column>
        <el-table-column label="审核状态" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <div>
              <span style="display:inline-block;margin-right:10px;" v-if="scope.row.status === 1">未审核</span>
              <span style="display:inline-block;margin-right:10px;" v-if="scope.row.status === 2">审核通过</span>
              <span style="display:inline-block;margin-right:10px;" v-if="scope.row.status === 3">审核拒绝</span>
              <el-button type="text" size="small" @click="detail(scope.row.id)">审核详情</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createDate" label="提交时间" header-align="center" align="left" width="160">
        </el-table-column>
        <el-table-column
          :label="$t('handle')"
          fixed="right"
          header-align="center"
          align="center"
          width="200"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.status === 1">
              <el-button type="text" size="small" @click="check(scope.row.id, 2)">通过</el-button>
              <el-button type="text" size="small" @click="check(scope.row.id, 3)">拒绝</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="page"
        :page-sizes="[2,10, 20, 50, 100]"
        :page-size="limit"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="pageSizeChangeHandle"
        @current-change="pageCurrentChangeHandle"
      ></el-pagination>
    </div>
    <!-- 审核详情 -->
    <el-dialog
      title="审核详情"
      :visible.sync="applyDetailVisible"
      width="800px">
      <div style="">
        <el-table
        :data="detailList"
        border
        style="width: 100%;"
        >
          <el-table-column prop="createDate" label="审核时间" header-align="center" align="center">
          </el-table-column>
          <el-table-column prop="adminName" label="审核人员" header-align="center" align="center">
          </el-table-column>
          <el-table-column label="审核结果" header-align="center" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.result === 2">审核通过</span>
              <span v-if="scope.row.result === 3">审核拒绝</span>
            </template>
          </el-table-column>
          <el-table-column prop="cause" label="反馈详情" header-align="center" align="center">
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <!-- 审核备注 -->
    <el-dialog
      title="审核备注"
      :visible.sync="applyMarkVisible"
      width="600px">
      <div style="">
        <el-input type="textarea" v-model="mark" placeholder="请输入内容" clearable></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="reset()">重置</el-button>
        <el-button type="primary" @click="checkSubmit()">提 交</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: 'goods/shopcategory/page',
        getDataListIsPage: true,
        deleteURL: 'goods/shopcategory',
        deleteIsBatch: true
      },
      dataForm: {
        shopName: null,
        shopAccount: null,
        status: null
      },
      statusList: [
        {
          name: '未审核',
          id: 1
        },{
          name: '审核通过',
          id: 2
        },{
          name: '审核拒绝',
          id: 3
        }
      ],
      detailList: [],
      mark: null,
      applyDetailVisible: false,
      applyMarkVisible: false
    }
  },
  activated () {
  },
  methods: {
    /* 审核详情 */
    detail (id) {
      this.applyDetailVisible = true
      this.$http.get(`common/checkLog?type=2&id=${id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.detailList = res.data
      }).catch(() => {})
    },
    check (id, status) {
      this.applyMarkVisible = true
      this.checkId = id
      this.checkStatus = status
    },
    checkSubmit () {
      if (!this.mark) {
        this.$message.warning('请填写审核内容')
        return
      } else {
        this.$http({
          url: this.$http.adornUrl('goods/shopcategory/check'),
          method: 'put',
          data: this.$http.adornData({
            'id': this.checkId,
            'status': this.checkStatus,
            'cause': this.mark
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message.success('提交成功')
            this.applyMarkVisible = false
            this.getDataList()
            this.reset()
          } else {
            this.$message.warning(data.msg)
          }
        })
      }
    },
    reset () {
      this.mark = null
    }
  },
  watch: {
  },
  components: {
  }
}
</script>

<style scoped>
</style>
