<!--author：Fc -->
<!--updateTime：2021-05-24-->
<template>
  <div>
    <v-card class="mb-3 mt-3 elevation-3">
      <v-card-actions style="height:60px">
        <v-btn class="ml-4" @click="saveEffectRiskWeight" depressed color="primary">保存</v-btn>
        <v-btn class="ml-4 cancelButton" @click="cancel" outlined>返回</v-btn>
      </v-card-actions>
    </v-card>
    <v-card class="mb-3 elevation-3">
      <v-card-title class="pt-4 pb-2" style="font-weight: bold;font-size: 14px;">基本信息</v-card-title>
      <v-card-text class="pb-0">
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <div class="ruleSetParam">
                <v-row>
                  <v-col cols="4">
                    <p>任务名称：{{ pageParams.detailInfo.riskTaskName }}</p>
                  </v-col>
                  <v-col cols="4">
                    <p>任务类型：{{ pageParams.detailInfo.riskTaskType | riskTaskTypeFilter }}</p>
                  </v-col>
                  <v-col cols="4">
                    <p>数据范围：{{ pageParams.detailInfo.dataRange | rangeFilter(pageParams.detailInfo.dataRangeValue)}}</p>
                  </v-col>
                </v-row>
              </div>
              <div class="ruleSetParam">
                <v-row>
                  <v-col cols="4">
                    <p>执行频次：{{ pageParams.detailInfo.taskFrequency | taskFrequencyFilter(pageParams.detailInfo.taskFrequencyValue) }}</p>
                  </v-col>
                  <v-col cols="4">
                    <p>执行时间：{{ pageParams.detailInfo.taskTime }}</p>
                  </v-col>
                  <v-col cols="4">
                    <p>任务创建时间：{{ pageParams.detailInfo.createTime }}</p>
                  </v-col>
                </v-row>
              </div>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-title class="pt-0 pb-2" style="font-weight: bold;font-size: 14px;">风险等级配置</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="4" style="display: flex;" v-for="(item, index, i) in pageParams.riskLevelList" :key="index">
            <span v-if="((i + 3) % 3) === 0" class="pr-1 ml-4" style="line-height: 40px;color: rgba(0,0,0,0.87);">{{ item }}：</span>
            <span v-if="((i + 3) % 3) === 1" class="pr-1 ml-1" style="line-height: 40px;color: rgba(0,0,0,0.87);">{{ item }}：</span>
            <span v-if="((i + 3) % 3) === 2" class="pr-1" style="margin-left: -4px;line-height: 40px;color: rgba(0,0,0,0.87);">{{ item }}：</span>
            <v-col cols="5" class="pa-0">
              <v-text-field dense outlined v-model="riskLevelList[index]"
                            :rules="levelRules"/>
            </v-col>
            <span class="pl-1" style="line-height: 40px;">%</span>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card class="mb-3 elevation-3">
      <v-card-title class="pt-4 pb-2" style="font-weight: bold;font-size: 14px;">权重列表</v-card-title>
      <v-card-text class="ml-4">
        <v-row v-for="(item, index) in pageParams.weightList" :key="index">
          <v-col cols="3">
            <v-autocomplete
              v-model="item.appId"
              item-text="text"
              item-value="value"
              :items="allAppList"
              outlined
              dense
              no-data-text="没有匹配数据"
              @change="appChange(item, index)"
              @focus="appFocus(item, index)"
            />
          </v-col>
          <v-col cols="3">
            <v-autocomplete
              v-model="item.opType"
              item-text="text"
              item-value="value"
              :items="item.allTradeTypeList"
              outlined
              dense
              no-data-text="没有匹配数据"
              @change="tradeTypeChange(item)"
            />
          </v-col>
          <v-col cols="3">
            <v-text-field dense outlined v-model="item.weight" placeholder="请输入权重值" :rules="levelRules2"/>
          </v-col>
          <v-col cols="3" style="display: flex;align-items: center;">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon class="mr-3 icon-primary"
                        v-on="on" color="primary" @click="addWeight">
                  mdi-plus-circle
                </v-icon>
              </template>
              <span>添加</span>
            </v-tooltip>
            <v-tooltip bottom v-if="pageParams.weightList.length > 1">
              <template v-slot:activator="{ on }">
                <v-icon class="mr-3 icon-primary"
                        v-on="on" color="primary" @click="deleteWeight(index)">
                  mdi-delete
                </v-icon>
              </template>
              <span>删除</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </v-card-text>
    <!-- 暂时隐藏 -->
    <!-- <v-card-title class="pt-4 pb-2" style="font-weight: bold;font-size: 14px;">执行策略</v-card-title>
      <v-card-text>
        &lt;!&ndash; 执行策略 &ndash;&gt;
        <div class="mb-3">
          <v-row dense class="ruleSetAddOrEdit" v-for="(currItem, index) in operateStrategyItems" :key="'strategyItem' + index">
            <v-col cols="12">
              <div class="strategy-stepHeight pr-2 float-left">当</div>
              <div class="float-left strategy-stepWidth" style="width: 11%;">
                <v-select
                  v-model="currItem.disposalStrategyId"
                  item-text="selectText"
                  item-value="selectField"
                  :items="disposalConditionItems"
                  placeholder="请选择处置条件"
                  dense
                  outlined
                  no-data-text="没有匹配数据"
                />
              </div>
              <div class="strategy-stepHeight pl-1 pr-1 float-left">时，命中</div>
              <div class="float-left strategy-stepWidth">
                <v-select
                  v-model="currItem.riskLabel"
                  item-text="selectText"
                  item-value="selectField"
                  :items="riskLabelItems"
                  placeholder="请选择风险标签"
                  dense
                  outlined
                  no-data-text="没有匹配数据"
                />
              </div>
              <div class="strategy-stepHeight pl-1 pr-1 float-left">执行</div>
              <div class="float-left strategy-stepWidth balck-active-item list-data-input">
                <v-select
                  v-model="currItem.disposalActionId"
                  item-text="selectText"
                  item-value="selectField"
                  :items="blackActionItems"
                  placeholder="请选择加黑动作"
                  multiple
                  dense
                  outlined
                  no-data-text="没有匹配数据"
                  @change="getlistTypeItems(index, currItem.disposalActionId,false)"
                />
              </div>
              <div class="strategy-stepHeight pl-1 float-left"></div>
              &lt;!&ndash; 名单集 &ndash;&gt;
              <div class="float-left strategy-stepWidth listTree">
                <treeselect
                  :multiple="true"
                  :options="currItem.disposalActionList"
                  :disable-branch-nodes="true"
                  :normalizer="normalizer"
                  placeholder="名单集"
                  :value-consists-of="valueConsistsOf"
                  v-model="currItem.listDataId"
                  noChildrenText="没有数据"
                  noResultsText="没有匹配数据"
                  noOptionsText="没有匹配数据"
                />
              </div>
              <div class="strategy-stepHeight pl-1 pr-1 float-left">，生成</div>
              <div class="float-left strategy-stepWidth" style="width: 10%;">
                <v-select
                  v-model="currItem.workOrderId"
                  item-text="selectText"
                  item-value="selectField"
                  :items="workOrderItems"
                  placeholder="请选择工单类型"
                  dense
                  outlined
                  no-data-text="没有匹配数据"
                />
              </div>
              <div class="float-left pl-1 strategy-stepWidth" style="width: 8%;">
                <v-text-field
                  v-model="currItem.priority"
                  placeholder="优先级"
                  dense
                  outlined
                  type="number"
                />
              </div>
              <div class="float-left" style="width: 8%">
                <v-icon
                  color="primary"
                  class="ml-4"
                  style="height:40px;float:left"
                  @click.stop="addStrategyItem(index)"
                >mdi-plus-circle
                </v-icon>
                <v-icon
                  color="primary"
                  class="ml-1"
                  style="height:40px;float:left"
                  @click.stop="delStrategyItem(index)"
                  v-if="operateStrategyItems.length > 1"
                >mdi-minus-circle
                </v-icon>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-card-text>-->
    </v-card>
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
import {
  saveEffectRiskWeight
} from '@/api/riskMonitoringTask';
import {
  queryTradeType
} from 'api/riskMarket';
import { mapGetters } from 'vuex';
import * as dataService from 'api/sceneManagement';
// import { Treeselect } from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import { getAllUsersList } from 'api/checkEfficiency';
export default {
  name: 'riskDetail',
  data () {
    return {
      // 提示框
      timeout: 2000,
      isSnackbarTop: true,
      snackbarServe: false,
      snackbarServeMsg: '',
      snackbarServeColor: '', // success', 'info', 'error' 三种类型
      pageParams: '',
      // app列表
      allAppList: [],
      // 交易类型列表
      allTradeTypeList: [],
      // 处置条件
      disposalConditionItems: [],
      // 风险标签
      riskLabelItems: [],
      // 加黑动作
      blackActionItems: [],
      valueConsistsOf: 'ALL_WITH_INDETERMINATE',
      // 选择工单
      workOrderItems: [],
      operateStrategyItems: [],
      levelRules: [
        v => !!v || '不能为空',
        v => ((/^\d\.([1-9]{1,2}|[0-9][1-9])$|^[0-9]\d{0,1}(\.\d{1,2}){0,1}$|^100(\.0{1,2}){0,1}$/).test(v)) || '只能输入0-100的数字'
      ],
      levelRules2: [
        v => !!v || '不能为空',
        v => ((/^\d\.([1-9]{1,2}|[0-9][1-9])$|^[1-9]\d{0,1}(\.\d{1,2}){0,1}$|^100(\.0{1,2}){0,1}$/).test(v)) || '只能输入1-100的数字'
      ],
      riskLevelList: {},
      weightItem: '',
      weightIndex: ''
    };
  },
  // components: {
  //   Treeselect
  // },
  computed: {
    ...mapGetters([
      'appId',
      'secondLevelRouterItems',
      'appList'
    ])
  },
  watch: {
    appId: {
      handler: function (newVal, oldVal) {
        Promise.all([
          this.initData(),
          this.getAppListData(),
          this.getStrategiesList(),
          this.getRiskyLabelsList(),
          this.getDisposalActionList(),
          this.getWorkOrderList()
        ]);
      },
      immediate: true
    }
  },
  filters: {
    riskTaskTypeFilter: (type) => {
      let typeObj = {
        1: '账户风险监测',
        2: '企业风险监测',
        3: '商户风险监测'
      };
      return typeObj[type];
    },
    rangeFilter: (range, rangeValue) => {
      let rangeObj = {
        1: '近一周',
        2: '近一个月',
        3: '近三个月',
        4: '近六个月'
      };
      if (range !== 5) {
        return rangeObj[range];
      } else {
        return rangeValue + '天';
      }
    },
    taskFrequencyFilter: (frequency, frequencyValue) => {
      let frequencyObj = {
        1: '天',
        2: '周',
        3: '月'
      };
      return frequencyValue + frequencyObj[frequency];
    },
    textFilters: function (str, itemList) {
      let text = '';
      itemList.forEach(item => {
        if (typeof str === 'number') {
          str = String(str);
        }
        if (item.value === str) {
          text = item.text;
        }
      });
      return text;
    }
  },
  // beforeRouteLeave (to, from, next) {
  //   if (to.path !== '/riskMonitoringTaskList') {
  //
  //   }
  // },
  created () {
  },
  methods: {
    initData () {
      // 获取传入的参数
      if (this.secondLevelRouterItems) {
        this.pageParams = Object.assign({}, JSON.parse(JSON.stringify(this.secondLevelRouterItems)));
      }
      if (this.pageParams.detailInfo.riskLevel) {
        this.riskLevelList = JSON.parse(this.pageParams.detailInfo.riskLevel);
      } else {
        for (let i in this.pageParams.riskLevelList) {
          this.riskLevelList[i] = '';
        }
      }

      this.pageParams.weightList = this.pageParams.weightList && this.pageParams.weightList.length > 0
        ? this.pageParams.weightList : [{ appId: '', opType: '', weight: '' }];
      // let that = this;
      // (function loop (index) {
      //   setTimeout(function () {
      //     that.getTradeTypeList(that.pageParams.weightList[index], index);
      //     if (++index < that.pageParams.weightList.length) {
      //       loop(index);
      //     }
      //   }, 10);
      // })(0);
      this.pageParams.weightList.forEach((item, index) => {
        if (item.appId) {
          this.getTradeTypeList(item, index);
        }
      });
      // 执行策略隐藏
      // this.operateStrategyItems = [];
      // let strategy = this.pageParams.detailInfo.strategy ? JSON.parse(this.pageParams.detailInfo.strategy) : null;
      // if (!strategy || !Array.isArray(strategy) || strategy.length === 0) { // 执行策略为空时
      //   this.operateStrategyItems.push({
      //     disposalActionId: [],
      //     disposalActionList: [],
      //     riskLabel: '',
      //     priority: '',
      //     listDataId: [],
      //     workOrderId: '',
      //     listDataIds: []
      //   });
      // } else if (strategy && strategy.length > 0) {
      //   strategy.forEach(async (pItem, index) => {
      //     let listDataId = [];
      //     pItem.listDataIds && pItem.listDataIds.forEach((item) => {
      //       item.children && item.children.forEach((cItem) => {
      //         listDataId.push(cItem.id);
      //       });
      //     });
      //     this.operateStrategyItems.push({
      //       disposalStrategyId: pItem.disposalStrategyId,
      //       disposalActionList: [],
      //       disposalActionId: pItem.disposalActionId ? pItem.disposalActionId : !pItem.disposalActionId || pItem.disposalActionId === '[]' || pItem.disposalActionId === '' || pItem.disposalActionId === null ? [] : JSON.parse(pItem.disposalActionId),
      //       riskLabel: pItem.riskLabel,
      //       priority: pItem.priority.toString(),
      //       listDataId: listDataId,
      //       workOrderId: pItem.workOrderId,
      //       listDataIds: pItem.listDataIds
      //     });
      //     if (pItem.disposalActionId) {
      //       await this.getlistTypeItems(index, pItem.disposalActionId, true);
      //     }
      //   });
      // }
    },
    showMassage (msg, type) {
      this.snackbarServe = true;
      this.snackbarServeMsg = msg;
      this.snackbarServeColor = type || 'error';
    },
    cancel () {
      this.$router.go(-1);
    },
    // 保存
    saveEffectRiskWeight () {
      // 风险等级
      let levelNum = 0;
      for (let i in this.riskLevelList) {
        if (!this.riskLevelList[i]) {
          this.showMassage('请填写风险等级');
          return;
        } else if (this.riskLevelList[i] < 0 || this.riskLevelList[i] > 100) {
          this.showMassage('风险等级只能输入0-100之间的数字');
          return;
        } else {
          levelNum += this.riskLevelList[i] * 1;
        }
      }
      console.log(levelNum);
      if (levelNum !== 100) {
        this.showMassage('风险等级相加必须为100%！');
        return;
      }
      // 权重列表
      for (let i = 0; i < this.pageParams.weightList.length; i++) {
        if (!this.pageParams.weightList[i].appId || !this.pageParams.weightList[i].opType || !(this.pageParams.weightList[i].weight.toString())) {
          this.showMassage('权重列表规则配置请填写完整');
          return;
        }
        if (this.pageParams.weightList[i].weight <= 0 || this.pageParams.weightList[i].weight > 100) {
          this.showMassage('权重值只能输入0-100之间的数字');
          return;
        }
      }
      // 执行策略隐藏
      // for (let i = 0; i < this.operateStrategyItems.length; i++) {
      //   if (this.operateStrategyItems[i].listDataId === '' || this.operateStrategyItems[i].listDataId === null) {
      //     this.operateStrategyItems[i].listDataId = [];
      //   }
      //   if (this.operateStrategyItems[i].disposalActionId.length !== 0 && !this.operateStrategyItems[i].listDataId.toString()) {
      //     this.showMassage('请选择名单集');
      //     return;
      //   }
      //   // 处理往后台返回保存数据
      //   this.operateStrategyItems[i].strategys = [];
      //   // 名单集勾选的数据
      //   let listDataId = this.operateStrategyItems[i].listDataId;
      //   // 名单集整个树结构
      //   let disposalActionList = this.operateStrategyItems[i].disposalActionList;
      //   let partentId = '';
      //   listDataId.forEach(item => {
      //     partentId = '';
      //     disposalActionList.forEach(listItem => {
      //       if (listItem.children && listItem.children.length) {
      //         listItem.children.forEach(child => {
      //           if (child.id === item) {
      //             partentId = listItem.id;
      //           }
      //         });
      //       }
      //     });
      //     // 判断inputData中是否有parentId
      //     let has = false;
      //     if (this.operateStrategyItems[i].listDataIds.length) {
      //       this.operateStrategyItems[i].listDataIds.forEach(inputItem => {
      //         inputItem.children = [];
      //       });
      //       this.operateStrategyItems[i].listDataIds.forEach(inputItem => {
      //         if (inputItem.id === partentId) {
      //           has = true;
      //           inputItem.children.push({ id: item });
      //         }
      //       });
      //     }
      //     if (!has) {
      //       this.operateStrategyItems[i].listDataIds.push(
      //         {
      //           id: partentId,
      //           children: [{ id: item }]
      //         }
      //       );
      //     }
      //   });
      // }
      // let getResults = this.getObjectEqualResults(this.operateStrategyItems);// 判断处置策略有无重复
      // if (getResults) {
      //   this.showMassage('处置策略重复，请重新编辑');
      //   return;
      // }
      // for (let i = 0; i < this.operateStrategyItems.length; i++) {
      //   delete this.operateStrategyItems[i].disposalActionList;
      //   delete this.operateStrategyItems[i].listDataId;
      // }
      let params = {
        riskTaskId: this.pageParams.detailInfo.id,
        riskLevel: JSON.stringify(this.riskLevelList),
        // strategy: JSON.stringify(this.operateStrategyItems),
        weightList: this.pageParams.weightList
      };
      saveEffectRiskWeight(params).then(res => {
        if (res.data.code === 200) {
          this.showMassage('保存成功', 'success');
          this.cancel();
        } else {
          this.showMassage(res.data.msg);
        }
      }).catch(error => {
        this.showMassage(error.data.msg);
      });
    },
    // 两个对象比较是否相同
    isObjectValueEqual (a, b) {
      let aProps = Object.getOwnPropertyNames(a);
      let bProps = Object.getOwnPropertyNames(b);
      if (aProps.length !== bProps.length) {
        return false;
      }
      for (let i = 0; i < aProps.length - 1; i++) {
        let propName = aProps[i];
        let propA = a[propName];
        let propB = b[propName];
        if (Array.isArray(propA) && Array.isArray(propB) && propA.sort().toString() !== propB.sort().toString()) {
          return false;
        } else if (!Array.isArray(propA) && !Array.isArray(propB) && propA !== propB) {
          return false;
        }
      }
      return true;
    },
    getObjectEqualResults (data) {
      let arr = data;
      let i = 0;
      while (i < arr.length - 1) {
        for (let j = i + 1; j < arr.length; j++) {
          let isshow = this.isObjectValueEqual(arr[i], arr[j]);
          if (isshow) { // 如果比较的两个对象相同就返回true
            return true;
          }
        }
        i++;
      }
      return false;
    },
    appFocus (item, index) {
      this.weightItem = item;
      this.weightIndex = index;
    },
    appChange (item, index) {
      this.pageParams.weightList[index].opType = '';
      for (let i = 0; i < this.pageParams.weightList.length; i++) {
        if (this.pageParams.weightList[i].appId === this.weightItem.appId && i !== this.weightIndex) {
          this.$set(this.pageParams.weightList[index], 'allTradeTypeList', this.pageParams.weightList[i].allTradeTypeList);
          return;
        }
      }
      this.getTradeTypeList(item, index);
    },
    // 权重列表添加
    addWeight () {
      this.pageParams.weightList.push({ appId: '', opType: '', weight: '' });
    },
    // 权重列表删除
    deleteWeight (index) {
      if (this.pageParams.weightList.length <= 1) {
        return;
      }
      let deleteItem = this.pageParams.weightList.splice(index, 1);
      this.$nextTick(() => {
        this.tradeTypeChange(deleteItem[0]);
      });
    },
    // 处理所属应用下拉数据
    async getAppListData () {
      if (this.appList.length > 0) {
        const currAppList = await this.appList;
        currAppList.forEach((item, index, ary) => {
          this.allAppList.push(
            { text: item.appName, value: item.id, tag: item.appTag }
          );
        });
      }
    },
    // 获取交易类型
    getTradeTypeList (item, idx) {
      let param = {
        jsonIds: JSON.stringify([item.appId])
      };
      queryTradeType(param).then(response => {
        if (response.data.code === 200) {
          let resTradeTypeItems = response.data.data;
          let allTradeTypeList = [];
          resTradeTypeItems.forEach((item, index, ary) => {
            allTradeTypeList.push({
              text: item.tradeName,
              value: item.identifier,
              disabled: false
            });
          });
          this.$set(this.pageParams.weightList[idx], 'allTradeTypeList', allTradeTypeList);
          this.$nextTick(() => {
            this.tradeTypeChange(item);
          });
        }
      });
    },
    tradeTypeChange (item) {
      this.pageParams.weightList.forEach((itm) => {
        if (item.appId === itm.appId) {
          itm.allTradeTypeList && itm.allTradeTypeList.forEach(typeItem2 => {
            typeItem2.disabled = false;
          });
          itm.allTradeTypeList && itm.allTradeTypeList.forEach(typeItem2 => {
            this.pageParams.weightList.forEach(cItem => {
              if (cItem.opType === typeItem2.value) {
                if (item.appId === cItem.appId) {
                  typeItem2.disabled = true;
                }
              }
            });
          });
        }
      });
    },
    // 获取执行策略
    async getStrategiesList () {
      const params = {
        identifier: 'sys_strategy'
      };
      try {
        const response = await dataService.getAllTradeType(params);
        this.strategies = response.data.data;
        this.strategies.forEach(item => {
          this.disposalConditionItems.push({
            selectText: item.paramName,
            selectField: item.id
          });
        });
      } catch (error) {}
    },
    // 获取风险标签
    async getRiskyLabelsList () {
      const params = {
        identifier: 'sys_risk_label'
      };
      try {
        const response = await dataService.getAllTradeType(params);
        this.riskyLabels = response.data.data;
        this.riskyLabels.forEach(item => {
          this.riskLabelItems.push({
            selectText: item.paramName,
            selectField: item.id
          });
        });
      } catch (error) {}
    },
    // 获取处置动作数据
    async getDisposalActionList () {
      try {
        const response = await dataService.getDisposalActionList();
        let res = response.data.data;
        res.forEach(item => {
          this.blackActionItems.push({
            selectText: item.tmplName,
            selectField: item.id
          });
        });
      } catch (error) {
        console.log(error, '下拉选择错误');
      }
    },
    // 获取s暂停业务内容
    async getlistTypeItems (index, paramId, type) {
      try {
        if (paramId) { // 不是请选择时再调接口查询
          let params = {
            appId: this.appId,
            blackListStrategyId: type ? paramId.join(',') : paramId.toString()
          };
          // 选执行下拉后的级联二级下拉列表
          const res = await dataService.queryNameListNode(params);
          if (res.data.code === 200) {
            let nameListArry = res.data.data;
            let arr = [];
            // 迭代第一层
            nameListArry.forEach((v) => {
              arr.push({
                id: v.id,
                label: v.tag,
                children: []
              });
            });
            // 循环迭代第二级
            arr.forEach((o, j) => {
              nameListArry.forEach((v, m) => {
                if (o.id === v.id) {
                  // 比较查找对应id 下的children
                  if (v.data.length > 0) {
                    v.data.forEach((cItem) => {
                      o.children.push({
                        id: cItem.id,
                        label: cItem.listName
                      });
                    });
                  }
                }
              });
            });
            this.operateStrategyItems[index].disposalActionList = arr; // 树结构的option
          }
        } else {
          this.operateStrategyItems[index].disposalActionList = [];
          this.operateStrategyItems[index].listDataId = [];
        }
      } catch (err) {
        // 捕获错误信息
      }
    },
    // 树形结构上
    normalizer (node) {
      // 去掉children=null的属性
      if (node.children === null || node.children === 'null') {
        delete node.children;
      }
    },
    // 获取工单数据
    async getWorkOrderList () {
      const params = {
        identifier: 'work_order_id'
      };
      try {
        const response = await dataService.getAllTradeType(params);
        let res = response.data.data;
        res.forEach(item => {
          this.workOrderItems.push({
            selectText: item.paramName,
            selectField: item.id
          });
        });
      } catch (error) {}
    },
    // 添加一行执行策略
    addStrategyItem (index) {
      this.operateStrategyItems.splice(index + 1, 0, {
        disposalActionList: [], // 树形的option
        disposalActionId: [], // 加黑动作
        riskLabel: '',
        priority: '',
        listDataId: [],
        workOrderId: '',
        listDataIds: []
      });
    },
    // 删除一行执行策略
    delStrategyItem (index) {
      if (this.operateStrategyItems.length <= 1) {
        return;
      }
      this.operateStrategyItems.splice(index, 1);
    }
  }
};
</script>

<style scoped>
.float-left {
  float: left;
}
.strategy-stepHeight {
  height: 40px;
  line-height: 40px;
}
.strategy-stepWidth {
  width: 15%;
}
.list-data-input >>> .v-input__slot input {
  padding: 0 !important;
  max-height: 16px;
}
.list-data-input  >>> .v-input__control{
  height:auto;
}
.listTree >>> .vue-treeselect__control{
  height:40px
}
</style>
