<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-oss__oss">
      <el-form :inline="true" :model="dataForm">
        <el-form-item>
          <el-button type="primary" @click="configHandle()">{{ $t('oss.config') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="uploadHandle()">{{ $t('oss.upload') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="dataListLoading"
        :data="dataList"
        border
        @selection-change="dataListSelectionChangeHandle"
        @sort-change="dataListSortChangeHandle"
        style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column label="缩略图" header-align="center" align="center" width="100">
          <template slot-scope="scope">
            <img :src="scope.row.url+'-square'" style="width:80px;cursor:pointer;" alt="" @click="showImg(scope.row.url)">
          </template>
        </el-table-column>
        <el-table-column prop="url" :label="$t('oss.url')" header-align="center" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.url}}</span>
            <el-button class="tag-read" style="margin-left:15px;" type="text" @click="copy(scope.row.url)">复制链接</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="createDate" :label="$t('oss.createDate')" sortable="custom" header-align="center" align="center" width="180"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
      <!-- 弹窗, 云存储配置 -->
      <config v-if="configVisible" ref="config"></config>
      <!-- 弹窗, 上传文件 -->
      <upload v-if="uploadVisible" ref="upload" @refreshDataList="getDataList"></upload>
    </div>
    <!-- 图片放大 -->
    <el-dialog
      :visible.sync="showImgdialogVisible"
      width="1040px">
      <div style="text-align:center;">
        <img style="min-width:480px;max-width:1000px;" :src="bigImgSrc" alt="">
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import Config from './oss-config'
import Upload from './oss-upload'
import Clipboard from 'clipboard'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/sys/oss/page',
        getDataListIsPage: true,
        deleteURL: '/sys/oss',
        deleteIsBatch: true
      },
      dataForm: {},
      configVisible: false,
      uploadVisible: false,
      showImgdialogVisible: false,
      bigImgSrc: null
    }
  },
  components: {
    Config,
    Upload
  },
  methods: {
    // 云存储配置
    configHandle () {
      this.configVisible = true
      this.$nextTick(() => {
        this.$refs.config.init()
      })
    },
    // 上传文件
    uploadHandle () {
      this.uploadVisible = true
      this.$nextTick(() => {
        this.$refs.upload.init()
      })
    },
    showImg (src) {
      console.log(src)
      this.showImgdialogVisible = true
      this.bigImgSrc = src
    },
    copy (src) {
      var clipboard = new Clipboard('.tag-read', {
        text: function () {
          return src
        }
      })
      clipboard.on('success', e => {
        this.$message.success('复制成功!')
        // 释放内存
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        // 不支持复制
        this.$message.warning('该浏览器不支持自动复制!')
        // 释放内存
        clipboard.destroy()
      })
    }
  }
}
</script>
