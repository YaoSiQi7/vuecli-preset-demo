<!--author：Fc -->
<!--updateTime：2021-06-01-->
<template>
  <div>
    <v-card class="mb-3 mt-3 elevation-3 pt-3" :style="{ height: tableHeight + 'px'}">
      <div class="authorizeCon pb-12">
        <h3 class="authorizeTitle pl-5 py-3">授权信息</h3>
        <!--未授权-->
        <div class="formal px-10 pt-8" v-if="authorizeInfo.authorizationStatus === '未授权' || authorizeInfo.authorizationStatus === '授权错误'">
          <div class="unauthorized d-flex align-center">
            <div class="oneHundred mr-4">当前授权类型：</div>
            <div style="color: #f4c79b;font-size: 18px;">{{authorizeInfo.authorizationStatus === '未授权' ? '未授权' : '授权失败'}}</div>
            <v-btn class="ml-6" depressed color="primary" height="36" @click="showDialog('立即授权')">
              {{authorizeInfo.authorizationStatus === '未授权' ? '立即授权' : '重新授权'}}</v-btn>
          </div>
          <v-list>
            <v-list-item class="px-0">
              <v-list-item-content>
                <div class="ruleSetParam">
                  <v-row>
                    <v-col cols="12">
                      <p><span class="oneHundred mr-4">失败原因：</span>{{ authorizeInfo.authorizationMsg }}</p>
                    </v-col>
                  </v-row>
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </div>

        <!--正式版本2测试版本2授权过期-->
        <div class="formal px-10 pt-8" v-else>
          <div class="unauthorized d-flex align-center">
            <div class="oneHundred mr-4">当前授权类型：</div>
            <!--正式版本-->
            <div style="color: #6ed9ba;font-size: 18px;" v-if="authorizeInfo.authorizationType === '正式版本'">正式版本</div>
            <!--测试版本-->
            <div style="color: #4473da;font-size: 18px;" v-if="authorizeInfo.authorizationType === '测试版本'">测试版本</div>
            <!--授权过期-->
            <div style="color: #fe8894;font-size: 18px;" v-if="authorizeInfo.authorizationStatus === '授权过期' || authorizeInfo.authorizationStatus === '授权已过期'">授权已过期</div>
            <v-btn class="ml-6" depressed color="primary" height="36" @click="showDialog('更新授权')">更新授权</v-btn>
          </div>
          <v-list>
            <v-list-item class="px-0">
              <v-list-item-content>
                <div class="ruleSetParam">
                  <v-row>
                    <!--<v-col cols="6">
                      <p><span class="oneHundred mr-4">被授权人：</span>青岛银行股份有限公司</p>
                    </v-col>-->
                    <v-col cols="6">
                      <p><span class="oneHundred mr-4">产品名称：</span>{{ authorizeInfo.productionName }}</p>
                    </v-col>
                    <v-col cols="6">
                      <p><span class="oneHundred mr-4">授权应用数：</span>{{ authorizeInfo.appNum }}</p>
                    </v-col>
                  </v-row>
                </div>
                <div class="ruleSetParam">
                  <v-row>
                    <v-col cols="6">
                      <p>
                        <span class="oneHundred mr-4">授权有效期：</span>
                        <span :style="{ color: authorizeInfo.authorizationStatus === '授权过期' || authorizeInfo.authorizationStatus === '授权已过期' ? '#fe8894' : '' }">
                          {{ authorizeInfo.authorizationStatus === '长期有效' ? authorizeInfo.authorizationStatus : authorizeInfo.timeLimit }}
                        </span>
                      </p>
                    </v-col>
                  </v-row>
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </div>
      </div>
    </v-card>
    <v-dialog
      v-model="dialog"
      persistent
      scrollable
      max-width="500px"
    >
      <v-card>
        <v-card-title>
          <v-toolbar-title>
            {{ authorizeName }}
          </v-toolbar-title>
          <div class="flex-grow-1" />
          <v-btn
            icon
            dark
            @click="hideDialog"
          >
            <v-icon color="var(--v-headerCloseIconColor-base)">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-form
            ref="uploadFileForm"
            :lazy-validation="lazy"
            v-model="uploadFormValid"
          >
            <v-row>
              <v-col cols="3" class="px-0 pt-5">*选择授权文件：</v-col>
              <v-col cols="9" class="px-0">
                <v-file-input
                  ref="uploadFileInput"
                  id="uploadFileInput"
                  height="32"
                  v-model="fileInfo"
                  required
                  :rules="[(v) => !!v || '请选择文件']"
                  show-size
                  accept=".lic"
                  :disabled="uploadIsLoading"
                  :loading="uploadIsLoading"
                  outlined
                  dense
                  prepend-icon=""
                  label="授权文件"
                >
                  <template v-slot:append-outer>
                    <v-btn class="ml-4 selectBtn" depressed color="primary">
                      <label class="d-flex align-center justify-center" for="uploadFileInput">
                        选择
                      </label>
                    </v-btn>
                  </template>
                </v-file-input>
              </v-col>
            </v-row>
          </v-form>
          <v-row style="font-size: 13px;" class="mb-6">
            备注：生成授权文件前，请先
            <a href="javascript:;" style="text-decoration: underline;display: contents;" @click="downloadLicAuthFileFn">下载绑定设备码</a>，并将绑定设备码文件提供给北京芯盾时代科技有限公司。
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <div class="flex-grow-1" />
          <div>
            <v-btn
              class="cancelButton mr-4"
              outlined
              @click="hideDialog">
              取消
            </v-btn>
            <v-btn
              class="primary mr-4"
              style="margin-right:10px;color:white" @click="updateLicAuthFn">
              提交
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="snackbarServe"
      :timeout="timeout"
      :color="snackbarServeColor"
      :top="isSnackbarTop"
    >
      {{ snackbarServeMsg }}
    </v-snackbar>
    <v-dialog
      v-model="loginOut"
      persistent
      width="381"
    >
      <v-card class="del-dialog">
        <v-card-title class="del-dialog-title">
          授权成功,请退出登录重新登录！
        </v-card-title>
        <v-card-actions style="margin-right:12px;margin-top:10px;">
          <div class="flex-grow-1" />
          <v-btn
            color="primary"
            text
            class="del-dialog-btn"
            @click="loginOut = false"
          >
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {
  queryLicAuthInfo,
  updateLicAuth,
  downloadLicAuthFile
} from '../../api/ApplyManage';
import { importData } from 'api/UserManage';
export default {
  name: 'authorizeManage',
  data () {
    return {
      // 提示语
      snackbarServe: false,
      snackbarServeMsg: '',
      snackbarServeColor: '', // success', 'info', 'error' 三种类型
      isSnackbarTop: true,
      timeout: 1500,
      fullHeight: window.innerHeight,
      dialog: false,
      lazy: false,
      uploadFormValid: true,
      uploadIsLoading: false,
      authorizeName: '立即授权',
      fileInfo: null,
      authorizeInfo: {},
      loginOut: false
    };
  },
  computed: {
    tableHeight: {
      set: function (newValue) {
        this.fullHeight = newValue;
      },
      get: function () {
        return this.fullHeight - 104;
      }
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onWindowResize);
  },
  mounted () {
    this.queryLicAuthInfoFn();
  },
  methods: {
    queryLicAuthInfoFn () {
      let parms = {};
      queryLicAuthInfo(parms).then(res => {
        if (res.data.code === 200) {
          this.authorizeInfo = res.data.data;
        } else {
          this.message(res.data.msg, 'error');
        }
      }, err => {
        this.message(err.data.msg, 'error');
      });
    },
    downloadLicAuthFileFn () {
      const params = {};
      downloadLicAuthFile(params).then(response => {
        let blob = new Blob([response.data], { type: 'application/vnd.ms-excel;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const filename = '设备绑定码' + '.req';
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }).catch(err => {
        this.snackbarError = true;
        this.snackbarServeMsg = err.msg;
        this.snackbarServeColor = 'error';
      });
    },
    updateLicAuthFn () {
      if (!this.fileInfo) {
        this.message('请上传授权文件！', 'error');
        return;
      }
      let formData = new FormData();
      // 把文件信息放入对象中
      formData.append('file', this.fileInfo);
      updateLicAuth(formData).then(res => {
        let data = JSON.parse(res.data.data);
        if (data.result === 0) {
          this.queryLicAuthInfoFn();
          // this.message('授权成功,请退出登录重新登录！', 'success');
          this.hideDialog();
          this.loginOut = true;
        } else {
          this.message('授权失败！', 'error');
        }
      }).catch(err => {
        this.message(err.data.msg, 'error');
      });
    },
    // 提示语状态
    message (str, theme) {
      this.snackbarServe = true;
      this.snackbarServeMsg = str;
      this.snackbarServeColor = theme || 'error';
    },
    onWindowResize (event) {
      this.tableHeight = window.innerHeight;
    },
    hideDialog () {
      this.fileInfo = null;
      this.dialog = false;
    },
    showDialog (titleName) {
      this.authorizeName = titleName;
      this.dialog = true;
    }
  }
};
</script>

<style scoped>
  .authorizeCon {
    border: 1px solid #F3F3F3;
    margin: 30px auto 0;
    width: 90%;
    border-radius: 0 !important;
  }
  .authorizeTitle {
    background: #F3F3F3;
  }
  .oneHundred {
    display: inline-block;
    width: 100px;
  }
  >>> .selectBtn > .v-btn__content, .selectBtn label{
    display: block;
    width: 200%;
    height: 100%;
  }
  .selectBtn label {
    width: 100%;
    cursor: pointer;
  }
</style>
