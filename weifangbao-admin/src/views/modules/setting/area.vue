<template>
<el-card shadow="never" class="aui-card--fill">
  <div class="mod-menu">
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-button type="primary" @click="addHandle(0, 1)">新增一级分类</el-button>
        <el-button type="success" v-if="this.level != 1" @click="lookUpLevel()">查看上级菜单</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      style="width: 100%;">
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        width="180"
        label="ID">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="地区名称"
        width="400">
        <template slot-scope="scope">
          <span style="margin-right:15px;display:inline-block;">{{scope.row.name}}</span>
          <el-button type="text" size="small" v-if="scope.row.level !== 3" @click="addHandle(scope.row.id, scope.row.level + 1)">新增下级</el-button>
          <el-button v-if="scope.row.level !== 3" type="text" size="small" @click="getDataList(scope.row.id)">查看下级</el-button>
          <el-button type="text" size="small" @click="updateHandle(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="level"
        header-align="center"
        align="center"
        label="所在层级">
        <template slot-scope="scope">
          <span>{{scope.row.level + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="cityCode"
        header-align="center"
        align="center"
        label="地区编号">
      </el-table-column>
      <el-table-column
        prop="sort"
        header-align="center"
        align="center"
        label="排序号">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <el-dialog
      :title="title"
      :visible.sync="addOrUpdateVisible"
      width="40%">
      <div>
        <el-form :model="addClass" ref="classForm" :rules="dataRule" status-icon label-width="120px">
          <el-form-item label="分类名称" prop="name">
            <el-input v-model="addClass.name"></el-input>
          </el-form-item>
          <el-form-item label="拼音" prop="pinyin">
            <el-input v-model="addClass.pinyin"></el-input>
          </el-form-item>
          <el-form-item label="简短名称" prop="shortName">
            <el-input v-model="addClass.shortName"></el-input>
          </el-form-item>
          <el-form-item label="区号" prop="cityCode">
            <el-input v-model="addClass.cityCode"></el-input>
          </el-form-item>
          <el-form-item label="邮政编码" prop="zipCode">
            <el-input v-model="addClass.zipCode"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input v-model="addClass.sort"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="addOrUpdateVisible = false">取 消</el-button>
        <el-button type="primary" v-if="this.title != '编辑分类'" @click="classFormSubmit()">提 交</el-button>
        <el-button type="primary" v-if="this.title == '编辑分类'" @click="editFormSubmit()">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</el-card>
</template>

<script>
// import { stringify } from 'querystring'
export default {
  data () {
    return {
      level: 1, // 接口参数里的level是从0开始的，这里的level是从1开始的
      pid: null,
      addLv: 1,
      addPid: null,
      lv1Id: null,
      lv2Id: null,
      title: '新建一级分类',
      dataForm: {},
      addClass: {
        name: null,
        pinyin: null,
        shortName: null,
        cityCode: null,
        zipCode: null,
        sort: null
      },
      dataRule: {
        name: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalCount: 0,
      dataListLoading: false,
      addOrUpdateVisible: false
    }
  },
  activated () {
    this.getDataList(0)
  },
  methods: {
    // 获取数据列表
    getDataList (pid) {
      if (this.level === 1) { /* 保存一级的id，给第三级查看上级用 */
        this.lv1Id = pid
        // console.log(this.lv1Id)
      } else if (this.level === 2) { /* 保存二级的id，给第四级查看上级用 */
        this.lv2Id = pid
        // console.log(this.lv2Id)
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('setting/area/list'),
        method: 'get',
        params: this.$http.adornParams({
          'pid': pid
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.data
          this.pid = pid
          this.level = data.data ? (data.data[0].level + 1) : (this.level + 1)
        } else {
          this.dataList = []
          this.totalCount = 0
        }
        this.dataListLoading = false
      })
    },
    // 查询分类详情
    getClassDetail (id) {
      // this.addClass = {}
      this.$http({
        url: this.$http.adornUrl('goods_assort/query_goods_assort_detail'),
        method: 'get',
        params: this.$http.adornParams({
          'assort_id': id
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.addClass.id = data.data.id
          this.addClass.name = data.data.category_name
          this.addClass.sort = data.data.sort
        }
        console.log(this.addClass)
      })
    },
    // 查看上级分类
    lookUpLevel () {
      if (this.level === 2) {
        this.getDataList(0)
      } else if (this.level === 3) {
        // console.log(this.lv1Id)
        this.getDataList(this.lv1Id)
      } else if (this.level === 4) {
        // console.log(this.lv2Id)
        this.getDataList(this.lv2Id)
      }
    },
    // 提交添加的分类
    classFormSubmit () {
      this.$refs['classForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('setting/area'),
            method: 'post',
            data: this.$http.adornData({
              pid: this.addPid,
              name: this.addClass.name,
              pinyin: this.addClass.pinyin,
              shortName: this.addClass.shortName,
              cityCode: this.addClass.cityCode,
              zipCode: this.addClass.zipCode,
              sort: this.addClass.sort
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message.success('添加成功')
              this.addOrUpdateVisible = false
              this.getDataList(this.pid)
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      })
    },
    // 提交编辑分类
    editFormSubmit () {
      this.$refs['classForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('setting/area'),
            method: 'put',
            data: this.$http.adornData({
              id: this.addClass.id,
              name: this.addClass.name,
              pinyin: this.addClass.pinyin,
              shortName: this.addClass.shortName,
              cityCode: this.addClass.cityCode,
              zipCode: this.addClass.zipCode,
              sort: this.addClass.sort
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message.success('编辑成功')
              this.addOrUpdateVisible = false
              this.getDataList(this.pid)
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      })
    },
    // 新增
    addHandle (id, lv) {
      this.addPid = id
      this.addLv = lv
      if (lv === 1) {
        this.title = '新建一级分类'
      } else if (lv === 2) {
        this.title = '新建二级分类'
      } else if (lv === 3) {
        this.title = '新建三级分类'
      } else if (lv === 4) {
        this.title = '新建四级分类'
      }
      this.addOrUpdateVisible = true
      this.$refs['classForm'].resetFields()
    },
    // 编辑
    updateHandle (row) {
      this.title = '编辑分类'
      this.addOrUpdateVisible = true
      // this.getClassDetail(id)
      this.addClass = row
    },
    // 删除
    deleteHandle (id) {
      this.$confirm(`确定对[id=${id}]进行[删除]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('setting/area'),
          method: 'delete',
          data: this.$http.adornData(
            [id]
          )
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 800,
              onClose: () => {
                this.getDataList(this.pid)
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      }).catch(() => {})
    }
  }
}
</script>
