<template>
  <el-dialog
    :visible.sync="visible"
    :title="!dataForm.id ? $t('add') : $t('update')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="oncloseDialog"
  >
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
      <div class="title">
        <i class="el-icon-info"></i>
        <span>常规信息</span>
      </div>
      <el-form-item prop="title" :label="$t('news.title')">
        <el-input v-model="dataForm.title"></el-input>
      </el-form-item>
      <el-form-item prop="shortTitle" label="文章短标题">
        <el-input v-model="dataForm.shortTitle"></el-input>
      </el-form-item>
      <el-form-item prop="tag" label="文章标签">
        <el-input v-model="dataForm.tag"></el-input>
      </el-form-item>
      <el-form-item prop="imagePath" label="文章标题图片">
        <el-upload
          id="title_img_uploader"
          v-bind:class="{'cant-add':cantAddImg}"
          list-type="picture-card"
          :action="uploadUrl"
          :limit="3"
          :file-list="imgList"
          :before-upload="uploadBeforeUploadHandle"
          :on-preview="handlePictureCardPreview"
          :on-success="uploadSuccessHandle"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <p class="input-tip">建议使用尺寸200x60像素内的GIF或PNG透明图片</p>
      </el-form-item>
      <el-form-item prop="videoCover" label="视频封面图">
        <el-upload
          id="video_cover_uploader"
          v-bind:class="{'cant-add':videoCoverList.length==1}"
          list-type="picture-card"
          :action="uploadUrl"
          :file-list="videoCoverList"
          :limit="1"
          :on-preview="handlePictureCardPreview"
          :on-success="uploadVideoCoverSuccessHandle"
          :on-remove="removeVideoCoverhandle"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <p class="input-tip">建议使用尺寸200x60像素内的GIF或PNG透明图片</p>
      </el-form-item>
      <el-form-item label="上传视频" prop="videoPath">
        <el-upload
          :action="uploadUrl"
          :show-file-list="false"
          :on-success="onUploadVideoSuccess"
          class="upload-wrap"
        >
          <el-input v-model="dataForm.videoPath" placeholder="点击上传"></el-input>
        </el-upload>
        <video v-if="dataForm.videoPath" width="320" height="240" controls="controls">
          <source :src="dataForm.videoPath">
        </video>
      </el-form-item>
      <el-form-item prop="author" label="文章作者">
        <el-input v-model="dataForm.author"></el-input>
      </el-form-item>
      <el-form-item prop="source" label="文章来源">
        <el-input v-model="dataForm.source"></el-input>
      </el-form-item>
      <el-form-item prop="url" label="文章来源链接">
        <el-input v-model="dataForm.url"></el-input>
      </el-form-item>
      <el-form-item prop="classIds" label="文章分类" :required="true">
        <el-cascader :options="classList" v-model="dataForm.classIds" clearable :change-on-select="true" :before-filter="beforeFilter" :props="props"></el-cascader>
      </el-form-item>
      <el-form-item prop="keyword" label="文章关键字">
        <el-input v-model="dataForm.keyword"></el-input>
        <p class="input-tip">多个关键字要用英文逗号“,”隔开</p>
      </el-form-item>
      <el-form-item prop="summary" label="文章摘要">
        <el-input type="textarea" v-model="dataForm.summary"></el-input>
      </el-form-item>
      <div class="title">
        <i class="el-icon-info"></i>
        <span>文章内容</span>
      </div>
      <el-form-item prop="content" :label="$t('news.content')">
        <!-- 富文本编辑器, 容器 -->
        <div id="J_quillEditor" style="height:400px;"></div>
        <!-- 自定义上传图片功能 (使用element upload组件) -->
        <el-upload
          :action="uploadUrl"
          :show-file-list="false"
          :before-upload="uploadBeforeUploadHandle"
          :on-success="uploadSuccessHandle2"
          style="display: none;"
        >
          <el-button ref="uploadBtn" type="primary" size="small">{{ $t('upload.button') }}</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章附件">
        <el-upload
          class="upload-demo"
          :action="uploadUrl"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div
            v-if="dataForm.attachmentPath"
            style="font-size:12px;color:#666;"
          >{{dataForm.attachmentPath}}</div>
          <div slot="tip" class="el-upload__tip">上传附件类型必须是zip格式</div>
        </el-upload>
      </el-form-item>
      <div class="title">
        <i class="el-icon-info"></i>
        <span>文章阐述</span>
      </div>
      <el-form-item prop="commendFlag" label="是否推荐">
        <el-switch
          v-model="dataForm.commendFlag"
          active-color="#13ce66"
          inactive-color="#ff4949"
          :active-value="1"
          :inactive-value="0"
        ></el-switch>
      </el-form-item>
      <el-form-item prop="commentFlag" label="是否允许评论">
        <el-switch
          v-model="dataForm.commentFlag"
          active-color="#13ce66"
          inactive-color="#ff4949"
          :active-value="1"
          :inactive-value="0"
        ></el-switch>
      </el-form-item>
      <el-form-item prop="sort" label="文章排序">
        <el-input v-model="dataForm.sort"></el-input>
      </el-form-item>
      <el-form-item prop="click" label="文章点击量">
        <el-input v-model="dataForm.click" disabled>
          <template slot="append">次</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="commentCount" label="文章评论数">
        <el-input v-model="dataForm.commentCount" disabled>
          <template slot="append">次</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="shareCount" label="文章分享数">
        <el-input v-model="dataForm.shareCount" disabled>
          <template slot="append">次</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="praiseCount" label="文章点赞数">
        <el-input v-model="dataForm.praiseCount" disabled>
          <template slot="append">次</template>
        </el-input>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import Cookies from "js-cookie";
  import debounce from "lodash/debounce";
  import "quill/dist/quill.snow.css";
  import Quill from "quill";
  import {htmlDecode, htmlEncode} from "@/utils";

  export default {
  data() {
    return {
      visible: false,
      uploadUrl: "",
      quillEditor: null,
      quillEditorToolbarOptions: [
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block", "image"],
        [{ header: 1 }, { header: 2 }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ direction: "rtl" }],
        [{ size: ["small", false, "large", "huge"] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],
        ["clean"]
      ],
      classList: [],
      props: {
        value: "id",
        label: "name",
        children: "children"
      },
      dataForm: {
        id: "",
        title: "",
        shortTitle: "",
        tag: "",
        imagePath: null,
        imgArr: [],
        author: "",
        source: "",
        url: "",
        classIds: [],
        keyword: "",
        summary: "",
        content: "",
        attachmentPath: "",
        commendFlag: 1,
        commentFlag: 1,
        videoCover: "",
        videoPath: "",
        sort: ""
      },
      cantAddImg: false,
      imgList: [],
      videoCoverList: [],
      dataRule: {
        title: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur"
          }
        ],
        classId: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    init() {
      this.visible = true;
      this.$nextTick(() => {
        if (this.quillEditor) {
          this.quillEditor.deleteText(0, this.quillEditor.getLength());
        } else {
          this.quillEditorHandle();
        }
        this.$refs["dataForm"].resetFields();
        if (this.dataForm.id) {
          this.getInfo();
        }
        this.dataForm = {
          id: "",
          title: "",
          shortTitle: "",
          tag: "",
          imagePath: null,
          imgArr: [],
          author: "",
          source: "",
          url: "",
          classIds: [],
          keyword: "",
          summary: "",
          content: "",
          attachmentPath: "",
          commendFlag: 1,
          commentFlag: 1,
          videoCover: "",
          videoPath: "",
          sort: ""
        };
        this.getCates();
      });
      this.uploadUrl = `${window.SITE_CONFIG['OPEN_API_HOME']}/sys/oss/upload?token=${Cookies.get("token")}`;
    },
    // getClass() {
    //   this.$http
    //     .get("sys/articleclass/all")
    //     .then(({ data: res }) => {
    //       if (res.code !== 0) {
    //         return this.$message.error(res.msg);
    //       }
    //       this.classList = res.data;
    //     })
    //     .catch(() => {});
    // },
    getCates(){
      this.$http({
        url: window.SITE_CONFIG['OPEN_API_HOME'] + "sys/articleclass/all",
        method: "get"
      }).then(({data}) => {
        let temp = data.data;
        // 删除最后一层多余的children
        for(let i = 0; i < temp.length; i++){
          temp[i].label = temp[i].name
          temp[i].value = temp[i].id
          for(let j = 0; j < temp[i].children.length; j++){
            temp[i].children[j].label = temp[i].children[j].name
            temp[i].children[j].value = temp[i].children[j].id
            delete temp[i].children[j]["children"];
          }
        }
        this.classList = temp;
      });
    },
    beforeFilter(value) {
      // console.log(value)
    },
    // 获取信息
    getInfo() {
      this.$http
        .get(window.SITE_CONFIG['OPEN_API_HOME'] + `sys/article/${this.dataForm.id}`)
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          }
          let data = res.data;
          // console.log(data)
          data.classIds = data.classIds.split(",");
          this.dataForm = data;
          this.quillEditor.root.innerHTML = htmlDecode(this.dataForm.content);
          // console.log(this.quillEditor.root.innerHTML)
          this.dataForm.imgArr = data.imagePath.split(",");
          for (let i in this.dataForm.imgArr) {
            let url = this.dataForm.imgArr[i];
            if (url) {
              this.imgList.push({
                name: this.dataForm.imgArr[i],
                url: this.dataForm.imgArr[i]
              });
            }
          }
          if (data.videoCover) {
            this.videoCoverList = [
              {
                name: data.videoCover,
                url: data.videoCover
              }
            ];
          }

          this.cantAddImg = this.dataForm.imgArr.length >= 3;
        })
        .catch(() => {});
    },
    // 富文本编辑器
    quillEditorHandle() {
      let editor = (this.quillEditor = new Quill("#J_quillEditor", {
        modules: {
          toolbar: this.quillEditorToolbarOptions
        },
        theme: "snow"
      }));
      // 自定义上传图片功能 (使用element upload组件)
      this.uploadUrl = `${window.SITE_CONFIG['OPEN_API_HOME']}/sys/oss/upload?token=${Cookies.get("token")}`;
      this.quillEditor.getModule("toolbar").addHandler("image", () => {
        this.$refs.uploadBtn.$el.click();
      });
      // 监听内容变化，动态赋值
      this.quillEditor.on("text-change", () => {
        // console.log(this.quillEditor.root.innerHTML)
        this.dataForm.content = htmlEncode(this.quillEditor.root.innerHTML);
      });
    },

    handleRemove(file, fileList) {
      this.dataForm.imgArr = [];
      if (fileList.length == 0) {
        return;
      }
      // console.log(fileList)
      for (let i in fileList) {
        let respData = fileList[i];
        this.dataForm.imgArr.push(
          respData.response ? respData.response.data.src : respData.url
        );
      }
      this.cantAddImg = this.dataForm.imgArr.length >= 3;
    },
    // 删除视频封面
    removeVideoCoverhandle(file, fileList) {
      this.dataForm.videoCover = null;
      this.videoCoverList = fileList;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 上传图片之前
    uploadBeforeUploadHandle(file) {
      if (
        file.type !== "image/jpg" &&
        file.type !== "image/jpeg" &&
        file.type !== "image/png" &&
        file.type !== "image/gif"
      ) {
        this.$message.error("只支持jpg、png、gif格式的图片！");
        return false;
      }
    },
    // 上传图片成功
    uploadSuccessHandle(res, file, fileList) {
      if (res.code !== 0) {
        return this.$message.error(res.msg);
      }
      this.dataForm.imgArr.push(res.data.src);
      this.cantAddImg = this.dataForm.imgArr.length >= 3;
    },
    // 上传图片成功
    uploadSuccessHandle2(res, file, fileList) {
      if (res.code !== 0) {
        return this.$message.error(res.msg);
      }
      this.quillEditor.insertEmbed(
        this.quillEditor.getSelection().index,
        "image",
        res.data.src
      );
    },
    // 上传视频封面成功
    uploadVideoCoverSuccessHandle(res, file, fileList) {
      if (res.code !== 0) {
        return this.$message.error(res.msg);
      }
      this.dataForm.videoCover = res.data.src;
      this.videoCoverList = fileList;
    },
    // onProgress
    onProgress() {},
    onUploadVideoSuccess(res, file) {
      if (!res) {
        return this.$message.error("网络异常请稍后再试");
      }
      if (res.code !== 0) {
        return this.$message.error(res.msg);
      }
      this.dataForm.videoPath = res.data.src;
    },
    // 附件上传处理
    handleAvatarSuccess(res, file) {
      // console.log(res)
      if (res.code === 0) {
        this.dataForm.attachmentPath = res.data.url;
      } else {
        this.$message.error(res.msg);
      }
    },
    // 关闭
    oncloseDialog() {
      // console.log('oncloseDialog')
      this.dataForm = {};
      this.videoCoverList = this.imgList = [];
      this.cantAddImg = false;
    },

    // 表单提交
    dataFormSubmitHandle: debounce(
      function() {
        this.$refs["dataForm"].validate(valid => {
          if (!valid) {
            return false;
          }
          let newForm = {};
          for (let key in this.dataForm) {
            newForm[key] = this.dataForm[key];
          }
          newForm.classIds = newForm.classIds.join();
          newForm.imagePath = newForm.imgArr.join();
          // newForm.classId.delete()
          // console.log(newForm)
          this.$http[!this.dataForm.id ? "post" : "put"](
            window.SITE_CONFIG['OPEN_API_HOME'] + "sys/article",
            newForm,
            { headers: { "content-type": "application/x-www-form-urlencoded" } }
          )
            .then(({ data: res }) => {
              if (res.code !== 0) {
                return this.$message.error(res.msg);
              }
              this.$message({
                message: this.$t("prompt.success"),
                type: "success",
                duration: 800,
                onClose: () => {
                  this.visible = false;
                  this.$emit("refreshDataList");
                }
              });
            })
            .catch(() => {});
        });
      },
      1000,
      { leading: true, trailing: false }
    )
  }
};
</script>

<style scoped>
.title {
  font-size: 20px;
  margin: 24px 0;
  color: #333;
}
</style>
<style>
#title_img_uploader.cant-add .el-upload--picture-card {
  display: none;
}

#video_cover_uploader.cant-add .el-upload--picture-card {
  display: none;
}

.upload-wrap .el-upload {
  display: block;
}
</style>
