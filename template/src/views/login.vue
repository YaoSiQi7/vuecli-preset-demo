<!----------  @author: wnagGuoDong  ----------->
<!----------  @updated_at: 2020-04-10  ----------->
<!----------  @version: 2.0  ----------->

<template>
  <div class="login-section">
    <vue-particles color="#dedede" :lineOpacity="0.6" hoverMode="grab" style="width:100%;height:100%;"></vue-particles>
    <v-container class="enu-content">
      <v-row class="px-0 py-0 mx-0" style="height: 100%;">
        <div class="sys-info">
          <div class="txt">
            <h3>观行&nbsp;•&nbsp;交易反欺诈管理平台</h3>
            <p>风险大盘 • 风险趋势 • 风险操作分布 • 规则检测效果</p>
          </div>
        </div>
        <div class="login-box">
          <div class="login-content">
            <v-form
              ref="form"
              v-model="valid"
              :lazy-validation="lazy">
              <h1>登录</h1>
              <div>
                <div class="label">账号</div>
                <v-text-field
                  v-model="form.username"
                  placeholder="请输入账号"
                  :rules="nameRules"
                  required
                  outlined
                  dense
                  solo
                  flat
                  class="pt-0 pb-0 input-height"
                ></v-text-field>
              </div>
              <div>
                <div class="label">密码</div>
                <v-text-field
                  v-model="form.loginpwd"
                  placeholder="请输入密码"
                  :rules="passWordRules"
                  type="password"
                  required
                  outlined
                  dense
                  solo
                  flat
                  class="pt-0 pb-0 input-height"
                  @keyup.enter.native="login()"
                ></v-text-field>
              </div>
              <!-- <div class="tool-box" >
                  <v-checkbox
                  v-model="checkbox"
                  label="记住密码"
                  required
                  dense
                  class="pt-0 pb-0 mt-0"
                  @change="checkboxClick(checkbox)"
                ></v-checkbox>
                <div style="curcor: pointer;text-align: right;">忘记密码？</div>
              </div> -->

              <v-btn
                large
                class="login-btn"
                color="primary"
                @click="login"
                :disabled="!valid"
                :loading="btnLoading"
              >
                登录
              </v-btn>
            </v-form>
          </div>
        </div>
      </v-row>
    </v-container>
    <!-- 是否需要修改密码 -->
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
        <div class="titles">{{ editPwdTitle }}</div>
        <v-card-text style="max-height: 600px;">
          <v-container>
            <slot>
              <div>
                <v-form
                  ref="editPwdForm"
                  v-model="editVaild"
                  class="form"
                  :lazy-validation='editLazy'
                >
                  <v-row>
                    <v-col cols="2">
                    </v-col>
                    <v-col cols="8">
                      <v-text-field
                        label="原密码*"
                        required
                        type="password"
                        :counter="20"
                        :rules="[
                          v => !!v || '原密码不能为空',
                          v => v && v.length <= 20 || '最多只能输入20个字符'
                        ]"
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
            <v-btn class="primary mr-4" :disabled='!editVaild' @click="determine()">确定</v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--提示修改密码弹窗-->
    <v-dialog
      v-model="isPwdWillExpire"
      persistent
      width="400">
      <v-card class="pt-10 pb-6">
        <v-card-text class="mb-5">{{ editPwdTitle }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="primary mr-4" @click="willEdit">修改密码</v-btn>
          <v-btn class="primary mr-4" @click="loginSuccess(loginSuccessData)">进入系统</v-btn>
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
import { mapActions } from 'vuex';
import { userLogin, editItem, getPwdPolicy } from '@/api/login';
import { NO_EMPTY_STRING } from 'utils/validate';
import { upOrAddConfig } from 'api/systemConfiguration';
import { getRulesState } from 'utils/pwdPolicy';
export default {
  data () {
    return {
      isPwdWillExpire: false, // 密码即将过期
      loginpwdOld: '', // 原密码
      userId: '', // 用户标识
      isWhetherShow: false, // 是否需要修改密码
      btnLoading: false, // 按钮添加loading，避免多次提交
      form: {
        username: '',
        loginpwd: ''
        // checkbox: false,
      },
      editPwdForm: {
        password: '', // 旧密码
        newPassword: '', // 新密码
        okPassword: '' // 确认新密码
      },
      valid: true,
      lazy: false,
      editLazy: false,
      editVaild: true, // 修改密码form的v-model,控制“确定”按钮的置灰
      name: '',
      passWord: '',
      nameRules: [
        v => !!v || `账号${NO_EMPTY_STRING}`
      ],
      passWordRules: [
        v => !!v || `密码${NO_EMPTY_STRING}`
      ],
      checkbox: false,
      // 提示弹框参数
      timeout: 2000,
      isSnackbarTop: true,
      snackbarServe: false,
      snackbarServeMsg: '',
      snackbarServeColor: '',
      // 拦截登录成功返回data
      loginSuccessData: '',
      editPwdTitle: '',
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
      ]
    };
  },
  mounted () {
    this.getPwdPolicy();
  },
  methods: {
    checkboxClick (val) { // 是否记住密码事件
    },
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
          }
        });
    },
    // 给每个菜单路由添加所属中心的字段,name代表所属中心
    addName (arr, val) {
      arr.forEach(i => {
        i['name'] = val.enTitle;
        i['centerName'] = val.zhTitle;
        if (i.children) {
          this.addName(i.children, val);
        }
      });
      return arr;
    },
    // 取消修改
    cancelDialog () {
      this.$refs.editPwdForm.reset(); // 清空form,防止二次展示修改密码弹框时，form表单有错误信息的展示。
      this.isWhetherShow = false;
    },
    // 即将过期修改密码
    willEdit () {
      this.isWhetherShow = true;
      this.isPwdWillExpire = false;
      this.editPwdTitle = '';
    },
    // 修改密码
    async determine () {
      if (this.editPwdForm.newPassword !== this.editPwdForm.okPassword) {
        this.showError('新密码输入不一致，请确认');
        return false;
      }
      if (this.pwdPolicyTips && !getRulesState(this.pwdPolicy.complicated, this.pwdPolicy.complicatedNum, this.pwdPolicy.miniLength, this.editPwdForm.newPassword)) {
        this.showError(this.pwdPolicyTips);
        return false;
      }
      try {
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
        let res = await editItem(params);
        if (res.data.code === 200) {
          this.form.loginpwd = ''; // 密码置空。产品确认。
          this.$refs.form.resetValidation(); // 刪除验证报错提示
          this.$refs.editPwdForm.reset(); // 清空form,防止二次展示修改密码弹框时，form表单有错误信息的展示。
          this.isWhetherShow = false;
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'success';
        } else {
          this.isWhetherShow = true;
          this.editPwdTitle = '该密码为初始密码，请修改密码';
          this.btnLoading = false;
          this.showError(res.data.msg);
        }
      } catch (err) {
        this.btnLoading = false;
        this.showError('服务器异常,请稍后重试');
      }
    },
    // 登录确定
    async login () {
      try {
        this.btnLoading = true;
        // 对用户登录密码进行3次加密
        // encode方法在 main.js
        let loginpwd = this.form.loginpwd;
        let pwd = this.encode(this.form.loginpwd);
        let pwdx = this.encode('X' + pwd);
        let pwdxd = this.encode('D' + pwdx);
        this.form.loginpwd = pwdxd;
        let res = await userLogin(this.form);
        if (!!res.data.data && res.data.code === 200) {
          let data = res.data.data;
          // 判断是否修改密码
          if (res.data.data.needUpPwd) {
            this.editPwdTitle = '该密码为初始密码，请修改密码';
            this.userId = res.data.data.userId;
            this.loginpwdOld = loginpwd;
            this.isWhetherShow = true;
            this.editPwdTitle = '该密码为初始密码，请修改密码';
            this.btnLoading = false;
            this.form.loginpwd = loginpwd;
            return false;
          }
          if (res.data.data.pwdNeedUpdate === 'tip') { // 提示密码过期
            this.editPwdTitle = res.data.data.pwdMessage;
            this.userId = res.data.data.userId;
            this.btnLoading = false;
            this.isPwdWillExpire = true;
            this.loginSuccessData = data;
            this.form.loginpwd = loginpwd;
            return false;
          } else if (res.data.data.pwdNeedUpdate === 'true') { // 密码过期强制修改密码
            this.editPwdTitle = res.data.data.pwdMessage;
            this.userId = res.data.data.userId;
            this.btnLoading = false;
            this.isWhetherShow = true;
            this.form.loginpwd = loginpwd;
            return false;
          }
          // 密码复杂度
          if (res.data.data.pwdNeedRestart) {
            this.showError(res.data.data.pwdNeedMsg);
            this.editPwdTitle = res.data.data.pwdNeedMsg;
            this.userId = res.data.data.userId;
            this.btnLoading = false;
            this.isWhetherShow = true;
            this.form.loginpwd = loginpwd;
            return false;
          }
          this.loginSuccess(data);
        } else {
          this.btnLoading = false;
          this.showError(res.data.msg);
        }
      } catch (err) {
        this.btnLoading = false;
        this.showError('服务器异常,请稍后重试');
      }
    },
    loginSuccess (data) {
      // 存储token
      if (data.token) {
        localStorage.setItem('token', JSON.stringify(data.token));
      }
      this.$store.commit('resetState');
      // if (data.appList && data.appList.length) {
      this.setAppList(data.appList);// 应用列表数据存储到vuex里
      sessionStorage.setItem('vuexAppList', JSON.stringify(data.appList));
      // }
      //  else {
      //   this.showError('此账号没有配应用，请联系管理员');
      //   this.btnLoading = false;
      //   return false;
      // }
      // 定义空数组，用于合并各个中心下的目录
      let dataArray = [];
      if (data.caseManangementgCenter) { // 案件管理中心
        dataArray = dataArray.concat(this.addName(JSON.parse(data.caseManangementgCenter), { enTitle: 'caseManangementgCenter', zhTitle: '案件管理中心' }));
      }
      if (data.systemManagementCenter) {
        dataArray = dataArray.concat(this.addName(JSON.parse(data.systemManagementCenter), { enTitle: 'systemManagementCenter', zhTitle: '系统管理中心' }));
      }
      if (data.desicionModelItems) { // 决策模型中心
        dataArray = dataArray.concat(this.addName(JSON.parse(data.desicionModelItems), { enTitle: 'desicionModelItems', zhTitle: '决策模型中心' }));
      }
      if (data.riskMenuItems) { // 风控分析中心
        dataArray = dataArray.concat(this.addName(JSON.parse(data.riskMenuItems), { enTitle: 'riskMenuItems', zhTitle: '风控分析中心' }));
      }
      if (data.shuju) {
        dataArray = dataArray.concat(this.addName(JSON.parse(data.shuju), { enTitle: 'shuju', zhTitle: '数据管理中心' }));
      }
      if (dataArray.length === 0) {
        this.showError('此账号没有分配权限，请联系管理员');
        this.btnLoading = false;
        return false;
      }
      let dataObj = {};
      let childArray = [];
      // 遍历所有菜单，存储所有路由到对象中并给赋值为当前中心名称，所有路由和
      var getData = function (arr) {
        arr.forEach(item => {
          dataObj[item.path] = item.name;// 当前用户，所有权限页面的路由集合
          childArray.push(item);
          if (item.children) {
            getData(item.children);
          }
        });
      };
      getData(dataArray);
      // 存储登录成功返回的数据信息
      localStorage.setItem('loginData', JSON.stringify(data));
      localStorage.setItem('routerObj', JSON.stringify(dataObj));
      localStorage.setItem('childArray', JSON.stringify(childArray));
      window.g.isSSO = false;
      this.$router.push(JSON.parse(data.textContent)[0].path);
    },
    showError (err) { // 错误提示框
      this.snackbarServe = true;
      this.snackbarServeMsg = err;
      this.snackbarServeColor = 'error';
    },
    ...mapActions([
      'setAppList'
    ])
  }
};
</script>
<style lang="stylus" scoped>
.titles {
  display: block;
  text-align: center;
  padding: 10px 0;
  font-size: 18px;
}
.login-section {
  position: relative;
  background: #080f21;
  width: 100vw;
  height:100vh;
  overflow: hidden;
  .enu-content {
    padding: 0;
    background: rgba(12, 26, 53, .9);
    width: 60vw;
    height: 60vh;
    min-width: 800px;
    min-height 350px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    // 左侧内容
    .sys-info {
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      width:60%;
      .txt {
        color: #fff;
        h3 {
          font-size: 34px;
        }
        p {
          margin-top: 30px;
          color: #5c85df;
          font-size: 12px;
        }
      }
    }
    //右侧登录表单
    .login-box {
      position: relative;
      width:40%;
      border-radius: 4px;
      background: #fff;
      .login-content {
        padding-top: 6px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 88%;
        min-height: 350px;
        h1 {
          font-size: 24px;
          margin-bottom: 4%;
        }
        .label {
          height: 27px;
          line-height: normal;
          font-size: 18px;
          text-align: left;
          margin-bottom: 3%;
        }
        .tool-box {
          display:flex;
          align-items: center;
          justify-content: space-between;
          height: 30px;
        }
        .input-height {
          height: 66px !important;
        }
        .login-btn {
          margin-top: 10px;
          width: 46%;
          height: 40px;
          font-size: 19px;
        }
        >>> .v-input__control {
          posiiton: relative;
        }
        >>> .v-input__slot {
          height: 40px !important;
          border: 1px solid rgba(0,0,0,.14);
        }
        >>> .v-input__slot:hover,>>> .v-input__slot:focus {
          border-color: rgba(0,0,0,.34);
        }
        >>> .v-text-field__details {
          position: absolute;
          left: 0;
          bottom: -4px;
        }
        .tool-box >>> .v-input--dense > .v-input__control > .v-input__slot{
          margin-bottom: 0;
          border: none;
        }
        >>> .theme--light.v-text-field--outlined fieldset {
          display: none;
        }
        .icon-primary{
          color: var(--v-primary-base) !important;
        }
      }
    }
  }
}

</style>
