<template>
  <div class="enu-content fill-height">
    <v-row justify="center">
      <v-container>
        <v-card-text class="d-flex flex-row justify-center">
          <v-form
            class="system"
            ref="form">
            <div v-for="(item, index) in systemInfo" :key="index" class="hasBorder">
              <v-card-title class="header_bg_color">
                {{ item.tagDescription }}
                <v-tooltip bottom v-if="item.tagDescription === '敏感信息配置'">
                  <template v-slot:activator="{ on }">
                    <v-icon
                      size="20"
                      class="ml-10 icon-primary"
                      color="primary"
                      v-on="on"
                      @click="addSensitiveInfo"
                    >
                      mdi-plus-circle
                    </v-icon>
                  </template>
                  <span>添加</span>
                </v-tooltip>
                <v-tooltip right max-width="170" v-if="item.tagDescription === '敏感信息配置'">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="primary"
                      icon
                      small
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon dark dense size="20">
                        mdi-help-circle
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>敏感信息字段在此处配置后将不会在系统中完整显示。</span>
                </v-tooltip>
              </v-card-title>
              <div v-for="(cItem, cIndex) in item.infoList" :key="cIndex">
                <v-row v-if="item.tagDescription === '案件超时配置'">
                  <v-col cols="2" class="colReset">
                    <div>{{ cItem.tagDescription }}：</div>
                  </v-col>
                  <v-col cols="3">
                    <v-text-field
                      v-model="cItem.pvalue.info"
                      placeholder="请输入天数*"
                      value=''
                      type='text'
                      required
                      :rules="[
                    v => !!v || '天数不能为空',
                    v => v && v.length <= 50 || '最多只能输入50个字符',
                    v => ((/^(-)?\d+(\d+)?$/).test(v)) || '天数只能输入数字'
                  ]"
                      outlined
                      dense
                    />
                  </v-col>
                  <v-col cols="3">
                    <v-select
                      v-model="cItem.pvalue.unit"
                      item-text="unit"
                      placeholder="工作日*"
                      :items="cItem.pvalue.units"
                      required
                      :rules="[
                    v => !!v || '工作日不能为空',
                  ]"
                      outlined
                      dense
                      no-data-text="没有匹配数据"
                    />
                  </v-col>
                </v-row>
                <div v-else-if="item.tagDescription === '密码策略配置'">
                  <!-- 强制定期修改密码 -->
                  <div>
                    <v-row v-if="cItem.tagDescription === '强制定期修改密码'">
                      <v-col cols="2" class="colReset">
                        <div>{{ cItem.tagDescription }}：</div>
                      </v-col>
                      <v-col cols="3">
                        <v-radio-group
                          v-model="cItem.pvalue.info"
                          row
                          @change="qzdqxgmmChange"
                        >
                          <v-radio
                            v-for="(ccItem, ccIndex) in cItem.pvalue.units"
                            :key="ccIndex"
                            :label="ccItem.desc"
                            :value="ccItem.info"
                          ></v-radio>
                        </v-radio-group>
                      </v-col>
                    </v-row>
                    <v-row v-if="cItem.tagDescription !== '密码复杂性策略' && cItem.tagDescription !== '错误登录密码锁定' && cItem.tagDescription !== '强制定期修改密码' && qzdqxgmmRadio === '1'">
                      <v-col cols="2" class="colReset">
                        <div>{{ cItem.tagDescription }}：</div>
                      </v-col>
                      <v-col cols="3" style="display: flex;">
                        <div class="vCenter mr-3">每</div>
                        <v-text-field
                          v-model="cItem.pvalue.info"
                          placeholder=""
                          value=''
                          type='text'
                          required
                          :rules="[
                          v => !!v || '天数不能为空',
                          v => v && v.length <= 50 || '最多只能输入50个字符',
                          v => ((/^(-)?\d+(\d+)?$/).test(v)) || '天数只能输入数字'
                        ]"
                          outlined
                          dense
                        />
                        <div class="vCenter ml-3">天</div>
                      </v-col>
                    </v-row>
                  </div>
                  <!--错误登录密码锁定-->
                  <div v-if="cItem.tagDescription === '错误登录密码锁定'">
                    <v-row>
                      <v-col cols="2" class="colReset">
                        <div>{{ cItem.tagDescription }}：</div>
                      </v-col>
                      <v-col cols="3">
                        <v-radio-group
                          row
                          v-model="cItem.pvalue.info"
                          @change="cwdlmmsdChange"
                        >
                          <v-radio
                            v-for="(ccItem, ccIndex) in cItem.pvalue.units"
                            :key="ccIndex"
                            :label="ccItem.desc"
                            :value="ccItem.info"
                          ></v-radio>
                        </v-radio-group>
                      </v-col>
                    </v-row>
                    <v-row v-if="cwmmdlsdRadio === '1'">
                      <v-col cols="2" class="colReset"></v-col>
                      <v-col cols="10" style="display: flex;" class="pwdLock">
                        <div><v-text-field
                          v-model="cItem.pvalue.within"
                          outlined
                          dense
                          value=''
                          type='text'
                          required
                          :rules="[
                  v => !!v || '不能为空',
                  v => ((/^(-)?\d+(\d+)?$/).test(v)) || '只能输入数字',
                  v => ((/^[1-9][0-9]?$/).test(v)) || '只能输入1-99的数字'
                ]"></v-text-field></div>
                        <div><v-select
                          v-model="cItem.pvalue.withinDateUnit"
                          :items="cItem.pvalue.withinDateUnits"
                          required
                          outlined
                          dense
                          item-text="desc"
                          item-value="info"
                          no-data-text="没有匹配数据"
                        /></div>
                        <span>内，密码错误</span>
                        <div><v-text-field
                          v-model="cItem.pvalue.errorCount"
                          outlined
                          dense
                          value=''
                          type='text'
                          required
                          :rules="[
                  v => !!v || '不能为空',
                  v => ((/^(-)?\d+(\d+)?$/).test(v)) || '只能输入数字',
                  v => ((/^[1-9][0-9]?$/).test(v)) || '只能输入1-99的数字'
                ]"></v-text-field></div>
                        <span>次，锁定</span>
                        <div><v-text-field
                          v-model="cItem.pvalue.lock"
                          outlined
                          dense
                          value=''
                          type='text'
                          required
                          :rules="[
                  v => !!v || '不能为空',
                  v => ((/^(-)?\d+(\d+)?$/).test(v)) || '只能输入数字',
                  v => ((/^[1-9][0-9]?$/).test(v)) || '只能输入1-99的数字'
                ]"></v-text-field></div>
                        <div><v-select
                          v-model="cItem.pvalue.lockDateUnit"
                          :items="cItem.pvalue.lockDateUnits"
                          required
                          outlined
                          dense
                          item-text="desc"
                          item-value="info"
                          no-data-text="没有匹配数据"
                        /></div>
                      </v-col>
                    </v-row>
                  </div>
                  <!--密码复杂性策略-->
                  <div v-if="cItem.tagDescription === '密码复杂性策略'">
                    <v-row>
                      <v-col cols="2" class="colReset">
                        <div>{{ cItem.tagDescription }}：</div>
                      </v-col>
                      <v-col cols="3">
                        <v-radio-group
                          row
                          v-model="cItem.pvalue.info"
                          @change="mmfzxclChange"
                        >
                          <v-radio
                            v-for="(ccItem, ccIndex) in cItem.pvalue.units"
                            :key="ccIndex"
                            :label="ccItem.desc"
                            :value="ccItem.info"
                          ></v-radio>
                        </v-radio-group>
                      </v-col>
                    </v-row>
                    <v-row v-if="mmfzxclRadio === '1'">
                      <v-col cols="2" class="colReset"></v-col>
                      <v-col cols="10" style="display: flex;" class="pwdLock">
                        <span>最小长度：</span>
                        <div><v-text-field
                          v-model="cItem.pvalue.miniLength"
                          outlined
                          dense
                          value=''
                          type='text'
                          required
                          :rules="[
                  v => !!v || '不能为空',
                  v => ((/^(-)?\d+(\d+)?$/).test(v)) || '只能输入数字',
                  v => ((/^([4-9]|1[0-9]|(2[0]))$/).test(v)) || '只能输入4-20范围内'
                ]"></v-text-field></div>
                        <span>字符（范围4-20个字符）</span>
                      </v-col>
                    </v-row>
                    <v-row v-if="mmfzxclRadio === '1'">
                      <v-col cols="2" class="colReset"></v-col>
                      <v-col cols="10" style="display: flex;" class="pwdLock">
                        <span>复杂度包含：</span>
                        <div style="display: flex;width: auto;">
                          <v-checkbox v-for="(complexItem, complexIndex) in cItem.pvalue.complicatedUnit"
                                      v-model="complicated"
                                      :key="complexIndex"
                                      :label="complexItem.desc"
                                      :value="complexItem.info"
                                      @change="complicatedChange"
                                      style="margin-right: 12px;margin-top: 12px;"
                          ></v-checkbox>
                        </div>
                        <span>中的至少</span>
                        <div><v-select
                          v-model="cItem.pvalue.complicatedNum"
                          :items="complicatedData"
                          required
                          outlined
                          dense
                          no-data-text="没有匹配数据"
                        /></div>
                        <span>种类型组合</span>
                      </v-col>
                    </v-row>
                  </div>
                </div>
                <div v-else-if="item.tagDescription === '敏感信息配置'">
                  <v-row v-for="(gItem, gIndex) in cItem.pvalue" :key="gIndex">
                    <v-col cols="3">
                      <v-autocomplete
                        v-model="gItem.value1"
                        item-text="fieldName"
                        item-value="id"
                        placeholder="请选择敏感信息字段"
                        :items="allfield"
                        outlined
                        dense
                        item-disabled="disabled"
                        :loading="isAllfield"
                        no-data-text="没有匹配数据"
                        @change="allfieldDisabled"
                      />
                    </v-col>
                    <v-col cols="5" style="display: flex;">
                      <div class="vCenter mr-3">从第</div>
                      <div style="width: 60px;">
                        <v-text-field
                          v-model="gItem.value4"
                          type='text'
                          outlined
                          dense/>
                      </div>
                      <div class="vCenter mr-3 ml-3">位开始隐藏</div>
                      <div style="width: 60px;">
                        <v-text-field
                          v-model="gItem.value5"
                          type='text'
                          outlined
                          dense/>
                      </div>
                      <div class="vCenter ml-3 mr-5">位</div>
                      <div class="vCenter">
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-icon
                              size="20"
                              class="icon-primary"
                              color="primary"
                              v-on="on"
                              @click="removeSensitiveInfo(index, cIndex, gIndex)"
                            >
                              mdi-delete
                            </v-icon>
                          </template>
                          <span>删除</span>
                        </v-tooltip>
                      </div>
                    </v-col>
                  </v-row>
                </div>
                <v-row v-else-if="item.tagDescription === '图报表配置'">
                  <v-col cols="2" class="colReset">
                    <div>{{ cItem.tagDescription }}：</div>
                  </v-col>
                  <v-col cols="3">
                    <v-autocomplete
                      v-model="cItem.pvalue.info"
                      :items="cityData"
                      item-text="label"
                      item-value="value"
                      outlined
                      dense
                      no-data-text="没有匹配数据"
                      solo
                      flat
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row v-else>
                  <v-col cols="2" class="colReset">
                    <div>{{ cItem.tagDescription }}：</div>
                  </v-col>
                  <v-col :cols="cItem.HINT ? 3 : 6">
                    <v-radio-group
                      v-model="cItem.pvalue.info"
                      row
                    >
                      <v-radio
                        v-for="(ccItem, ccIndex) in cItem.pvalue.units"
                        :key="ccIndex"
                        :label="ccItem.desc"
                        :value="ccItem.info"
                      ></v-radio>
                    </v-radio-group>
                  </v-col>
                  <v-col cols="1" style="display: flex;align-items: center;" v-if="cItem.HINT">
                    <v-tooltip right max-width="370">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          color="primary"
                          icon
                          small
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon dark dense>
                            mdi-help-circle
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>
                       {{ cItem.HINT }}
                      </span>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </div>
            </div>
            <div class="btnCancel">
              <v-btn class="primary mt-5" @click="cancel" :loading="isLoading" v-if="hasPermission(saveSystemConfigBtn)">保存</v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-container>
    </v-row>
    <!-- 公共提示框 -->
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
import { getConfig, upOrAddConfig, queryallfield, getCity } from '../../api/systemConfiguration.js';
export default {
  data () {
    return {
      systemInfo: [],
      isLoading: false,
      // 公共提示词弹窗
      timeout: 2000,
      isSnackbarTop: true,
      snackbarServe: false,
      snackbarServeMsg: '',
      snackbarServeColor: '', // success', 'info', 'error' 三种类型
      // 增加按钮权限
      saveSystemConfigBtn: '/saveSystemConfigButton', // 保存系统配置按钮是否展示
      qzdqxgmmRadio: '',
      // 敏感信息列表
      allfield: [],
      isAllfield: false,
      cwmmdlsdRadio: '',
      mmfzxclRadio: '',
      complicatedData: [],
      complicated: [],
      cityData: [
        {
          label: '全国',
          value: '全国'
        }
      ]
    };
  },
  watch: {
  },
  filters: {},
  created () {
    this.getFormData();
    this.getQueryallfield();
    this.getCity();
  },
  components: {
  },
  computed: {
  },
  methods: {
    // 提示语状态
    message (str, theme) {
      this.snackbarServe = true;
      this.snackbarServeMsg = str;
      this.snackbarServeColor = theme || 'error';
    },
    // 密码复杂性策略开启/关闭
    mmfzxclChange (val) {
      this.mmfzxclRadio = val;
    },
    // 密码复杂性复杂度选择改变下拉框
    complicatedChange (val) {
      this.complicated = val;
      this.complicatedData = [];
      this.complicated.forEach((item, index) => {
        this.complicatedData.push((index + 1).toString());
      });
    },
    // 监听强制定期修改密码 是否开启
    qzdqxgmmChange (val) {
      this.qzdqxgmmRadio = val;
    },
    // 监听错误登陆密码锁定 是否开启
    cwdlmmsdChange (val) {
      this.cwmmdlsdRadio = val;
    },
    // 添加敏感信息配置规则
    addSensitiveInfo () {
      this.systemInfo.forEach((item) => {
        if (item.tagDescription === '敏感信息配置') {
          item.infoList[0].pvalue.push({
            'value1': '',
            'value2': '',
            'value3': '',
            'value4': '',
            'value5': ''
          });
        }
      });
    },
    // 删除敏感信息配置规则
    removeSensitiveInfo (index, cIndex, gIndex) {
      this.systemInfo[index].infoList[cIndex].pvalue.splice(gIndex, 1);
      this.allfieldDisabled();
    },
    // 查询敏感信息列表
    getQueryallfield () {
      this.isAllfield = true;
      queryallfield({ isContainEnum: 1 })
        .then(res => {
          this.allfield = res.data.data;
          this.isAllfield = false;
          this.allfieldDisabled();
        });
    },
    allfieldDisabled () {
      let selectArr = [];
      this.systemInfo.forEach((item) => {
        if (item.tagDescription === '敏感信息配置') {
          item.infoList && item.infoList.forEach((cItem) => {
            cItem.pvalue && cItem.pvalue.forEach((gItem) => {
              selectArr.push(gItem.value1);
            });
          });
        }
      });
      this.allfield.forEach((sItem) => {
        if (selectArr.indexOf(sItem.id) > -1) {
          sItem.disabled = true;
        } else {
          sItem.disabled = false;
        }
      });
    },
    // 获取省份
    getCity () {
      getCity()
        .then(res => {
          let hideCity = ['北京', '天津', '重庆', '上海', '香港', '澳门'];
          let city = res.data.data.filter((item, index) => {
            if (hideCity.indexOf(item.label) === -1) {
              return item;
            }
          });
          this.cityData = this.cityData.concat(city);
        });
    },
    // 获取信息
    getFormData () {
      getConfig()
        .then(res => {
          if (res.data.code === 200) {
            let data = res.data.data;
            let systemInfo = [];
            data.forEach((item, index) => {
              systemInfo.push({
                id: item.AID || '',
                tagDescription: item.ATAGDESCRIPTION,
                infoList: []
              });
              if (item.ATAGDESCRIPTION === '密码策略配置') {
                item.INFO.forEach((val1, val2) => {
                  if (val1.PKEY === 'mmclpz_qzdqxgmm') {
                    let first = item.INFO.splice(val2, 1);
                    item.INFO.unshift(first[0]);
                  }
                  if (val1.PKEY === 'mmclpz_cwdlmmsd') {
                    let last = item.INFO.splice(val2, 1);
                    item.INFO.push(last[0]);
                  }
                });
              }
              item.INFO && item.INFO.forEach((cItem) => {
                let PVALUE = JSON.parse(cItem.PVALUE);
                if (item.ATAGDESCRIPTION !== '案件超时配置' && item.ATAGDESCRIPTION !== '敏感信息配置' &&
                  cItem.TAGDESCRIPTION !== '错误登录密码锁定' && cItem.TAGDESCRIPTION !== '密码复杂性策略') {
                  PVALUE = {
                    info: PVALUE.info || '0',
                    units: PVALUE.units || PVALUE
                  };
                }
                systemInfo[index].infoList.push({
                  id: cItem.ID || '',
                  settingId: cItem.SETTINGID,
                  pvalue: PVALUE,
                  tagDescription: cItem.TAGDESCRIPTION,
                  pkey: cItem.PKEY,
                  HINT: cItem.HINT
                });
                if (item.ATAGDESCRIPTION === '敏感信息配置') {
                  let defultAdd = systemInfo[index].infoList[0].pvalue;
                  if (Object.prototype.toString.call(defultAdd) === '[object Array]') {
                    systemInfo[index].infoList[0].pvalue = defultAdd;
                  } else if (Object.prototype.toString.call(defultAdd) === '[object Object]') {
                    systemInfo[index].infoList[0].pvalue = [defultAdd];
                  }
                }
                systemInfo[index].infoList.forEach(gItem => {
                  if (gItem.tagDescription === '强制定期修改密码') {
                    this.qzdqxgmmRadio = gItem.pvalue.info;
                  }
                  if (gItem.tagDescription === '错误登录密码锁定') {
                    this.cwmmdlsdRadio = gItem.pvalue.info;
                  }
                  if (gItem.tagDescription === '密码复杂性策略') {
                    this.mmfzxclRadio = gItem.pvalue.info;
                    this.complicated = gItem.pvalue.complicated && gItem.pvalue.complicated.split(',');
                    this.complicatedChange(this.complicated);
                  }
                });
              });
            });
            console.log(systemInfo);
            this.systemInfo = systemInfo;
          } else {
            this.message(res.data.msg, 'error');
          }
        });
    },
    // 保存
    cancel () {
      let reg = /^(?:[1-9]|[1-9]\d)$/;
      let reg2 = /^\+?[1-9]{1}[0-9]{0,2}\d{0,0}$/;
      for (let i = 0; i < this.systemInfo.length; i++) {
        for (let k = 0; k < this.systemInfo[i].infoList.length; k++) {
          if (this.systemInfo[i].tagDescription === '案件超时配置') {
            if (!this.systemInfo[i].infoList[k].pvalue.info) {
              this.message('请输入' + this.systemInfo[i].infoList[k].tagDescription + '天数', 'error');
              return false;
            }
            if (!this.systemInfo[i].infoList[k].pvalue.unit) {
              this.message('请输入' + this.systemInfo[i].infoList[k].tagDescription + '类型', 'error');
              return false;
            }
          }
          if (this.systemInfo[i].tagDescription === '敏感信息配置') {
            for (let j = 0; j < this.systemInfo[i].infoList[k].pvalue.length; j++) {
              if (!this.systemInfo[i].infoList[k].pvalue[j].value1 ||
                !this.systemInfo[i].infoList[k].pvalue[j].value4 ||
                !this.systemInfo[i].infoList[k].pvalue[j].value5) {
                this.message('请输入敏感信息配置', 'error');
                return false;
              }
              if (!(reg.test(this.systemInfo[i].infoList[k].pvalue[j].value4)) ||
                !(reg.test(this.systemInfo[i].infoList[k].pvalue[j].value5))) {
                this.message('敏感信息配置输入大于0并小于100的正整数！', 'error');
                return false;
              }
            }
          }
          if (this.qzdqxgmmRadio === '1' && this.systemInfo[i].tagDescription === '密码策略配置' &&
            this.systemInfo[i].infoList[k].tagDescription !== '强制定期修改密码' &&
            !this.systemInfo[i].infoList[k].pvalue.info && this.systemInfo[i].infoList[k].tagDescription !== '错误登录密码锁定') {
            this.message('请输入' + this.systemInfo[i].infoList[k].tagDescription + '时间', 'error');
            return false;
          }
          if (this.qzdqxgmmRadio === '1' && this.systemInfo[i].infoList[k].tagDescription === '修改密码频率配置' &&
            !reg2.test(this.systemInfo[i].infoList[k].pvalue.info)) {
            this.message('修改密码频率配置输入大于0并小于1000的正整数！', 'error');
            return false;
          }
          if (this.qzdqxgmmRadio === '1' && this.systemInfo[i].infoList[k].tagDescription === '提示修改密码配置' &&
            !reg2.test(this.systemInfo[i].infoList[k].pvalue.info)) {
            this.message('提示修改密码配置输入大于0并小于1000的正整数！', 'error');
            return false;
          }
          if (this.cwmmdlsdRadio === '1' && this.systemInfo[i].infoList[k].tagDescription === '错误登录密码锁定') {
            if (!this.systemInfo[i].infoList[k].pvalue.within) {
              this.message('请输入错误时间！', 'error');
              return false;
            }
            if (!reg.test(this.systemInfo[i].infoList[k].pvalue.within)) {
              this.message('错误时间输入大于0并小于100的正整数！', 'error');
              return false;
            }
            if (!this.systemInfo[i].infoList[k].pvalue.withinDateUnit) {
              this.message('请输入错误时间单位！', 'error');
              return false;
            }
            if (!this.systemInfo[i].infoList[k].pvalue.errorCount) {
              this.message('请输入错误次数！', 'error');
              return false;
            }
            if (!reg.test(this.systemInfo[i].infoList[k].pvalue.errorCount)) {
              this.message('错误次数输入大于0并小于100的正整数！', 'error');
              return false;
            }
            if (!this.systemInfo[i].infoList[k].pvalue.lock) {
              this.message('请输入锁定时间！', 'error');
              return false;
            }
            if (!reg.test(this.systemInfo[i].infoList[k].pvalue.lock)) {
              this.message('锁定时间输入大于0并小于100的正整数！', 'error');
              return false;
            }
            if (!this.systemInfo[i].infoList[k].pvalue.lockDateUnit) {
              this.message('请输入锁定时间单位！', 'error');
              return false;
            }
          }
          // 密码复杂性策略
          if (this.mmfzxclRadio === '1' && this.systemInfo[i].infoList[k].tagDescription === '密码复杂性策略') {
            if (!(/^(-)?\d+(\d+)?$/).test(this.systemInfo[i].infoList[k].pvalue.miniLength)) {
              this.message('密码复杂性策略最小长度只能输入数字！', 'error');
              return false;
            }
            if (!this.systemInfo[i].infoList[k].pvalue.miniLength) {
              this.message('请输入密码复杂性策略最小长度！', 'error');
              return false;
            }
            if (this.systemInfo[i].infoList[k].pvalue.miniLength < 4 || this.systemInfo[i].infoList[k].pvalue.miniLength > 20) {
              this.message('请输入密码复杂性策略最小长度仅限输入4-20！', 'error');
              return false;
            }
            if (this.complicated.length <= 0) {
              this.message('请选择密码复杂性策略包含类型！', 'error');
              return false;
            }
            if (!this.systemInfo[i].infoList[k].pvalue.complicatedNum) {
              this.message('请选择密码复杂性策略类型组合数量！', 'error');
              return false;
            }
          }
          // 图报表配置
          if (this.systemInfo[i].tagDescription === '图报表配置') {
            this.systemInfo[i].infoList[k].pvalue.units = this.systemInfo[i].infoList[k].pvalue.info;
          }
        }
      }
      this.isLoading = true;
      let params = JSON.parse(JSON.stringify(this.systemInfo));
      params.forEach((item) => {
        item.infoList.forEach((cItem) => {
          if (cItem.tagDescription === '密码复杂性策略') {
            cItem.pvalue.complicated = this.complicated.join();
          }
          if (item.tagDescription === '敏感信息配置') {
            cItem.pvalue.forEach(gItem => {
              this.allfield.forEach((fieldItem) => {
                if (fieldItem.id === gItem.value1) {
                  gItem.value2 = fieldItem.fieldValue;
                  gItem.value3 = fieldItem.fieldName;
                }
              });
            });
          }
          cItem.pvalue = JSON.stringify(cItem.pvalue);
        });
      });
      upOrAddConfig(params)
        .then(res => {
          if (res.data.code === 200) {
            this.message(res.data.msg, 'success');
          } else {
            this.message(res.data.msg, 'error');
          }
          this.isLoading = false;
          this.$store.dispatch('ruleEditMode');
          this.$store.commit('updatePwdPolicy');
        });
    }
  },
  mounted () {
    window.addEventListener('resize', this.onWindowResize);
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onWindowResize);
  }
};
</script>
<style lang="stylus" scoped>
>>> .container{
  background: #fff;
}
>>> .col {
  padding-top: 5px !important;
  padding-bottom: 5px !important;
  height 50px;
}
.header_bg_color {
  height: 40px;
  padding: 0;
  padding-left: 10px;
  background: var(--v-seeDetailsHeadBgColor-base) !important;
  color: #000;
  font-size: 16px;
}
.system {
  width: 96%;
}
.colReset {
  padding-right: 0;
  margin: 0;
  text-align: center;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.btnCancel {
  text-align: right;
  margin-right: 15%;
}
.row {
  margin-left: 0;
}
.hasBorder {
  border: 1px solid var(--v-seeDetailsHeadBgColor-base);
  margin-bottom: 10px;
}
.vCenter {
  line-height: 40px;
}
.pwdLock > div {
  display: flex;
  width: 100px;
  align-items: center;
  margin-right: 10px;
}
.pwdLock > span {
  line-height: 40px;
  margin-right: 10px;
}
>>> .v-input--selection-controls {
  margin-top: 4px;
}
//.mainContent {
//  background: #fff;
//  padding: 42px 20%;
//  overflow: auto;
//}
</style>
