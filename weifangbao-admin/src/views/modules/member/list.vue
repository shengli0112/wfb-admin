<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-demo__news">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="search()">
        <el-form-item>
          <el-input v-model="dataForm.mobile" placeholder="输入手机号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.nickname" placeholder="输入用户昵称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.realname" placeholder="输入真实姓名" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="dataForm.isRealAuth" placeholder="是否认证" clearable>
            <el-option label="否" :value="0"></el-option>
            <el-option label="是" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item>
           <el-input v-model="dataForm.isRealAuth" placeholder="是否认证(0=否 1=是)" clearable></el-input>
         </el-form-item> -->
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
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column label="头像" header-align="center" align="left" width="95">
          <template slot-scope="scope">
            <div>
              <img class="userHeadimg" :src="scope.row.avatar" alt="">
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="memLevel" label="手机号" header-align="center" align="center">
          <template slot-scope="scope">
            {{scope.row.mobile}}
          </template>
        </el-table-column>
        <el-table-column label="用户ID" header-align="center" align="center">
          <template slot-scope="scope">
            {{scope.row.id}}
          </template>
        </el-table-column>
        <el-table-column prop="" label="用户昵称" header-align="center" align="center">
          <template slot-scope="scope">
            {{scope.row.nickname}}
          </template>
        </el-table-column>
        <el-table-column prop="" label="真实姓名" header-align="center" align="center">
          <template slot-scope="scope">
            {{scope.row.realname}}
          </template>
        </el-table-column>
        <el-table-column label="启用状态" header-align="center" align="center">
          <template slot-scope="scope">
            <div>
              <el-tag v-if="scope.row.isLocked === 1 " size="small" type="danger">禁用</el-tag>
              <el-tag v-else size="small" type="success">已启用</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="是否认证" header-align="center" align="center">
          <template slot-scope="scope">
            <div>
              <el-tag v-if="scope.row.isRealAuth === 0 " size="small" type="danger">未认证</el-tag>
              <el-tag v-else size="small" type="success">已认证</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="200">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="showDetail(scope.row.id)">详情</el-button>
            <el-button type="text" size="small" @click="showSuperior(scope.row.pid)">查看上级</el-button>
            <el-button type="text" size="small" @click="showNext(scope.row.id)">查看下级</el-button>
            <!-- <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
          :current-page="page"
          :page-sizes="[2,5,10, 20, 50, 100]"
          :page-size="limit"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="pageSizeChangeHandle"
          @current-change="pageCurrentChangeHandle"
      ></el-pagination>
      <!-- 详情弹窗 -->
      <el-dialog width='80%' :close-on-click-modal="false" v-if="dialogEditVisible1" :title="'经纪人详情'"
                 :visible.sync="dialogEditVisible1">
        <table class="history-table">
          <tr>
            <td class="bg-dark">用户头像：</td>
            <td><img :src="detail.avatar" alt="" class="cmpUserimg"></td>
          </tr>
          <tr>
            <td class="bg-dark">手机号：</td>
            <td class="info-cont">{{detail.nickname}}</td>
          </tr>
          <tr>
            <td class="bg-dark">用户ID：</td>
            <td class="info-cont">{{detail.id}}</td>
          </tr>
          <tr>
            <td class="bg-dark">昵称：</td>
            <td class="info-cont">{{detail.nickname}}</td>
          </tr>
          <tr>
            <td class="bg-dark">真实姓名：</td>

            <td class="info-cont">
              <el-input style="width: 200px;" v-model="detail.realname" placeholder="输入会员真实姓名" clearable></el-input>
            </td>
          </tr>
          <tr>
            <td class="bg-dark">公司名称：</td>
            <td class="info-cont">{{detail.companyName}}</td>
          </tr>
          <tr>
            <td class="bg-dark">门店地址：</td>
            <td class="info-cont">{{detail.companyAddress}}</td>
          </tr>
          <tr>
            <td class="bg-dark">营业执照：</td>
            <td><img :src="detail.businessLicense" style="max-height:200px; max-width: 200px; cursor:zoom-in;float:left;" alt=""
                     @click="showBigImg(info.businessLicense)"></td>
          </tr>
          <tr>
            <td class="bg-dark">认证状态：</td>
            <td class="info-cont">{{detail.statusName}}</td>
          </tr>
          <tr>
            <td class="bg-dark">注册时间：</td>
            <td class="info-cont">{{detail.createDate}}</td>
          </tr>
        </table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogEditVisible1 = false">取消</el-button>
          <el-button type="primary" @click="changeRealName(),dialogEditVisible1 = false">确定</el-button>
        </div>
      </el-dialog>
      <!-- 上下级弹窗-->
      <el-dialog width='80%' :close-on-click-modal="false" v-if="dialogEditVisible2" :title="dialogEditVisible2Title"
                 :visible.sync="dialogEditVisible2">
        <el-table
            v-loading="detailDataLoading"
            :data="next"
            border
            @selection-change="dataListSelectionChangeHandle"
            @sort-change="dataListSortChangeHandle"
            style="width: 100%;"
        >
          <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
          <el-table-column label="头像" header-align="center" align="left" width="95">
            <template slot-scope="scope">
              <div>
                <img class="userHeadimg" :src="scope.row.avatar" alt="">
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="memLevel" label="手机号" header-align="center" align="center">
            <template slot-scope="scope">
              {{scope.row.mobile}}
            </template>
          </el-table-column>
          <el-table-column prop="" label="用户昵称" header-align="center" align="center">
            <template slot-scope="scope">
              {{scope.row.nickname}}
            </template>
          </el-table-column>
          <el-table-column label="是否认证" header-align="center" align="center">
            <template slot-scope="scope">
              <div>
                <el-tag v-if="scope.row.isRealAuth === 0 " size="small" type="danger">未认证</el-tag>
                <el-tag v-else size="small" type="success">已认证</el-tag>
              </div>
            </template>
          </el-table-column>
          <!--          <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="200">-->
          <!--            <template slot-scope="scope">-->
          <!--              <el-button type="text" size="small">详情</el-button>-->
          <!--              <el-button type="text" size="small">查看下级</el-button>-->
          <!--              &lt;!&ndash; <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>&ndash;&gt;-->
          <!--            </template>-->
          <!--          </el-table-column>-->
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogEditVisible2 = false">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </el-card>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    // import QRCode from 'qrcode'

    export default {
        mixins    :[mixinViewModule],
        data(){
            return {
                detailId               :'',
                mixinViewModuleOptions :{
                    getDataListURL   :'/member/page',
                    getDataListIsPage:true,
                    getDetailURL     :'/member/',
                    showDetail       :true
                },
                visible                :false,
                code                   :'',
                detail                 :{},
                lvList                 :[],
                link                   :'',
                dataForm               :{
                    id      :'',
                    mobile  :'',
                    email   :'',
                    nickName:'',
                    level   :null,
                    pId     :null,
                },
                detailDataLoading      :false,
                dataListLoading        :false,
                dialogEditVisible1     :false,
                dialogEditVisible2     :false,
                dialogEditVisible2Title:'',
                dataList               :[],
                next                   :[],
            }
        },
        methods   :{
            //显示详情
            showDetail(id){
                this.dialogEditVisible1 = true
                this.detailId           = id;
                this.getDetail(id)
            },
            //显示上级
            showSuperior(pid){
                this.dialogEditVisible2      = true
                this.dialogEditVisible2Title = '上级用户列表';
                this.getNext('id', pid);
            },
            //显示下级
            showNext(id){
                this.dialogEditVisible2      = true
                this.dialogEditVisible2Title = '下级用户列表';
                this.getNext('pId', id);
            },
            //获取详情
            getDetail(id){
                this.$http.get(`member/` + id).then(({data:res}) => {
                    if(res.code !== 0){
                        return this.$message.error(res.msg)
                    }
                    this.detail = res.data
                }).catch(() => {
                })
            },
            //显示下级
            getNext(key, id){
                console.warn(key, id)
                if(!key || !id){
                    this.next = [];
                    return false
                }
                this.$http.get(`member/page?${key}=${id}`).then(({data:res}) => {
                    if(res.code !== 0){
                        return this.$message.error(res.msg)
                    }
                    // pId = this.id
                    this.next = res.data.list
                    // console.log(this.next)
                }).catch(() => {
                })
            },
            changeRealName(id){
                this.$http.put(`member/`, {id:this.detailId, realname:this.detail.realname}).then(({data:res}) => {
                    if(res.code !== 0){
                        return this.$message.error(res.msg)
                    }
                    this.detail = res.data
                    this.$message({
                        message :'操作成功',
                        type    :'success',
                        duration:800,
                        onClose :() => {
                            this.getDataList()
                        }
                    })
                }).catch(() => {

                })
            },
        },
        watch     :{},
        components:{},
    }
</script>

<style scoped>
  .cmpUserimg{
    width      :80px;
    height     :80px;
    margin-top :2px;
    float      :left;
  }

  .userHeadimg{
    width      :80px;
    height     :80px;
    float      :left;
    margin-top :2px;
    /* border-radius: 50%; */
  }

  .history-table{
    width           :90%;
    margin          :0 auto 20px;
    border-collapse :collapse;
  }

  .history-table tr td{
    border     :1px solid #d8d8d8;
    text-align :center;
    height     :50px;
    word-wrap  :break-word;
  }

  .table-head{
    font-size        :16px;
    font-weight      :bold;
    background-color :rgb(249, 250, 252);
  }

  .info-topic{
    text-align   :left !important;
    padding-left :10px;
  }

  .bg-dark{
    background-color :rgb(249, 250, 252);
    width            :160px;
  }

  .info-cont{
    min-width    :200px;
    text-align   :left !important;
    padding-left :10px;
  }

  .ly-c{
    display         :flex;
    flex-direction  :column;
    justify-content :center;
    align-items     :center;
  }

  .print{
    position :absolute;
    top      :0;
    right    :0;
  }

  .imgtitle{
    width :300px;
  }

  .pr{
    position :relative;
  }
</style>
