<template>
  <div class="enu-content">
    <v-card :style="{height: tableHeight + 84 + 'px', 'overflow-y': 'auto'}">
      <v-card-title style="font-size: 16px;" class="pb-0">规则导入</v-card-title>
      <v-card-text class="totalMain">
        <v-row class="px-10" style="height: 100%;flex: 1;width: 100%;">
          <v-col>
            <span class="exportTitle">选择导入规则列表</span>
            <div class="exportMain mt-2">
              <v-row>
                <v-col cols="2" style="text-align: right;" class="pt-0">
                  <v-btn color="primary" block style="height: 40px;border-color: rgba(0,0,0,.14);" @click="uploadDialog = true">选择导入文件</v-btn>
                </v-col>
              </v-row>
              <div :style="[styles, {height: this.tableHeight - 210 + 'px'}]">
                <v-treeview
                  :items="importArray"
                >
                </v-treeview>
              </div>
              <div style="display: flex;align-items: center;">
                <v-checkbox class="mt-2"
                            v-model="isUpgrade"
                            label="升级版本"
                ></v-checkbox>
                <v-tooltip right max-width="360">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="primary"
                      icon
                      small
                      v-bind="attrs"
                      v-on="on"
                      style="margin-top: -5px;margin-left: 10px;"
                    >
                      <v-icon dark dense>
                        mdi-help-circle
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>
                    1、选中时，规则集ID相同的规则集，导入后自动升级本地环境规则集版本号；<br/>
                    2、规则集ID相同时，使用本地规则集版本号；<br/>
                    3、若需导入的规则集，本地不存在时，不管【升级版本】是否选中，导入后自动设定版本为1.0版本。
                  </span>
                </v-tooltip>
              </div>
            </div>
          </v-col>
        </v-row>
        <v-btn
          color="primary"
          large
          style="width: 100px;margin-left: 40px;"
          @click="importDialog = true"
        >
          导入
        </v-btn>
      </v-card-text>
    </v-card>
    <!-- 导入表格 -->
    <v-dialog
      v-model="uploadDialog"
      persistent
      scrollable
      max-width="460px">
      <v-card height="260px">
        <v-card-title>
          <v-toolbar-title>
            导入表格数据
          </v-toolbar-title>
          <div class="flex-grow-1" />
          <v-btn
            icon
            dark
            @click="cancelUpload"
          >
            <v-icon color="#CCCCCC">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-form
            ref="uploadFileForm"
            :lazy-validation="uploadLazy"
            v-model="uploadFormValid">
            <v-row>
              <v-col cols="1"></v-col>
              <v-col cols="10" class="mt-10">
                <v-file-input
                  v-model="fileInfo"
                  required
                  :rules="[v => !!v || '请选择文件']"
                  show-size
                  accept=".zip"
                  :disabled="uploadIsLoading"
                  :loading="uploadIsLoading"
                  prepend-icon=""
                  outlined
                  dense
                  label="点击选择文件，文件后缀为: .zip">
                </v-file-input>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <div class="flex-grow-1" />
          <div>
            <!-- <v-btn
              class="primary mr-4"
              outlined
              style="color:white"
              @click="downloadTemp">下载模板
            </v-btn> -->
            <v-btn
              class="primary mr-4"
              style="margin-right:10px;color:white"
              @click="batchImport"
              :disabled="!uploadFormValid"
            >
              导入
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 导入提示 -->
    <v-dialog
      v-model="importDialog"
      persistent
      width="381"
    >
      <v-card class="pr-4">
        <v-card-title class="headline pt-4">提示</v-card-title>
        <v-card-text class="mt-4">请确认是否导入？</v-card-text>
        <v-card-actions class="pb-4">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            @click="importFile"
          >
            确定
          </v-btn>
          <v-btn
            color="primary"
            outlined
            @click="importDialog = false"
          >
            取消
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 导入成功/失败 -->
    <v-dialog
      v-model="successDialog"
      persistent
      scrollable
      width="540"
    >
      <v-card class="pr-4">
        <v-card-title class="headline pt-4">导入完成</v-card-title>
        <v-card-text class="mt-4" style="height: 200px;">
          <div class="successInfo">
            <div class="mb-2">导入结果：</div>
            <div class="mb-1">导入成功：{{ importInfo.success }}</div>
            <div>导入失败：{{ importInfo.fail }}</div>
            <br>
            <div v-if="importInfo.failDataLis && importInfo.failDataList.length > 0">
              <div class="mb-2">失败详情：</div>
              <div v-for="item in importInfo.failDataList" :key="item.errorDataId">
                {{ item.modelName }} - {{ item.tableNameDesc }}，原因 - {{ item.errorReason }}
              </div>
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="pb-4">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            @click="successDialog = false"
          >
            完成
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 进度条-->
    <loadingOverlays :overlay="overlay" :progress="progress"></loadingOverlays>
    <!-- 公共弹框提示 -->
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
import { rulesetGetTree, rulesetImportRuleset, rulesetMonitorExportProgress } from 'api/ruleSynchronization';
import loadingOverlays from '@c/loadingOverlays';
export default {
  name: 'ruleImport',
  components: {
    loadingOverlays
  },
  data () {
    return {
      overlay: false,
      progress: 0,
      fullHeight: window.innerHeight,
      styles: {
        'overflow-y': 'auto',
        'background': '#fff',
        'border': '1px solid rgba(0,0,0,.14)'
      },
      importArray: [],
      isUpgrade: false,
      // 导入相关
      uploadDialog: false,
      uploadFormValid: true,
      uploadLazy: false,
      fileInfo: null,
      importFileInfo: null,
      uploadIsLoading: false,
      // 导入提示
      importDialog: false,
      importInfo: {},
      exportId: '',
      // 成功
      successDialog: false,
      timeout: 2000,
      isSnackbarTop: true,
      snackbarServe: false,
      snackbarServeMsg: '',
      snackbarServeColor: '' // success', 'info', 'error' 三种类型
    };
  },
  computed: {
    tableHeight: {
      set: function (newValue) {
        this.fullHeight = newValue;
      },
      get: function () {
        return this.fullHeight - 170;
      }
    }
  },
  mounted () {
    window.addEventListener('resize', this.onWindowResize);
  },
  beforeDestory () {
    window.removeEventListener('resize', this.onWindowResize);
  },
  methods: {
    onWindowResize (event) {
      this.tableHeight = window.innerHeight;
    },
    // 随机数
    getRandom () {
      return Math.random().toString(36).slice(2);
    },
    // 导入
    importFile () {
      this.importDialog = false;
      let time = new Date();
      // 自定义导入id
      let exportId = 'trusfort' + time.getFullYear() + (time.getMonth() + 1) + time.getDate() +
        time.getHours() + time.getMinutes() + time.getSeconds() + time.getMilliseconds() + this.getRandom();
      if (!this.importFileInfo) {
        this.snackbarServe = true;
        this.snackbarServeMsg = '请先上传导入文件!';
        this.snackbarServeColor = 'error';
        return;
      }
      this.exportId = exportId; // 导入id
      let formData = new FormData();
      // 把文件信息放入对象中
      formData.append('file', this.importFileInfo); // 导入文件
      formData.append('exportId', exportId); // 导入id
      formData.append('isRiseVersion', this.isUpgrade); // 是否升级版本
      // 显示进度弹窗
      this.overlay = true;
      this.rulesetMonitorExportProgress();
      rulesetImportRuleset(formData).then(res => {
        this.importInfo = res.data.data;
        this.overlay = false;
        this.successDialog = true;
      }).catch(err => {
        this.overlay = false;
        this.snackbarServe = true;
        this.snackbarServeMsg = err.msg;
        this.snackbarServeColor = 'error';
      });
    },
    // 导出按钮进度条
    async rulesetMonitorExportProgress () {
      const response = await rulesetMonitorExportProgress({ exportId: this.exportId });
      if (response.data.code === 200) {
        this.progress = response.data.data.progressBar * 1;
        if (this.progress < 100) { // 判断返回进度是否完成
          setTimeout(() => {
            this.rulesetMonitorExportProgress();
          }, 500);
        } else {
          this.overlay = false;
          this.successDialog = true;
        }
      } else {
        this.overlay = false;
        this.progress = 0;
      }
    },
    // 导入相关
    // 选择并导入
    batchImport () {
      // 判断导入类型必须为zip
      if (this.fileInfo.name.replace(/.+\./, '') !== 'zip') {
        this.snackbarServe = true;
        this.snackbarServeMsg = '请上传zip格式文件!';
        this.snackbarServeColor = 'error';
        return;
      }
      if (this.$refs.uploadFileForm.validate()) {
        this.importFileInfo = this.fileInfo;
        this.uploadIsLoading = true;
        let formData = new FormData();
        // 把文件信息放入对象中
        formData.append('file', this.fileInfo);
        rulesetGetTree(formData).then(res => {
          if (res.data.code === 200) {
            this.importArray = res.data.data;
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'success';
            this.uploadIsLoading = false;
          } else {
            this.importFileInfo = null;
          }
          this.cancelUpload();
        }).catch(err => {
          this.snackbarServe = true;
          this.snackbarServeMsg = err.msg || '导入失败！';
          this.snackbarServeColor = 'error';
          this.uploadIsLoading = false;
          this.cancelUpload();
        });
      }
    },
    // 隐藏导入
    cancelUpload () {
      this.$refs.uploadFileForm.reset();
      this.uploadDialog = false;
      this.uploadIsLoading = false;
    }
  }
};
</script>

<style scoped>
  .totalMain {
    display: flex;
    flex-direction: column;
    height: calc(100% - 64px);
    justify-content: center;
  }
  .exportMain {
    background: var(--v-background-base);
    padding: 12px;
    padding-bottom: 0;
  }
  .exportTitle {
    margin-left: 20px;
  }
  >>> .v-treeview-node--leaf>.v-treeview-node__root {
    padding-left: 8px;
  }
  .headline {
    font-size: 16px !important;
  }
</style>
