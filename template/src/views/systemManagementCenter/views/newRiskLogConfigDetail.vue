<!----------  @author: Xin Tan  ----------->
<!----------  @updated_at: 2020-04-09  ----------->
<!----------  @version: 0.2  ----------->

<template>
  <div>
    <v-card style="margin-bottom:20px">
       <v-card-actions style="height:60px">
          <v-btn  color="primary" class="ml-4"  @click="saveGroup">保存</v-btn>
          <v-btn  class="ml-4 cancelButton" @click="cancelEdit" outlined >取消</v-btn>
       </v-card-actions>
    </v-card>
    <v-card>
      <v-card-text>
        <v-layout row wrap>
           <v-flex xs12 sm12 md6 lg3 xl2>
            <v-card class="elevation-0 mr-2 " style="height: 50vh">
              <v-card-title>
                数据日志数据源
              </v-card-title>
              <v-btn outlined large dense color="primary" class="mt-2" style="width:100%" @click="newGroup">新增分组</v-btn>
              <v-data-table
               :headers="groupHeader"
               :items="groupData"

               hide-default-footer
               class="elevation-0 ml-2 mt-2"
               no-data-text="请添加分组"
               @click:row="getCurrentGroup($event)"
             >
               <template v-slot:item.actions="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon small class="mr-2" @click="editGroup(item)">mdi-pencil</v-icon>
                  </template>
                  <span>编辑</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon small class="mr-2" @click="deleteGroup(item)">mdi-delete</v-icon>
                  </template>
                  <span>删除</span>
                </v-tooltip>
               </template>
             </v-data-table>
            </v-card>
           </v-flex>
           <v-flex xs12 sm12 md6 lg3 xl3>
            <v-card class="mr-1 elevation-0">
              <v-card-title>
                <span class="mr-2">当前分组:  {{selectedGroup.groupName}}</span><span class="ml-2" v-if="selectedGroup.fieldList">已选字段: {{ selectedGroup.fieldList.length}}</span>
              </v-card-title>
              <v-card-text style="overflow-y: auto; height: 60vh">
                <v-text-field
                  class="mt-2"
                  v-model="searchHeader"
                  append-icon="mdi-magnify"
                  label="输入字段名搜索"
                  clearable
                  single-line
                  hide-details
                  outlined dense
                ></v-text-field>
                <v-data-table
                  :items-per-page="1000"
                  class="elevation-0"
                  :headers="confListHeader"
                  :items="configurableFieldList"
                  show-select
                  hide-default-header
                  hide-default-footer
                  v-model="selectedHeader"
                  item-key="id"
                  :search="searchHeader"
                  @item-selected="clicked($event)"
                >
                </v-data-table>
              </v-card-text>
            </v-card>
           </v-flex>
           <v-flex xs12 sm12 md8 lg6 xl6>
             <detail-card class="elevation-0 ml-1" :hitRule='detailsHitRule' :oplogDetail='oplogDetail' style="overflow-y: auto; height: 70vh"></detail-card>
           </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
    <!-- 公共弹框提示 -->
    <v-snackbar
      v-model="snackbarModel"
      :timeout="timeout"
      :color="snackbarColor"
      :top="isSnackbarTop"
    >
      {{ snackbarServeMsg }}
    </v-snackbar>
    <!-- 删除组件 -->
    <del-dialog
      :isDialogShow="delDialogSwitch"
      @cancelDel="delDialogCancel"
      @confimDel="delDialogConfirm">
    </del-dialog>
    <!-- 编辑弹框 -->
    <base-create-no-power
      :formHeader='baseAddOrEditHeader'
      :crudFormDialog='crudDialogSwitch'
      :formData='baseAddOrEditFormData'
      @cancelCrudFormDialog='cancelBaseEdit($event)'
      @confimDialogSave='baseAddOrEditSave($event)'
      @switchOnChange="addOrEditFormSwitch($event)">
    </base-create-no-power>
  </div>
</template>
<script>
import BaseCreateNoPower from '@/components/BaseCreateNoPower';
import DetailCard from '@/components/risklogDetailCard';
import DelDialog from '@/components/DelDialog';
import * as dataService from '@/api/riskLogConfig';
import { BASE_NAME, BASE_VALUE, BASE_NAME_TEXT, BASE_VALUE_TEXT } from 'utils/validate.js';
export default {
  name: 'newRiskLogConfigDetail',
  components: {
    DetailCard,
    DelDialog,
    BaseCreateNoPower
  },
  methods: {
    addOrEditFormSwitch (e) {
      if (e === false) {
        this.baseAddOrEditHeader = {
          name: '查看分组名称',
          value: 'edit',
          isEdit: true
        };
      } else {
        this.baseAddOrEditHeader = {
          name: '编辑分组名称',
          value: 'edit',
          isEdit: true
        };
      }
    },
    // 关闭编辑分组弹窗
    cancelBaseEdit () {
      this.crudDialogSwitch = false;
    },
    // 编辑分组内容控制
    baseAddOrEditSave ($event) {
      let item = $event[0];
      if (this.currentEditIndex >= 0) {
        this.groupData[this.currentEditIndex].groupName = item.value;
      }
      this.crudDialogSwitch = false;
    },
    showSnackBar (msg) {
      this.snackbarModel = true;
      this.snackbarServeMsg = msg;
    },
    async saveGroup () {
      let groups = [];
      for (let i in this.oplogDetail) {
        let item = Object.assign({}, this.oplogDetail[i]);
        item['fieldList'] = item['fieldList'].map(i => this.detailItemFromPageToAPI(i));
        item['sortNo'] = Number(i);
        groups.push(item);
      }
      let payload = {};
      payload['moduleId'] = this.moduleId;
      payload['groups'] = groups;
      // 后端要求 json
      let jsonObj = {};
      jsonObj['json'] = JSON.stringify(payload);
      let response = await dataService.addGroup(jsonObj);
      if (response.data.code === 200) {
        this.showSnackBar(response.data.msg);
      }
      // 3秒后跳转回到父级页面
      // 需要读取 sessionStorage 的 currentConfigType
      // 来判断页面跳转返回的来源,
      // 0 是 风控日志配置
      // 1 是 工单日志配置
      // let configTypeSource = sessionStorage.getItem('currentFieldConfigTab') || 0;
      setTimeout(() => { this.$router.push('/fieldConfig'); }, 1000);
    },
    cancelEdit () {
      this.$router.push('/fieldConfig');
    },
    newGroup () {
      let newGroupItem = {};
      let len = this.groupData.length;
      newGroupItem['groupName'] = '新建分组' + (len + 1);
      newGroupItem['sortNo'] = len + 1;
      newGroupItem['fieldList'] = [];
      this.groupData.push(newGroupItem);
      this.getCurrentGroup(newGroupItem);
    },
    // 获取数据字段资源池
    async queryConfFields () {
      let response = await dataService.queryConfiguarableFields();
      let fieldList = response.data.data;
      for (let i in fieldList) {
        let item = Object.assign({}, fieldList[i]);
        item.name = fieldList[i].fieldName;
        this.configurableFieldList.push(item);
      }
      // this.configurableFieldList = response.data.data;
    },
    async queryGroupDetail () {
      let response = await dataService.queryGroup({ id: this.moduleId });
      let groupDetail = [];
      if (response.data.data.groups.length > 0) {
        groupDetail = response.data.data.groups.sort((a, b) => a.sortNo - b.sortNo);
      }
      this.groupDataConverter(groupDetail);
      this.selectedGroup = this.groupData[0];
    },
    clicked (event) {
      console.info(event);
    },
    getCurrentGroup (group) {
      this.selectedGroup = group;
    },
    editGroup (item) {
      this.currentEditIndex = this.groupData.findIndex(i => i.sortNo === item.sortNo);
      this.crudDialogSwitch = !this.crudDialogSwitch;
      this.baseAddOrEditHeader = {
        name: '查看分组名称',
        value: 'edit',
        isEdit: true
      };
      this.baseAddOrEditFormData = [
        {
          label: '分组名称',
          value: item.groupName,
          type: 'text',
          required: true,
          rules: [v => !!v || '字段名不能为空', v => BASE_NAME.test(v) || BASE_NAME_TEXT, v => (v && v.length <= 50) || '最大50个字符']
        }
      ];
    },
    // 关闭删除弹窗
    delDialogCancel () {
      this.delDialogSwitch = !this.delDialogSwitch;
    },
    delDialogConfirm () {
      let index = this.groupData.findIndex(i => i.sortNo === this.currentDelteItem.sortNo);
      if (index >= 0) {
        this.groupData.splice(index, 1);
      }
      if (this.groupData.length > 0) {
        this.selectedGroup = this.groupData[0];
      } else {
        this.newGroup();
      }
      this.delDialogSwitch = !this.delDialogSwitch;
    },
    deleteGroup (item) {
      console.info('delete: ', item);
      this.currentDelteItem = item;
      this.delDialogSwitch = true;
    },
    groupDataConverter (groups) {
      if (groups.length === 0) {
        this.groupData = [];
        // 生成一个新对象
        this.groupData.push({ 'groupName': 'Xin', sortNo: '0', fieldList: [] });
      } else {
        for (var i = groups.length - 1; i >= 0; i--) {
          let item = {};
          item['groupName'] = groups[i].groupName;
          item['sortNo'] = groups[i].sortNo;
          item['fieldList'] = groups[i].confFieldList.map(item => this.detailItemFromAPIToPage(item)).sort((a, b) => a.sortNo - b.sortNo);
          this.groupData.unshift(item);
        }
      }
    },
    detailItemFromPageToAPI (param) {
      // id -> fieldSrcId
      // fieldName -> fieldText
      // fieldValue -> fieldName
      // searchSrc -> searchSrc
      let item = {};
      if (param.sortNo) {
        item['sortNo'] = param.sortNo;
      }
      if (param.id) {
        item['fieldSrcId'] = param.id;
      }
      if (param.fieldName) {
        item['fieldText'] = param.fieldName;
      }
      if (param.fieldValue) {
        item['fieldName'] = param.fieldValue;
      }
      if (param.searchSrc) {
        item['searchSrc'] = param.searchSrc;
      }
      return item;
    },
    detailItemFromAPIToPage (param) {
      // fieldSrcId -> id
      // fieldName -> fieldValue
      // fieldText -> fieldName
      // fieldText -> name
      // searchSrc -> searchSrc
      let item = {};
      if (param.sortNo) {
        item['sortNo'] = param.sortNo;
      }
      if (param.fieldSrcId) {
        item['id'] = param.fieldSrcId;
      }
      if (param.fieldText) {
        item['fieldName'] = param.fieldText;
        item['name'] = param.fieldText;
      }
      if (param.fieldName) {
        item['fieldValue'] = param.fieldName;
      }
      if (param.searchSrc) {
        item['searchSrc'] = param.searchSrc;
      }
      return item;
    }
  },
  data () {
    return {
      // 编辑弹窗
      currentEditIndex: null,
      crudDialogSwitch: false, // 详情页编辑弹窗开关
      baseAddOrEditHeader: {
        name: '分组名称',
        isEdit: false
      },
      baseAddOrEditFormData: [],
      // 删除弹窗提示
      delDialogSwitch: false,
      currentDelteItem: null,
      // 保存成功/失败的提示bar
      snackbarModel: false,
      snackbarColor: 'success',
      isSnackbarTop: true,
      timeout: 2000,
      snackbarServeMsg: '',
      // 业务数据
      searchHeader: '',
      confListHeader: [
        { text: '表头1', value: 'fieldName' }
      ],
      configurableFieldList: [],
      selectedGroup: {},
      groupHeader: [
        { text: '分组名', value: 'groupName' },
        { text: '操作类型', value: 'actions' }
      ],
      groupData: [],
      moduleId: '',
      detailsHitRule: {
        simulatedResult: {
          matchType: '',
          hit_labels: '',
          strategy: '',
          hit_rules: [
            {
              rule_score: '',
              rule_name: '',
              rule_no: ''
            },
            {
              rule_score: '',
              rule_name: '',
              rule_no: ''
            },
            {
              rule_score: '',
              rule_name: '',
              rule_no: ''
            }
          ]
        },
        officialResult: {
          matchType: '',
          hit_labels: '',
          strategy: '',
          hit_rules: [
            {
              rule_score: '',
              rule_name: '',
              rule_no: ''
            },
            {
              rule_score: '',
              rule_name: '',
              rule_no: ''
            },
            {
              rule_score: '',
              rule_name: '',
              rule_no: ''
            }
          ]
        }
      } // 左侧的风险策略列表 - 纯展示无用
    };
  },
  mounted () {
    let sessionStorage = window.sessionStorage;
    this.moduleId = JSON.parse(sessionStorage.getItem('moduleId'));
    // 获取资源列表
    this.queryConfFields();
    this.queryGroupDetail();
  },
  computed: {
    oplogDetail () {
      if (!this.groupData) {
        return [];
      }
      let oplogList = [];
      for (var i = this.groupData.length - 1; i >= 0; i--) {
        let item = Object.assign({}, this.groupData[i]);
        item['groupData'] = this.groupData[i].fieldList;
        oplogList.unshift(item);
      }
      return oplogList;
    },
    selectedHeader: {
      get: function () {
        if (!this.selectedGroup) {
          return [];
        }
        return this.selectedGroup.fieldList;
      },
      set: function (newValue) {
        if (this.selectedGroup) {
          let id = this.selectedGroup.sortNo;
          for (let i in this.groupData) {
            if (String(id) === String(this.groupData[i].sortNo)) {
              console.info('this is: ', this.groupData[i]);
              this.groupData[i].fieldList = newValue;
            }
          }
        }
      }
    }
  }
};
</script>
<style></style>
