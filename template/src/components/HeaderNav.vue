<!-- author: 古雪瑞-->
<!-- updateTime: 2020-04-07-->
<template>
  <div
    class="d-flex flex-nowrap mb-3 main-headernav"
  >
    <v-breadcrumbs :items="navItems" divider=">">
      <v-breadcrumbs-item
        slot="item"
        slot-scope="{ item }"
        exact
        :to="item.to"
        :disabled="item.disabled"
        @click="handleClickBreadCrumbs(item)"
      >
        {{ item.text }}
      </v-breadcrumbs-item>
    </v-breadcrumbs>
    <v-spacer></v-spacer>
    <v-menu bottom max-height="500">
      <template v-slot:activator="{ on }">
        <v-hover>
          <v-chip
            :disabled="chipDisable || pagePath === '/sceneStrategy'"
            slot-scope="{ hover }"
            :class="`elevation-${hover ? 5 : 3}`"
            v-ripple
            class="pl-0 header-btn mr-2 reset-chip-style"
            outlined
            v-on="on"
            v-show="switchApplication"
          >
            <v-avatar>
              <v-icon>mdi-view-grid</v-icon>
            </v-avatar>
            <span class="mr-2">{{ chipDisable==true ? '全部应用' : appName }}</span>
          </v-chip>
        </v-hover>
      </template>

      <v-list>
        <v-list-item
          v-for="(item, i) in appList"
          :key="i"
          @change="toggleApp(item)"
        >
          <v-list-item-title>{{ item.appName }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-menu bottom>
      <template v-slot:activator="{ on }">
        <v-hover>
          <v-chip
            slot-scope="{ hover }"
            :class="`elevation-${hover ? 5 : 3}`"
            v-ripple
            class="pl-0 header-btn mr-2 reset-chip-style"
            outlined
            v-on="on"
          >
            <v-avatar>
              <v-icon>mdi-account</v-icon>
            </v-avatar>
            <span class="mr-2">{{realName}}</span>
          </v-chip>
        </v-hover>
      </template>

      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          @click="selectFeature(item)"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-dialog
      v-model="colorPickDialog"
      max-width="500px"
    >
      <v-card>
        <v-card-title
          :style="colorObj"
          class="justify-left"
        >
          <v-toolbar-title style="color:white;padding-bottom:4px">
            调色板
          </v-toolbar-title>
          <div class="flex-grow-1" />
          <v-btn
            icon
            dark
            @click="colorPickDialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <template>
          <v-container>
            <v-row>
              <v-col
                cols="12"
                md="4"
              >
                <div class="my-4 mt-0">
                  请选择颜色
                </div>
                <v-btn
                  v-for="(color,index) in historyColorList"
                  v-show="isPickColor"
                  :key="index"
                  class="mx-auto mt-4"
                  block
                  :color="color"
                  style="color:#fff"
                  @click="applyColor(color)"
                >
                  应用颜色
                </v-btn>
                <v-btn
                  class="mx-auto mt-4"
                  block
                  :color="defaultGlobalPrimaryColor"
                  style="color: #fff"
                  @click="applyColor(defaultGlobalPrimaryColor)"
                >
                  恢复默认
                </v-btn>
              </v-col>
              <v-col
                class="d-flex justify-center"
                @click="isPickColor = true"
              >
                <v-color-picker
                  v-model="color"
                  show-swatches
                  @input="setColor"
                />
              </v-col>
            </v-row>
          </v-container>
        </template>
      </v-card>
    </v-dialog>
    <!-- 修改密码 -->
    <v-dialog
      v-model="isWhetherShow"
      persistent
      width="500"
    >
      <v-card>
        <v-card-title>
          <div class="flex-grow-1" />
          <v-btn
            icon
            dark
            @click="cancelDialog"
          >
            <v-icon color="#CCCCCC">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text style="max-height: 600px;">
          <v-container>
            <slot>
              <div>
                <v-form
                  ref="editPwdForm"
                  v-model="editVaild"
                  class="form"
                  :lazy-validation="lazy"
                >
                  <v-row>
                    <v-col cols="2">
                    </v-col>
                    <v-col cols="8">
                      <v-text-field
                        label="原密码*"
                        required
                        :counter="20"
                        :rules="[
                              v => !!v || '原密码不能为空',
                              v => v && v.length <= 20 || '最多只能输入20个字符'
                            ]"
                        type="password"
                        v-model.trim="editPwdForm.password"
                        outlined
                        dense
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="2">
                    </v-col>
                    <v-col cols="8">
                      <v-text-field
                        label="现密码*"
                        required
                        type="password"
                        :counter="20"
                        :rules="pwdPolicyRules"
                        v-model.trim="editPwdForm.newPassword"
                        outlined
                        dense
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="2">
                    </v-col>
                    <v-col cols="8">
                      <v-text-field
                        label="确认现密码*"
                        required
                        type="password"
                        :counter="20"
                        :rules="okPwdPolicyRules"
                        v-model.trim="editPwdForm.okPassword"
                        outlined
                        dense
                      />
                    </v-col>
                  </v-row>
                </v-form>
              </div>
            </slot>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1" />
          <div>
            <v-btn class="primary mr-4"  :disabled='!editVaild' @click="determine()">确定</v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
import { updateDefaultApp } from 'api/queryHeaderAppList.js';
import { userLoginOut, editItem, getPwdPolicy } from 'api/login.js';
import { mapGetters, mapActions } from 'vuex';
import { getRulesState } from 'utils/pwdPolicy';
export default {
  name: 'HeaderNav',
  props: {
    switchApplication: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    // chipDisable: false,
    loginpwdOld: '', // 原密码
    userId: '', // 用户标识
    editPwdForm: {
      password: '', // 旧密码
      newPassword: '', // 新密码
      okPassword: '' // 确认新密码
    },
    isWhetherShow: false, // 是否需要修改密码
    navHeaderColor: '',
    bannerHeader: '',
    isPickColor: false,
    colorPickDialog: false,
    type: 'hex',
    hex: '#19ACC0',
    historyColor: [],
    darkMode: false,
    realName: '', // 用户真实名称
    items: [
      { title: '' },
      { title: '退出' },
      { title: '修改密码' },
      { title: '调色板' }
    ],
    isMini: '',
    selectAppList: [],
    appIdArr: [],
    // 提示弹框参数
    timeout: 2000,
    isSnackbarTop: true,
    snackbarServe: false,
    snackbarServeMsg: '',
    snackbarServeColor: '',
    lazy: false,
    editVaild: true, // 修改密码form的v-model,控制“确定”按钮的置灰
    // 密码复杂策略
    pwdPolicy: {},
    pwdPolicyTips: '',
    pwdPolicyRules: [
      v => !!v || '现密码不能为空',
      v => (v && v.length <= 20) || '最多只能输入20个字符'
    ],
    okPwdPolicyRules: [
      v => !!v || '确认现密码不能为空',
      v => (v && v.length <= 20) || '最多只能输入20个字符'
    ],
    pagePath: ''
  }),
  computed: {
    defaultGlobalPrimaryColor () {
      return window.g.baseColor;
    },
    colorObj () {
      return {
        background: this.color
      };
    },
    color: {
      get () {
        return this[this.type];
      },
      set (v) {
        this[this.type] = v;
      }
    },
    chipDisable () {
      if (this.$store.state.chip === 'true') {
        return true;
      } else {
        return false;
      }
    },
    historyColorList () {
      return this.historyColor.slice(0, 8);
    },
    ...mapGetters([
      'appName',
      'appId',
      'navItems',
      'appList'
    ]),
    getNumberItem () {
      return this.$store.state.pwdPolicy;
    }
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        this.getPwdPolicy();
        this.pagePath = this.$route.path;
      },
      // 深度观察监听
      deep: true
    },
    getNumberItem (newVal, oldVal) {
      this.getPwdPolicy();
    }
  },
  mounted () {
    this.items[0].title = JSON.parse(localStorage.getItem('loginData')).realName;
    this.realName = JSON.parse(localStorage.getItem('loginData')).realName;
    this.navHeaderColor = window.g.navHeaderColor;
    this.bannerHeader = window.g.globalHeader;
    if (localStorage.themeColor) {
      this.$vuetify.theme.themes.light.primary = localStorage.themeColor;
      this.$vuetify.theme.themes.dark.primary = localStorage.themeColor;
      this.color = localStorage.themeColor;
    } else {
      this.$vuetify.theme.themes.light.primary = window.g.baseColor;
      this.$vuetify.theme.themes.dark.primary = window.g.baseColor;
    }
    this.$nextTick(function () {
      this.pwdPolicy = this.$store.state.pwdPolicy;
    });
    this.getPwdPolicy();
  },
  methods: {
    getPwdPolicy () { // 获取密码复杂度配置
      getPwdPolicy()
        .then(res => {
          let data = res.data.data;
          this.pwdPolicy = res.data.data;
          let str = '';
          if (res.data.data.info === '1') {
            data.complicatedUnit.forEach(item => {
              if (data.complicated.indexOf(item.info) !== -1) {
                str += item.desc + '、';
              }
            });
            str = str.replace(/、$/, '');
            this.pwdPolicyTips = '密码长度最小' + data.miniLength + '位，至少包含' + str + '中的' + data.complicatedNum + '种类型组合';
            this.pwdPolicyRules.push(
              v => (getRulesState(data.complicated, data.complicatedNum, data.miniLength, v)) || this.pwdPolicyTips
            );
            this.okPwdPolicyRules.push(
              v => (getRulesState(data.complicated, data.complicatedNum, data.miniLength, v)) || this.pwdPolicyTips
            );
          } else {
            this.pwdPolicyRules = [
              v => !!v || '现密码不能为空',
              v => (v && v.length <= 20) || '最多只能输入20个字符'
            ];
            this.okPwdPolicyRules = [
              v => !!v || '确认现密码不能为空',
              v => (v && v.length <= 20) || '最多只能输入20个字符'
            ];
            this.pwdPolicyTips = '';
          }
        });
    },
    handleClickBreadCrumbs (item) {
      if (item.text.includes('中心')) {
        this.isMini = false;
        this.$emit('handleRouter', this.isMini);
      }
    },
    async toggleApp (item) { // 选择某一个应用，并告知后台是什么应用
      if (item) {
        let params = {
          appId: item.id
        };
        let { data } = await updateDefaultApp(params);
        sessionStorage.setItem('appName', JSON.stringify(item));
        this.changeAppName(item);
      }
    },
    pickColor () {
      this.colorPickDialog = !this.colorPickDialog;
    },
    applyColor (color) {
      this.$vuetify.theme.themes.light.primary = color;
      this.$vuetify.theme.themes.dark.primary = color;
      localStorage.themeColor = color;
      this.color = color;
    },
    setColor (v) {
      this.historyColor.unshift(v);
    },
    changeDarkMode () {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    },
    toggleMini () {
      this.isMini = !this.isMini;
      this.$emit('funcToggleMini', this.isMini);
    },
    ...mapActions([
      'changeAppName',
      'handleChangeNavItems',
      'setCenterActive'
    ]),
    // 修改密码
    async determine () {
      if (this.editPwdForm.newPassword !== this.editPwdForm.okPassword) {
        this.showError('新密码输入不一致，请确认');
      } else if (this.pwdPolicyTips && !getRulesState(this.pwdPolicy.complicated, this.pwdPolicy.complicatedNum, this.pwdPolicy.miniLength, this.editPwdForm.newPassword)) {
        this.showError(this.pwdPolicyTips);
        return false;
      } else {
        // 密码加密 encode方法在 main.js
        // 旧密码
        let loginpwdOld = this.editPwdForm.password;
        let pwd = this.encode(loginpwdOld);
        let pwdx = this.encode('X' + pwd);
        let pwdxd = this.encode('D' + pwdx);
        // 新密码
        let newPassword = this.editPwdForm.newPassword;
        let newPwd = this.encode(newPassword);
        let newPwdx = this.encode('X' + newPwd);
        let newPwdxd = this.encode('D' + newPwdx);
        const params = {
          userId: this.userId,
          loginpwdOld: pwdxd,
          loginpwd: newPwdxd
        };
        try {
          let res = await editItem(params);
          if (res.data.code === 200) {
            this.$refs.editPwdForm.reset(); // 清空form,防止二次展示修改密码弹框时，form表单有错误信息的展示。
            this.isWhetherShow = false;
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'success';
          } else {
            this.showError(res.data.msg);
          }
        } catch (err) {
          this.showError('服务器异常,请稍后重试');
        }
      }
    },
    showError (err) { // 错误提示框
      this.snackbarServe = true;
      this.snackbarServeMsg = err;
      this.snackbarServeColor = 'error';
    },
    // 取消修改密码
    cancelDialog () {
      this.isWhetherShow = false;
      this.$refs.editPwdForm.reset(); // 清空form,防止二次展示修改密码弹框时，form表单有错误信息的展示。
    },
    // 退出
    async signOut () {
      let { data } = await userLoginOut();
      if (data.code === 200) {
        localStorage.clear();
        sessionStorage.clear();
        this.$router.replace('/login');
      }
    },
    selectFeature (item) {
      if (item.title === '调色板') {
        this.pickColor();
      } else if (item.title === '退出') {
        this.signOut();
      } else if (item.title === '修改密码') {
        this.isWhetherShow = true;
      }
    }
  }
};
</script>
<style lang="stylus" scoped>
span {
  cursor: pointer;
  margin-right: 42px;
}
ul, li {
  padding: 0;
  margin: 0;
  padding-left: 12px;
}
li {
  list-style: none;
  cursor: pointer;
  height: 59px;
  line-height: 59px;
}
.leftCenterMenuIconColor {
  color: #fff;
}
.active {
  transition-duration: 0.3s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  background-color: #4473Da;
  opacity: 1;
  width: 100%;
  height: 59px;
  line-height: 59px;
}
.header-btn {
  height: 60px !important;
  line-height: 60px !important;
}
.v-tabs-slider-boder {
  display: block;
  left: 0;
  bottom: 0;
  margin: 0 !important;
  position: absolute;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  z-index: 1;
  .slider-boder {
    display: block;
    width: 100%;
    height: 3px;
    background: var(--v-headerTextColor-base);
  }
}
.togglemini {
  position: absolute;
  bottom: 20px;
  left: 15px;
}
.togglemini .v-icon {
  color: #fff;
}
.main-headernav {
  left: 0;
  background-color: #fff;
  height: 60px;
  line-height:60px;
}
// 右上角下拉框样式
.v-list-item:hover {
  cursor: pointer;
  background-color: var(--v-primary-base);
}
.selectApp > .v-list-item:hover {
  cursor: pointer;
  background-color: #fff;
  color: #212121;
}
.selectApp > .v-list-item:hover .v-list-item__title {
  color: #212121 !important;
}
.v-list-item:hover .v-list-item__title {
  color: #fff !important;
}
.reset-chip-style {
  background: none !important;
  border: none !important;
  box-shadow: none !important;
}
.v-breadcrumbs li {
  float: left;
}
.v-breadcrumbs .v-breadcrumbs__divider {
  float: left;
}
.changeSelectApp >>> .v-text-field>.v-input__control>.v-input__slot:before {
  border: none;
}
.changeSelectApp >>> .v-input__append-inner {
  display: none;
}
</style>
