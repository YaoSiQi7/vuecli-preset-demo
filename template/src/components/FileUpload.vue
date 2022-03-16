<template>
  <div>
    <v-row no-gutters class="upload-file-content">
      <v-col cols="6">
        <div class="upload_warp">
          <div :class="['upload-btn', isEdit?'':'img-read']" @click="fileClick">
            <img src="../../static/img/upload-btn.png">
          </div>
          <div
            v-if="isEdit"
            class="upload_drop_div"
            @drop="drop($event)"
            @dragenter="dragenter($event)"
            @dragover="dragover($event)"
          >
            <p>点击图标上传文件<br><span style="color: rgba(0, 0, 0, 0.447058823529412);">支持扩展名：.rar .zip .doc .docx .pdf .jpg...</span> </p>
          </div>
          <div class="upload_drop_div" v-else>
            <p>点击图标上传文件<br><span style="color: rgba(0, 0, 0, 0.447058823529412);">支持扩展名：.rar .zip .doc .docx .pdf .jpg...</span> </p>
          </div>
        </div>
        <input
          @change="fileChange($event)"
          type="file"
          :id="'upload_file' + numb"
          multiple
          style="display: none"
        >
      </v-col>
      <v-col cols="6" class="progress-content">
        <div class="file-box">
          <ul>
            <li class="progress-wrapper" v-for="(file,index) in files" :key="index">
              <div class="file-info">
                <v-icon small class="mr-1 icon-file" color="primary">mdi-paperclip</v-icon>
                <span class="file-name ellipsis" :title="file.name" @click="downloadFile(file)">{{file.name}}</span>
              </div>
              <div class="progress">
                  <span :style="{width:file.uploadPercentage,backgroundColor:file.uploadStatus==1 ||file.uploadStatus==2?'':'red'}"></span>
              </div>
              <v-icon small class="icon-close" color="primary" @click="deleteFile(index)" v-if="isEdit">mdi-close</v-icon>
              <div class="fileStatus">
                  <span v-if="file.uploadStatus == -1" class="uploadFail">出错啦，请重新上传或者删除</span>
                  <span v-if="file.uploadStatus == 2" class="uploadSuccess"> 已上传</span>
                  <span v-if="file.uploadStatus == 1" class="uploadSuccess"> 上传中...</span>
                  <span v-if="file.uploadStatus == -2" class="uploadFail">出错啦，文件类型不符合要求</span>
                  <span v-if="file.uploadStatus == -3" class="uploadFail">出错啦，文件大小超出限制</span>
              </div>
            </li>
          </ul>
        </div>
      </v-col>
    </v-row>
  <v-snackbar
      v-model="snackbarServe"
      :timeout="timeout"
      :color="snackbarServeColor"
      :top="isSnackbarTop"
    >
      {{ snackbarServeMsg }}
    </v-snackbar>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'fileUpload',
  data () {
    return {
      files: [],
      filesUrl: [], // 上传文件URL
      // 提示弹框参数
      timeout: 2000,
      isSnackbarTop: true,
      snackbarServe: false,
      snackbarServeMsg: '',
      snackbarServeColor: ''
    };
  },
  props: {
    accessoryArr: {
      type: Array,
      default: () => []
    },
    accessoryUrl: {
      type: Array,
      default: () => ''
    },
    isEdit: {// 已提报的不可上传图片
      type: Boolean,
      default: () => true
    },
    numb: {
      type: Number,
      default: () => 0
    }
  },
  computed: {},
  watch: {
    accessoryArr (val) {
      if (val) {
        this.files = val;
      }
    },
    accessoryUrl (val) {
      if (val) {
        this.filesUrl = val;
      }
    }
  },
  mounted () {},
  methods: {
    downloadFile (file) {
      this.$emit('downloadFileFun', file);
    },
    fileClick () {
      document.getElementById(`${'upload_file' + this.numb}`).click();
    },
    fileChange (el) {
      if (!el.target.files[0].size) return;
      this.fileList(el.target.files);
      el.target.value = '';
    },
    // fileDel (index) {
    //   this.size = this.size - this.imgList[index].file.size;// 总大小
    //   this.imgList.splice(index, 1);
    // },
    // bytesToSize (bytes) {
    //   if (bytes === 0) return '0 B';
    //   let k = 1000; // or 1024
    //   let sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    //   let i = Math.floor(Math.log(bytes) / Math.log(k));
    //   return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
    // },
    dragenter (el) {
      el.stopPropagation();
      el.preventDefault();
    },
    dragover (el) {
      el.stopPropagation();
      el.preventDefault();
    },
    drop (el) {
      el.stopPropagation();
      el.preventDefault();
      this.fileList(el.dataTransfer.files);
    },
    // 上传文件方法
    fileList (files) {
      // if (files.length > 1 || this.files.length > 0) {
      if (files.length > 1) {
        this.snackbarServe = true;
        this.snackbarServeMsg = '每次只能上传一个文件';
        this.snackbarServeColor = 'error';
        return;
      }
      // 获取选定的文件
      let len = files.length;
      if (len > 0) {
        // 开始上传每一个文件
        var item = {
          name: files[0].name,
          uploadPercentage: 1,
          size: this.formatFileSize(files[0].size, 0),
          uploadStatus: 0
        };
        this.files.push(item);
        // 开始上传文件 新建一个formData
        let param = new FormData();
        // param.append('name', 'wiiiiiinney');
        param.append('file', files[0]);// 通过append向form对象添加数据
        // FormData私有类对象，访问不到，可以通过get判断值是否传进去
        // console.log(param.get('file'));
        // 判断大小
        if (!this.checkFileSize(files[0].size)) {
          item.uploadStatus = -3;
          return false;
        }
        // if (!this.checkFileType(files[i].name.split('.')[1])) {
        //   item.uploadStatus = -2;
        //   return false;
        // }
        // 通过axios上传文件
        // 配置
        let token;
        if (localStorage.getItem('token')) {
          token = JSON.parse(localStorage.getItem('token'));
        }
        let config = {
          // 添加请求头
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': token
          },
          // 添加上传进度监听事件
          onUploadProgress: e => {
            var completeProgress = ((e.loaded / e.total * 100) | 0) + '%';
            // console.log(this.files);
            item.uploadPercentage = completeProgress;
          }
        };
        item.uploadStatus = 1;
        axios.post(window.g.address + '/eventsReported/fileUpload', param, config)
          .then(res => {
            // console.log('res==', res.data);
            if (res.data.state === '200') {
              item.uploadStatus = 2;
              this.filesUrl.push(res.data.path);
              let fileIndex = this.files.length - 1;
              this.files[fileIndex].url = res.data.path;
              this.$emit('getFileFun', this.filesUrl);
            } else {
              item.uploadStatus = -1;
            }
          }).catch(error => {
            console.log(error);
            item.uploadStatus = -1;
          });
      }
    },
    deleteFile (index) { // 删除上传的文件
      this.files.splice(index, 1);
      this.filesUrl.splice(index, 1);
      this.$emit('getFileFun', this.filesUrl);
    },
    formatFileSize: function (fileSize, idx) {
      var units = ['B', 'KB', 'MB', 'GB'];
      idx = idx || 0;
      if (fileSize < 1024 || idx === units.length - 1) {
        return fileSize.toFixed(1) + units[idx];
      }
      return this.formatFileSize(fileSize / 1024, ++idx);
    },
    // checkFileType: function (fileType) {
    //   const acceptTypes = ['xls', 'xlsx', 'doc', 'docx', 'jpg', 'png'];
    //   for (var i = 0; i < acceptTypes.length; i++) {
    //     if (fileType === acceptTypes[i]) {
    //       return true;
    //     }
    //   }
    //   return false;
    // },
    checkFileSize: function (fileSize) {
      // 10M
      const MAX_SIZE = 10 * 1024 * 1024;
      if (fileSize > MAX_SIZE) {
        return false;
      }
      return true;
    }
  }
};
</script>
<style lang="stylus" scoped>
  .img-read {
    pointer-events: none;//（禁止鼠标点击事件）
  }
  .ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
// 进度条样式
.progress {
    position: relative;
    height: 8px;
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 0 0 1px 0px #ddd inset;
}

.progress span {
    position: absolute;
    display: inline-block;
    width: 10%;
    height: 100%;
    background-color: #3e97df;
}

.fileStatus {
  position: absolute;
  height: 20px;
  font-size: 10px;
  line-height: 20px;
}

.upload-file-content {
  margin: 40px 0 20px;
}
.input-zone {
  width: 500px;
  color: blue;
  font-size: 14px;
  position: relative;
}

.input-zone input[type='file'] {
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
}
.progress-content {
  display: flex;
  align-items: center;
  .file-box {
    padding-right:20px;
    width: 80%;
    height: 192px;
    overflow-y: auto;
    ul {
      li{
        list-style:none;
      }
    }
  }
}
.file-name {
  display: inline-block;
  height: 26px;
  line-height: 26px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.447058823529412);
  text-align: left;
  width: 88%;
  cursor: pointer;
}
.progress-wrapper {
  position: relative;
  width: 100%;
  margin: 45px 0;
}
.file-info {
  width: 100%;
  height: 24px;
  position: absolute;
  bottom: 10px;
  left: -20px;
}
.icon-file {
  color: rgba(0, 0, 0, 0.447058823529412) !important;
  transform: rotate(30deg);
}
.icon-close {
  position: absolute;
  bottom: 10px;
  right: 0;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.447058823529412) !important;
}

.upload_drop_div {
  width: 100%;
  height: 100%;
  border: 2px dashed #2196f3;
  border-radius: 4px;
  color: #2196f3;
  text-align: center;
  background: rgba(250,250,250,1)
  p {
    position: absolute;
    top: 60%;
    left: 50%;
    transform: translate(-50%, 0);
    width: 100%;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.647058823529412);
  }
}

.upload-btn {
  position: absolute;
  top: 20%;
  left: 45%;
  width: 48px;
  height: 48px;
  border-radius: 4px;
  cursor: pointer;

  img {
    display: inline-block;
    width: 100%;
    height: 100%;
  }
}

.upload_warp {
  margin: 0 auto;
  height: 192px;
  width: 438px;
  border: 2px dashed #2196f3;
  border-radius: 4px;
  position: relative;
}
</style>
