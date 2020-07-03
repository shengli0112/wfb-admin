<template>
  <el-card class="aui-card--fill" shadow="never">
    <div class="mod-menu">
      <el-form :inline="true" :model="dataForm">
        <el-form-item>
          <el-button @click="addHandle(0, 1)" type="primary" v-if="level == 1">新增一级分类</el-button>
          <el-button @click="addHandle(tId, 2)" type="primary" v-if="level == 2">新增二级分类</el-button>
          <el-button @click="addHandle(tId, 3)" type="primary" v-if="level == 3">新增三级分类</el-button>
          <el-button @click="lookUpLevel()" type="success" v-if="this.level !== 1">查看上级菜单</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="dataList" border style="width: 100%;">
        <el-table-column align="center" header-align="center" label="ID" prop="id" width="180"></el-table-column>
        <el-table-column align="center" header-align="center" label="分类名称" prop="name" width="100"></el-table-column>
        <el-table-column align="center" header-align="center" label="分类图标" width="100">
          <template slot-scope="scope">
            <img :src="scope.row.icon" alt="" style="width:100%;">
          </template>
        </el-table-column>
        <el-table-column align="center" header-align="center" label="级别" prop="level">
          <template slot-scope="scope">
            <span v-if="scope.row.level == 1">一级</span>
            <span v-if="scope.row.level == 2">二级</span>
            <span v-if="scope.row.level == 3">三级</span>
          </template>
        </el-table-column>
        <el-table-column align="center" header-align="center" label="状态">
          <template slot-scope="scope">
            <el-tag size="small" type="success" v-if="scope.row.isEnabled === 1 ">启用</el-tag>
            <el-tag size="small" type="danger" v-if="scope.row.isEnabled === 0 ">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" header-align="center" label="排序号" prop="sort"></el-table-column>
        <el-table-column align="center" header-align="center" label="设置" v-if="this.level !== 3" width="150">
          <template slot-scope="scope">
            <el-button @click="addHandle(scope.row.id, scope.row.level + 1)" size="small" type="text" v-if="scope.row.level !== 3">新增下级</el-button>
            <el-button @click="lookNext(scope.row.id, scope.row.level + 1)" size="small" type="text" v-if="scope.row.level !== 3">查看下级</el-button>
          </template>
        </el-table-column>
<!--    三级分类去掉 规格属性    -->
<!--        <el-table-column align="center" header-align="center" label="品类编号" v-if="this.level === 3" width="150">-->
<!--          <template slot-scope="scope">-->
<!--            <span v-if="scope.row.cateNo">{{scope.row.cateNo}}</span>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--                <el-table-column align="center" header-align="center" label="常用分类" v-if="this.level === 3" width="150">-->
<!--                  <template slot-scope="scope">-->
<!--                    <el-switch active-color="#13ce66" active-value="1" inactive-color="#ff4949" inactive-value="0" v-model="this.hotCategory">-->
<!--                    </el-switch>-->
<!--                  </template>-->
<!--        </el-table-column>-->
        <el-table-column align="center" fixed="right" header-align="center" label="操作" width="150">
          <template slot-scope="scope">
            <el-button @click="transfer(scope.row.id,scope.row.level)" size="small" type="text" v-if="scope.row.level != 1">转移分类</el-button>
            <el-button @click="updateHandle(scope.row)" size="small" type="text">编辑</el-button>
            <el-button @click="deleteHandle(scope.row.id)" size="small" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :current-page="pageIndex" :page-size="pageSize" :page-sizes="[10, 20, 50, 100]" :total="totalCount" @current-change="currentChangeHandle"
                     @size-change="sizeChangeHandle" layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
      <!-- 弹窗, 新增 / 修改 -->
      <el-dialog :title="title" :visible.sync="addOrUpdateVisible" width="40%">
        <div>
          <el-form :model="addClass" :rules="dataRule" label-width="120px" ref="classForm" status-icon>
            <el-form-item label="分类名称" prop="name">
              <el-input v-model="addClass.name"></el-input>
            </el-form-item>
            <el-form-item label="是否启用" prop="isEnabled">
              <el-switch :active-value=1 :disabled="isNew" :inactive-value=0 active-color="#13ce66" inactive-color="#ff4949" v-model="addClass.isEnabled">
              </el-switch>
            </el-form-item>
            <el-form-item label="是否需要申请" prop="isNeedCheck" v-if="editLv3">
              <el-switch :active-value=1 :inactive-value=0 active-color="#13ce66" inactive-color="#ff4949" v-model="addClass.isNeedCheck">
              </el-switch>
            </el-form-item>
            <el-form-item label="分类图标" prop="icon">
              <el-upload :action="uploadUrl" :on-success="handleAvatarSuccess" :show-file-list="false" class="post-uploader">
                <img :src="addClass.icon" class="post" v-if="addClass.icon">
                <i class="el-icon-plus post-uploader-icon" v-else></i>
                <div class="el-upload__tip" slot="tip">图标尺寸为200*200px，大小不能超过200KB，图片只能为jpg、png、gif格式</div>
              </el-upload>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
              <el-input v-model="addClass.sort"></el-input>
            </el-form-item>
            <div v-if="editLv3">
              <el-form-item label="品类编号" prop="cateNo">
                <el-input v-model="addClass.cateNo"></el-input>
              </el-form-item>
              <el-form-item label="规格设置">
                <el-button @click="addSpec()" size="small" style="margin-bottom:10px;" type="success">添加</el-button>
                <el-table :data="addClass.specs" border style="width: 100%;">
                  <el-table-column align="center" header-align="center" label="排序" prop="sort">
                    <template slot-scope="scope">
                      <el-input placeholder="请填写" size="small" type="number" v-model="scope.row.sort"></el-input>
                    </template>
                  </el-table-column>

                  <el-table-column align="center" header-align="center" label="规格名称" prop="name">
                    <template slot-scope="scope">
                      <el-input placeholder="请填写" size="small" v-model="scope.row.name"></el-input>
                    </template>
                  </el-table-column>

                  <el-table-column align="center" header-align="center" label="是否可上传规格图" prop="hasIcon">
                    <template slot-scope="scope">
                      <el-switch :active-value=1 :disabled="!scope.row.hasIcon && disableIcon" :inactive-value=0 @change="changeIcon" active-color="#13ce66" inactive-color="#ff4949" v-model="scope.row.hasIcon">
                      </el-switch>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" fixed="right" header-align="center" label="操作" width="100">
                    <template slot-scope="scope">
                      <el-button @click="delSpec(scope.$index)" size="small" type="text">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <p class="tip">1、最多只有一个规格可以设置允许上传规格图，规格图尺寸 200*200比例</p>
                <p class="tip">2、在该规格下面有再上架中商品的情况下不允许删除该规格，可以修改规格名称</p>
              </el-form-item>
              <el-form-item label="添加属性">
                <el-button @click="addAttr()" size="small" style="margin-bottom:10px;" type="success">添加</el-button>
                <el-table :data="addClass.attrs" border style="width: 100%;">
                  <el-table-column align="center" header-align="center" label="排序" prop="sort">
                    <template slot-scope="scope">
                      <el-input placeholder="请填写" size="small" type="number" v-model="scope.row.sort"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" header-align="center" label="属性名称" prop="name">
                    <template slot-scope="scope">
                      <el-input placeholder="请填写" size="small" v-model="scope.row.name"></el-input>
                      <el-input placeholder="请填写" size="small" style="display: none" v-model="scope.row.values"></el-input>
                    </template>
                  </el-table-column>
                  <!--<el-table-column prop="value" header-align="center" label="属性值" align="center" >-->
                  <!--<template slot-scope="scope">-->
                  <!--<el-input v-model="scope.row.values" size="small" placeholder="请填写"></el-input>-->
                  <!--</template>-->
                  <!--</el-table-column>-->

                  <el-table-column align="center" header-align="center" label="是否要上传资质" prop="hasIcon">
                    <template slot-scope="scope">
                      <el-switch :active-value=1 :inactive-value=0 active-color="#13ce66" inactive-color="#ff4949" v-model="scope.row.hasIcon">
                      </el-switch>
                    </template>
                  </el-table-column>

                  <el-table-column align="center" fixed="right" header-align="center" label="操作" width="100">
                    <template slot-scope="scope">
                      <el-button @click="delAttr(scope.$index)" size="small" type="text">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <p class="tip">多个属性值需要用英文逗号","隔开,商家发布商品是即可下拉选择属性值</p>
              </el-form-item>
              <el-form-item label="关键词">
                <el-input placeholder="多个关键词需要用英文逗号‘,’隔开" v-model="addClass.keyword"></el-input>
              </el-form-item>
              <el-form-item label="分类描述">
                <el-input type="textarea" v-model="addClass.descr"></el-input>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <span class="dialog-footer" slot="footer">
        <el-button @click="addOrUpdateVisible = false" type="default">取 消</el-button>
        <el-button @click="classFormSubmit()" type="primary" v-if="this.title != '编辑分类'">提 交</el-button>
        <el-button @click="editFormSubmit()" type="primary" v-if="this.title == '编辑分类'">保 存</el-button>
      </span>
      </el-dialog>
      <!-- 转移分类 -->
      <el-dialog
          :visible.sync="transferDialogVisible"
          title="转移分类"
          width="400px">
        <div style="margin: 0 auto;width: 200px;">
          <el-select clearable placeholder="请选择" v-model="transId">
            <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in transList"></el-option>
          </el-select>
        </div>
        <span class="dialog-footer" slot="footer">
        <el-button @click="transferDialogVisible = false" type="default">取 消</el-button>
        <el-button @click="transferSubmit()" type="primary">提 交</el-button>
      </span>
      </el-dialog>
    </div>
  </el-card>
</template>

<script>
  // import { stringify } from 'querystring'
  import Cookies from 'js-cookie'

  export default {
    data () {
      return {
        level: 1, // 接口参数里的level是从0开始的，这里的level是从1开始的
        uploadUrl: '',
        pid: null,
        addPid: null,
        lv1Id: null,
        upId: null,
        title: '新建一级分类',
        dataForm: {},
        isNew: true,
        addClass: {
          name: null,
          isEnabled: 1,
          isNeedCheck: 1,
          icon: null,
          sort: null,
          cateNo: null,
          specs: [{
            name: null,
            hasIcon: 0,
            sort: null
          }],
          attrs: [{
            name: null,
            values: '',
            sort: null
          }],
          keyword: null,
          descr: null
        },
        dataRule: {
          name: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ]
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalCount: 0,
        transId: null,  // 转移到的分类
        transId_self: null, // 被转移的分类
        tId: null,
        transList: [],
        editLv3: false,
        disableIcon: false,
        dataListLoading: false,
        addOrUpdateVisible: false,
        transferDialogVisible: false,
        hotCategory: 0,
      }
    },
    activated () {
      this.uploadUrl = `${window.SITE_CONFIG['apiURL']}/sys/oss/upload?token=${Cookies.get('token')}`
      this.getDataList(0, 1)
    },
    methods: {
      // 获取数据列表
      getDataList (pid, level) {
        if (level === 2) { /* 保存一级的id，给第三级查看上级用 */
          this.lv1Id = pid
        }
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('goods/category/page'),
          method: 'get',
          params: this.$http.adornParams({
            'pid': pid,
            'page': this.pageIndex,
            'limit': this.pageSize
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.data.list
            this.totalCount = data.data.total
            this.pid = pid
            this.level = level
          } else {
            this.dataList = []
            this.totalCount = 0
          }
          this.dataListLoading = false
        })
      },
      // 查看上级分类
      lookUpLevel () {
        this.pageIndex = this.upId
        if (this.level === 2) {
          this.getDataList(0, 1)
        } else if (this.level === 3) {
          this.getDataList(this.lv1Id, 2)
        }
      },
      lookNext (id, lv) {
        this.upId = this.pageIndex
        this.pageIndex = 1
        this.tId = id
        this.getDataList(id, lv)
      },
      transfer (id, lv) {
        this.transId_self = id
        let pid = 0
        if (lv == 3) {
          pid = this.lv1Id
        }
        this.$http({
          url: this.$http.adornUrl('goods/category/page'),
          method: 'get',
          params: this.$http.adornParams({
            'pid': pid,
            'page': 1,
            'limit': 100
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.transList = data.data.list
            this.transId = this.tId
          } else {
            this.transList = []
          }
        })
        this.transferDialogVisible = true
      },
      // 提交转移分类
      transferSubmit () {
        this.$http({
          url: this.$http.adornUrl('goods/category'),
          method: 'put',
          data: this.$http.adornData({
            id: this.transId_self,
            pid: this.transId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message.success('编辑成功')
            this.transferDialogVisible = false
            this.getDataList(this.pid, this.level)
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      // 提交添加的分类
      classFormSubmit () {
        this.$refs['classForm'].validate((valid) => {
          if (valid) {
            let specVal = true
            if (this.editLv3) {
              for (let item of this.addClass.specs) {
                if (!item.name) {
                  specVal = false
                }
              }
              if (!specVal) {
                this.$message.error('请填写规格名')
                return
              }
              if (this.addClass.specs.length == 0) {
                this.$message.error('规格不能为空')
                return
              }
            }
            let data = this.addClass
            data.pid = this.addPid
            this.$http({
              url: this.$http.adornUrl('goods/category'),
              method: 'post',
              data: this.$http.adornData(data)
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message.success('添加成功')
                this.addOrUpdateVisible = false
                this.disableIcon = false
                this.getDataList(this.pid, this.level)
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
              url: this.$http.adornUrl('goods/category'),
              method: 'put',
              data: this.$http.adornData(this.addClass)
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message.success('编辑成功')
                this.addOrUpdateVisible = false
                this.disableIcon = false
                this.getDataList(this.pid, this.level)
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
        this.isNew = true
        this.editLv3 = false
        this.addClass = {
          name: null,
          isEnabled: 1,
          icon: null,
          sort: null
        }
        if (lv === 1) {
          this.title = '新建一级分类'
        } else if (lv === 2) {
          this.title = '新建二级分类'
        } else if (lv === 3) {
          this.title = '新建三级分类'
          // 三级分类去掉规格+属性
          // this.editLv3 = true
          // this.addClass = {
          //   name: null,
          //   isEnabled: 1,
          //   isNeedCheck: 1,
          //   icon: null,
          //   sort: null,
          //   specs: [{
          //     name: null,
          //     hasIcon: 0,
          //     sort: null
          //   }],
          //   attrs: [{
          //     name: null,
          //     values: '',
          //     sort: null
          //   }],
          //   keyword: null,
          //   descr: null
          // }
        }
        this.addOrUpdateVisible = true
      },
      // 编辑
      updateHandle (row) {
        this.title = '编辑分类'
        this.isNew = false
        this.addOrUpdateVisible = true
        if (this.level == 333333333) {
          this.editLv3 = true
          this.$http({
            url: this.$http.adornUrl('goods/category/' + row.id),
            method: 'get'
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.addClass = data.data
            } else {
              this.$message.error(data.msg)
            }
          })
        } else {
          this.editLv3 = false
          this.addClass = row
        }
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList(this.pid, this.level)
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList(this.pid, this.level)
      },
      // 删除
      deleteHandle (id) {
        this.$confirm(`确定对[id=${id}]进行[删除]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('goods/category'),
            method: 'delete',
            data: this.$http.adornData(
              [id]
            )
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 800,
                onClose: () => {
                  this.getDataList(this.pid, this.level)
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {
        })
      },
      handleAvatarSuccess (res, file) {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.addClass.icon = res.data.src
      },
      /* 第三级分类编辑 */
      addSpec () {
        if (this.addClass.specs == null || this.addClass.specs.length < 4) {
          this.addClass.specs.push({
            name: null,
            hasIcon: 0,
            sort: null
          })
        } else {
          this.$message.error('最多可以添加4行')
        }
      },
      addAttr () {
        if (this.addClass.attrs == null) {
          this.addClass.attrs = []
        }
        this.addClass.attrs.push({
          name: null,
          values: '',
          sort: null
        })
      },
      delSpec (index) {
        this.addClass.specs = this.delArr(this.addClass.specs, index)
      },
      delAttr (index) {
        this.addClass.attrs = this.delArr(this.addClass.attrs, index)
      },
      changeIcon (val) {
        if (val) {
          this.disableIcon = true
        } else {
          this.disableIcon = false
        }
      },
      // utils
      delArr (self, index) {
        return self.slice(0, index).concat(self.slice(index + 1, self.length))
      }
    }
  }
</script>

<style scoped>
  .tip{
    font-size   :12px;
    color       :#999;
    line-height :12px;
    margin      :10px;
  }
</style>
