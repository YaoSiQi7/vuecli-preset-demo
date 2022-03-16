<template>
  <div class="enu-content">
    <v-card :style="{height: tableHeight + 84 + 'px', 'overflow-y': 'auto'}">
      <v-card-title style="font-size: 16px;" class="pb-0">规则导出</v-card-title>
      <v-card-text class="totalMain">
        <v-row class="px-10" style="height: 100%;flex: 1;width: 100%;">
          <v-col>
            <span class="exportTitle">本地规则集列表</span>
            <div class="exportMain mt-2">
              <v-row>
                <v-col cols="8" class="pt-0">
                  <v-text-field
                    style="background: #fff;"
                    v-model="searchVal"
                    label="请输入关键词搜索"
                    single-line
                    outlined
                    dense
                    class="py-0"
                    height="28px"
                    @keyup.enter="searchFn"
                  >
                    <template v-slot:append>
                      <v-icon @click="clearSearch" dense class="mt-1">mdi-close-circle</v-icon>
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="4" style="text-align: right;" class="pt-0">
                  <v-btn color="primary" block style="height: 40px;border-color: rgba(0,0,0,.14);" @click="searchFn">搜索</v-btn>
                </v-col>
              </v-row>
              <div :style="[styles, {height: this.tableHeight - 210 + 'px'}]">
                <v-treeview
                  :items="localArray"
                  :search="search"
                  selection-type="independent"
                >
                  <template v-slot:prepend="{ item, open }">
                    <!-- true是全选 -->
                    <v-icon style="color:var(--v-primary-base) !important;"
                            v-if="item.selected === true" @click.stop="getEqual(item)">mdi-checkbox-marked</v-icon>
                    <!-- 2是半选 -->
                    <v-icon style="color:var(--v-primary-base) !important;"
                            v-else-if="item.selected === 2" @click.stop="getEqual(item)">mdi-minus-box</v-icon>
                    <!-- false是不选 -->
                    <v-icon v-else @click.stop="getEqual(item)">mdi-checkbox-blank-outline</v-icon>
                  </template>
                </v-treeview>
              </div>
              <div>
                <v-checkbox class="mt-2"
                  v-model="isAllSelect" @change="selectAll"
                  label="全选"
                ></v-checkbox>
              </div>
            </div>
          </v-col>
          <v-col cols='1' class="yCenter">
            <v-icon style="font-size: 60px;">mdi-chevron-double-right</v-icon>
          </v-col>
          <v-col>
            <span class="exportTitle">导出规则集列表</span>
            <div class="exportMain mt-2" :style="{height: this.tableHeight - 94 + 'px'}">
              <div :style="[styles, {height: this.tableHeight - 210 + 'px', 'margin-top':'52px'}]">
                <v-treeview
                  :items="localArraySectionTree"
                  return-object
                >
                  <template v-slot:append="{ item }">
                    <v-icon @click="getEqual(item)">mdi-close</v-icon>
                  </template>
                </v-treeview>
              </div>
            </div>
          </v-col>
        </v-row>
        <v-btn
          color="primary"
          large
          style="width: 100px;margin-left: 40px;"
          @click="preExport"
        >
          导出
        </v-btn>
      </v-card-text>
    </v-card>

    <loadingOverlays :overlay="overlay" :progress="progress" :title="title"></loadingOverlays>

    <!-- 导出提示 -->
    <v-dialog
      v-model="exportDialog"
      persistent
      width="381"
    >
      <v-card class="pr-4">
        <v-card-title class="headline pt-4">提示</v-card-title>
        <v-card-text class="mt-4">请确认是否导出？</v-card-text>
        <v-card-actions class="pb-4">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            @click="getRulesetGetExportId"
          >
            确定
          </v-btn>
          <v-btn
            color="primary"
            outlined
            @click="exportDialog = false"
          >
            取消
          </v-btn>
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
  </div>
</template>

<script>
import loadingOverlays from '@c/loadingOverlays';
import * as dataService from 'api/ruleSynchronization';
// 递归循环遍历
// ob为一个对象 返回的也是一个对象或数组
// 当bools为1 返回父节点 和 子节点与自身 两者组合的 数组 (默认)
// 当bools为2 返回父节点 对象类型
// 当bools为3 返回子节点与自身 对象类型
function getLeafLoop (ob, id, bools = 1) {
  if (ob['children']) {
    let resultOb = []; // 先定义个返回值 为空数组
    for (let j = 0; j < ob['children'].length; j++) {
      if (ob['children'][j].id !== id) {
        resultOb = getLeafLoop(ob['children'][j], id);
        // 必须要有中断的解决办法，不然整个循环会继续下去，结果会变成undefined
        if (resultOb) {
          break;
        }
      } else {
        if (bools === 1) {
          // 返回父节点 子节点和自身
          resultOb = [ob, ob['children'][j]];
        } else if (bools === 2) {
          // 返回父节点
          resultOb = ob;
        } else {
          // 返回子节点和自身
          resultOb = ob['children'][j];
        }
        break;
      }
    }
    // 因为返回结果根据bools有三种情况，所以要排除掉 空数组的返回
    // 当没有合适的匹配时，返回的是 undefined，即没有返回
    if ((!Array.isArray(resultOb)) || resultOb.length > 0) {
      return resultOb;
    }
  }
}
// itemsArr为一个数组, 默认情况下，传入的是所有渲染的数据 items
// 返回一对象或者数组，
// 找到与id值一致的节点
// 当bools为1 返回父节点 和 子节点与自身 两者组合的 数组 (默认)
// 当bools为2 返回父节点 对象类型
// 当bools为3 返回子节点与自身 对象类型
function getLeaf (itemsArr, id, bools = 1) {
  let returnOb = [];
  for (let i = 0; i < itemsArr.length; i++) {
    if (itemsArr[i].id !== id) {
      returnOb = getLeafLoop(itemsArr[i], id, bools);
      if (returnOb) {
        // 如果返回的不是undefined，则停止循环
        break;
      }
    } else {
      // id为根节点时，返回自身
      if (bools === 1) {
        // 特殊情况，如果点击的节点，是根节点，则 父节点和 子节点与自身 都是自己
        returnOb = [itemsArr[i], itemsArr[i]];
      } else {
        returnOb = itemsArr[i];
      }
      break; // 结束循环
    }
  }
  // 因为返回结果根据bools有三种情况，所以要排除掉 空数组的返回
  // 当没有合适的匹配时，返回的是 undefined，即没有返回
  if ((!Array.isArray(returnOb)) || returnOb.length > 0) {
    return returnOb;
  }
}
// 修改节点下的所有selected 的状态;
// 属性的selected 为 判断标准
// arr为一个数组
function changeSelect (arr, bools) {
  if (!arr || arr.length === 0) return;
  for (let i = 0; i < arr.length; i++) {
    arr[i].selected = bools;
    if (arr[i].children && arr[i].children.length > 0) {
      changeSelect(arr[i].children, bools);
    }
  }
}
// 返回父节点下的子节点的状态
// 返回一个二维数组，第一项为选中的项， 第二项为没有被选中的项
// arr为一个数组
function leafSelectStatus (arr) {
  if (!arr || arr.length === 0) return;
  let seleTrue = [];
  let seleFalse = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].selected) { // 将 true 和 2 的状态 归为一组（如果有需要可以分开）
      seleTrue.push(arr[i].id); // 这里设置返回的选中的节点 数据内容
    } else {
      seleFalse.push(arr[i].id); // 这里设置返回的未选中的节点 数据内容
    }
    if (arr[i].children && arr[i].children.length > 0) {
      // 递归，继续查找子节点下的子节点
      let resultOb = leafSelectStatus(arr[i].children);
      // 拼接上 子节点下的子节点 返回的数据
      seleTrue = seleTrue.concat(resultOb[0]);
      seleFalse = seleFalse.concat(resultOb[1]);
    }
  }
  return [seleTrue, seleFalse];
}
// 修改爷爷辈的节点selected
function changeGraFatherStatus (itemArr, id) {
  let resultob = getLeaf(itemArr, id);
  let sonStatus = leafSelectStatus(resultob[0].children);
  if (sonStatus[0].length > 0 && sonStatus[1].length > 0) {
    // 此时parent变为 半选状态
    resultob[0].selected = 2;
    // 这时候需要继续向根节点 做进一步修改
    if (resultob[0].id !== resultob[1].id) {
      changeGraFatherStatus(itemArr, resultob[0].id);
    }
  } else if (sonStatus[0].length === 0 && sonStatus[1].length > 0) {
    // 此时parent应该变成未选中
    resultob[0].selected = false;
    // 这时候需要继续向根节点 做进一步修改
    if (resultob[0].id !== resultob[1].id) {
      changeGraFatherStatus(itemArr, resultob[0].id);
    }
  } else if (sonStatus[0].length > 0 && sonStatus[1].length === 0) {
    // 此时parent应该变成选中
    resultob[0].selected = true;
    // 这时候需要继续向根节点 做进一步修改
    // 如果该节点就是根节点，不在进行循环
    if (resultob[0].id !== resultob[1].id) {
      changeGraFatherStatus(itemArr, resultob[0].id);
    }
  }
}
export default {
  name: 'ruleExport',
  components: {
    loadingOverlays
  },
  data () {
    return {
      overlay: false,
      progress: 0, // 进度
      title: '正在导出...',
      fullHeight: window.innerHeight,
      styles: {
        'overflow-y': 'auto',
        'background': '#fff',
        'border': '1px solid rgba(0,0,0,.14)'
      },
      search: '',
      searchVal: '',
      localArray: [],
      totalLocalSectionNum: 0, // 所有可选中数量
      localArraySectionTree: [], // 导出规则集树形
      isAllSelect: false, // 是否全选
      exportDialog: false,
      exportBody: {
        appIds: '',
        opIds: '',
        ruleSetIds: '',
        tree: '',
        exportId: ''
      },
      // 提示语
      snackbarServe: false,
      snackbarServeMsg: '',
      snackbarServeColor: '', // success', 'info', 'error' 三种类型
      isSnackbarTop: true,
      timeout: 2000
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
    this.getRulesetShowExport();
  },
  beforeDestory () {
    window.removeEventListener('resize', this.onWindowResize);
  },
  methods: {
    onWindowResize (event) {
      this.tableHeight = window.innerHeight;
    },
    // 获取选中的
    getSelect () {
      let theSelectArr = [];
      this.localArray.forEach((item) => {
        if (item.selected !== false) {
          if (!this.arrObjSome(item, theSelectArr)) {
            theSelectArr.push({ ...item, children: [] });
          }
          item.children && item.children.forEach((cItem) => {
            if (cItem.selected !== false) {
              let oneIndex = this.getArrObjIndex(item, theSelectArr);
              if (!this.arrObjSome(cItem, theSelectArr[oneIndex].children)) {
                theSelectArr[oneIndex].children.push({ ...cItem, children: [] });
              }
              cItem.children && cItem.children.forEach((gItem) => {
                if (gItem.selected !== false) {
                  let twoIndex = this.getArrObjIndex(cItem, theSelectArr[oneIndex].children);
                  if (!this.arrObjSome(gItem, theSelectArr[oneIndex].children[twoIndex].children)) {
                    theSelectArr[oneIndex].children[twoIndex].children.push(gItem);
                  }
                }
              });
            }
          });
        }
      });
      let arr = JSON.parse(JSON.stringify(this.localArray));
      let selectedArr = arr.filter(item => {
        return item.selected !== true;
      });
      selectedArr.length === 0 ? this.isAllSelect = true : this.isAllSelect = false;
      this.localArraySectionTree = theSelectArr;
    },
    // 获取选中元素原始数据
    getPrimaryItem (arr, clickItem) {
      let primaryItem;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === clickItem.id) {
          primaryItem = arr[i];
          return primaryItem;
        } else if (arr[i].children) {
          primaryItem = this.getPrimaryItem(arr[i].children, clickItem);
          if (primaryItem) {
            return primaryItem;
          }
        }
      }
    },
    // 点击节点的时候 会触发该函数
    getEqual (clickItem) {
      // 别动，当我写这段代码的时候只有两个人知道意思，而现在只有天知道什么意思了
      clickItem = this.getPrimaryItem(this.localArray, clickItem);
      let leafArr = getLeaf(this.localArray, clickItem.id);
      let parent = '';
      // 获取父节点（包含父节点的对象）  和 子节点与自身（自身的对象） 的数组
      parent = leafArr[0];
      // 改变自身的selected， 该事件是由点击事件造成，而不是循环事件
      clickItem.selected ? clickItem.selected = false : clickItem.selected = true;
      this.setSelected(clickItem);
      // if (clickItem.level === 1) { // 如果点击的元素为一级
      //   // let oneLevel = clickItem;
      //   let twoLevel = clickItem.children || [];
      //   let threeLevel = [];
      //   twoLevel.forEach(item => {
      //     item.children && item.children.forEach(cItem => {
      //       threeLevel.push(cItem);
      //     });
      //   });
      //   this.localArray.forEach(item => {
      //     item.children && item.children.forEach(cItem => {
      //       twoLevel.forEach(cObj => {
      //         if (this.getPrimaryId(cObj.id) === this.getPrimaryId(cItem.id)) {
      //           if (cObj.children && cItem.children) {
      //             cItem.children.forEach(gItem => {
      //               threeLevel.forEach(gObj => {
      //                 if (this.getPrimaryId(gObj.id) === this.getPrimaryId(gItem.id)) {
      //                   gItem.selected = clickItem.selected;
      //                   this.setSelected(gItem);
      //                 }
      //               });
      //             });
      //           } else if (!cObj.children && cItem.children) {
      //             cItem.selected = clickItem.selected ? 2 : false;
      //             this.setSelected(cItem);
      //           } else {
      //             cItem.selected = clickItem.selected;
      //             this.setSelected(cItem);
      //           }
      //         }
      //       });
      //     });
      //   });
      // } else clickItem.level === 2 ||
      if (clickItem.level === 3) { // 如果点击的元素为三级
        let twoLevel = clickItem;
        let threeLevel = clickItem.children || [];
        if (clickItem.level === 2) {
          twoLevel = clickItem;
          threeLevel = clickItem.children || [];
        } else {
          twoLevel = parent;
          threeLevel = [clickItem];
        }
        this.localArray.forEach(item => {
          item.children && item.children.forEach(cItem => {
            // if (this.getPrimaryId(cItem.id) === this.getPrimaryId(twoLevel.id)) {
            if (twoLevel.children && cItem.children) {
              // let isSelected = false;
              cItem.children.forEach(gItem => {
                threeLevel.forEach(gObj => {
                  if (this.getPrimaryId(gObj.id) === this.getPrimaryId(gItem.id)) {
                    gItem.selected = clickItem.selected;
                    // isSelected = true;
                    this.setSelected(gItem);
                  }
                });
              });
              // if (!isSelected) {
              //   cItem.selected = twoLevel.selected === true ? 2 : false;
              //   this.setSelected(cItem);
              // }
            }
            // else if (!twoLevel.children && cItem.children) {
            //   cItem.selected = twoLevel.selected === true ? 2 : false;
            //   this.setSelected(cItem);
            // } else {
            //   cItem.selected = twoLevel.selected === 2 || twoLevel.selected === true ? Boolean(1) : false;
            //   this.setSelected(cItem);
            // }
            // }
          });
        });
      }
      this.getSelect();
    },
    // 设置选择/取消选择以后其父/子级的选中状态
    setSelected (clickItem) {
      let leafArr = [];
      let parent = '';
      let son = '';
      // 获取父节点（包含父节点的对象）  和 子节点与自身（自身的对象） 的数组
      leafArr = getLeaf(this.localArray, clickItem.id);
      parent = leafArr[0];
      // 其实此处的 son（子节点与自身）和 selectFn(item)的item是一个对象
      son = leafArr[1];
      // 修改子节点的所有select 将子节点中的 selected 都变为item.selected状态
      if (clickItem.selected !== 2) {
        changeSelect(son.children, clickItem.selected);
      }
      // 获取父节点下的所有children中 选中、半选中状态 和 未选中 的节点数组
      let sonStatus = leafSelectStatus(parent.children);
      // 判断sonStatus中 选中、半选中状态 和 未选中 的节点的数量
      if (sonStatus[0].length > 0 && sonStatus[1].length > 0) {
        // 此时parent变为 半选状态
        parent.selected = 2;
        // 这时候需要继续向根节点 做进一步修改
        if (parent.id !== son.id) {
          changeGraFatherStatus(this.localArray, parent.id);
        }
      } else if (sonStatus[0].length === 0 && sonStatus[1].length > 0) {
        // 此时parent应该变成未选中
        parent.selected = false;
        // 这时候需要继续向根节点 做进一步修改
        if (parent.id !== son.id) {
          changeGraFatherStatus(this.localArray, parent.id);
        }
      } else if (sonStatus[0].length > 0 && sonStatus[1].length === 0) {
        // 此时parent应该变成选中
        parent.selected = true;
        // 这时候需要继续向根节点 做进一步修改
        if (parent.id !== son.id) {
          changeGraFatherStatus(this.localArray, parent.id);
        }
      }
    },
    // 全选/取消全选
    selectAll (val) {
      this.pushAll(this.localArray, val);
      this.getSelect();
    },
    pushAll (arr, select) {
      arr.forEach((item, index) => {
        item.selected = select;
        if (item.children && item.children.length > 0) {
          this.pushAll(item.children, select);
        }
      });
    },
    // 规则集预导出
    async getRulesetShowExport () {
      const response = await dataService.rulesetShowExport();
      if (response.data.code === 200) {
        // 重新赋值规则集
        this.localArray = this.resetRules(response.data.data.ruleSet);
        this.localArray = this.setLevel(this.localArray);
      }
    },
    // 规则集数据从新赋值
    resetRules (arr) {
      arr.forEach(item => {
        item.id = item.id + '_' + this.getRandom();
        item.selected = false;
        if (item.children && item.children.length > 0) {
          this.resetRules(item.children);
        } else {
          this.totalLocalSectionNum += 1; // 用于判断是否全部选择
        }
      });
      return arr;
    },
    // 赋值当前层级
    setLevel (arr) {
      arr.forEach(item => {
        item.level = 1;
        item.children && item.children.forEach(cItem => {
          cItem.level = 2;
          cItem.children && cItem.children.forEach(gItem => {
            gItem.level = 3;
          });
        });
      });
      return arr;
    },
    // 随机数
    getRandom () {
      return Math.random().toString(36).slice(2);
    },
    // 显示导出弹窗
    preExport () {
      if (this.localArraySectionTree.length <= 0) {
        this.message('请选择需导出的规则集！');
        return;
      }
      this.exportDialog = true;
    },
    // 获得进度条id
    async getRulesetGetExportId () {
      const response = await dataService.rulesetGetExportId();
      if (response.data.code === 200) {
        this.exportBody.exportId = response.data.data.exportId;
        this.overlay = true;
        this.exportDialog = false;
        this.rulesetExport();
        this.rulesetMonitorExportProgress();
      }
    },
    // 导出按钮进度条
    async rulesetMonitorExportProgress () {
      const response = await dataService.rulesetMonitorExportProgress({ exportId: this.exportBody.exportId });
      if (response.data.code === 200) {
        this.progress = response.data.data.progressBar * 1;
        if (this.progress < 100) { // 判断返回进度是否完成
          setTimeout(() => {
            this.rulesetMonitorExportProgress();
          }, 500);
        } else {
          this.overlay = false;
          this.message('导出成功', 'success');
        }
      }
    },
    // 规则集导出
    rulesetExport () {
      let appIds = [];
      let opIds = [];
      let ruleSetIds = [];
      // 遍历添加选中应用、交易。规则集
      this.localArraySectionTree.forEach(item => {
        appIds.push(this.getPrimaryId(item.id));
        if (item.children && item.children.length > 0) {
          item.children.forEach(cItem => {
            opIds.push(this.getPrimaryId(cItem.id));
            if (cItem.children && cItem.children.length > 0) {
              cItem.children.forEach(gItem => {
                ruleSetIds.push(this.getPrimaryId(gItem.id));
              });
            }
          });
        }
      });
      this.exportBody.appIds = appIds.join(); // 应用
      this.exportBody.opIds = opIds.join(); // 交易
      this.exportBody.ruleSetIds = ruleSetIds.join(); // 规则集
      this.exportBody.tree = JSON.stringify(this.localArraySectionTree); // 树形结构
      dataService.rulesetExport(this.exportBody).then(response => {
        let blob = new Blob([response.data], { type: 'application/vnd.ms-excel;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        // 获取后台返回文件名称
        const filename = response.headers['content-disposition'].match(
          /filename=(.*)/
        )[1];
        // 设置下载文件的文件名称
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }).catch(err => {
        this.message(err.msg);
      });
    },
    // 提示语状态
    message (str, theme) {
      this.snackbarServe = true;
      this.snackbarServeMsg = str;
      this.snackbarServeColor = theme || 'error';
    },
    // 搜索框
    searchFn () {
      this.search = this.searchVal;
    },
    // 清除搜索框
    clearSearch () {
      this.search = '';
      this.searchVal = '';
    },
    // 查询数组是否包含对象
    arrObjSome (option, arr) {
      return arr.some(item => {
        if (item.id === option.id) {
          return true;
        }
      });
    },
    // 查询数组对象下标
    getArrObjIndex (option, arr) {
      return arr.findIndex((item) => {
        return item.id === option.id;
      });
    },
    // 获取原id
    getPrimaryId (id) {
      return id && id.indexOf('_') > -1 ? id.split('_')[0] : '';
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
  .yCenter{
    display: flex;
    align-items: center;
    justify-content: center;
  }
  >>> .v-treeview-node--leaf>.v-treeview-node__root {
    padding-left: 8px;
  }
</style>
