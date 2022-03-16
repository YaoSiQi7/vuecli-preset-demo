<template>
  <div>
    <v-card class="pa-2 elevation-0" tile>
      <v-container class="pa-4 pt-1 lighten-2">
        <v-row>
          <v-col md="12" class="py-0">
        <v-text-field
          v-model="search"
          placeholder="请输入条件搜索"
          append-icon="mdi-magnify"
          hide-details
          outlined
          dense
          class="ma-0 pa-0"
        />
          </v-col>
        </v-row>
      </v-container>
      <v-treeview
        v-if="isShowIcon"
        dense
        activatable
        :rounded="rounded"
        :active.sync="active"
        :open.sync="open"
        :items="items"
        :item-text='itemText'
        :item-key='itemKey'
        :search="search"
        :open-on-click='openOnClick'
        color="primary"
        :hoverable="true"
        style="font-size: 14px;"
        @update:active="updateActive($event, items)"
      >
        <template v-slot:append="{ item, open, index }">
          <div v-if="currendClickId.includes(item.id)">
            <!-- 添加 -->
            <v-icon
              v-show="!isEnd && hasPermission(addPowerBtn)"
              style="font-size: 16px;"
              :key="index"
              @click="adds(item, open, index)"
            >add</v-icon>
            <v-icon
              v-show="item.isEnd && hasPermission(addPowerBtn)"
              style="font-size: 16px;"
              :key="index"
              @click="adds(item, open, index)"
            >add</v-icon>
            <!-- 编辑 -->
            <v-icon
              v-show="!isTop"
              style="font-size: 16px;"
              :key="index"
              @click="edits(item, open, index)"
            >edit</v-icon>
            <!-- 其他类的编辑 -->
            <!-- <v-icon
              v-show="!isTop && !item.isfirstClass && !item.isTwoClass && hasPermission(editPowerBtn)"
              style="font-size: 16px;"
              :key="index"
              @click="edits(item, open, index)"
            >edit</v-icon> -->
            <!-- 计算方法库：第一级目录的编辑 -->
            <!-- <v-icon
              v-show="!isTop && item.isfirstClass && hasPermission(editPowerBtn)"
              style="font-size: 16px;"
              :key="index"
              @click="edits(item, open, index)"
            >edit</v-icon> -->
            <!-- 计算方法库：第二级方法的编辑 -->
            <!-- <v-icon
              v-show="!isTop && item.isTwoClass && hasPermission(editTwoClassBtn)"
              style="font-size: 16px;"
              :key="index"
              @click="edits(item, open, index)"
            >edit</v-icon> -->
            <!-- 删除 -->
            <v-icon
              v-show="!isTop && !(item.isInternal && item.isInternal==='1') && !(item.isQuote && item.isQuote==='1') && !item.isfirstClass && !item.isTwoClass && hasPermission(deletePowerBtn)"
              style="font-size: 16px;"
              :key="index"
              @click="removes(item, open, index)"
            >mdi-delete</v-icon>
            <!-- 计算方法库：第一级目录的删除 -->
            <v-icon
              v-show="!isTop && !(item.isInternal && item.isInternal==='1') && !(item.isQuote && item.isQuote==='1') && item.isfirstClass && hasPermission(deletePowerBtn)"
              style="font-size: 16px;"
              :key="index"
              @click="removes(item, open, index)"
            >mdi-delete</v-icon>
            <!-- 计算方法库：第二级方法的删除 -->
            <v-icon
              v-show="!isTop && !(item.isInternal && item.isInternal==='1') && !(item.isQuote && item.isQuote==='1') && item.isTwoClass && hasPermission(deletePowerBtn)"
              style="font-size: 16px;"
              :key="index"
              @click="removes(item, open, index)"
            >mdi-delete</v-icon>
          </div>
        </template>
      </v-treeview>
      <v-treeview
        v-if="!isShowIcon"
        dense
        activatable
        :rounded="rounded"
        :active.sync="active"
        :open.sync="open"
        :items="items"
        :search="search"
        color="primary"
        style="font-size: 14px;"
        @update:active="updateActive($event, items)"
      >
      </v-treeview>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => {
        return [];
      }
    },
    treeActive: {
      type: String,
      default: () => ''
    },
    itemText: {
      type: String,
      default: () => {
        return 'name';
      }
    },
    itemKey: {
      type: String,
      default: () => {
        return 'id';
      }
    },
    isTop: { // 是否第一级
      type: Boolean,
      default: false
    },
    isEnd: { // 是否最后一级
      type: Boolean,
      default: false
    },
    isShowIcon: { // 是否可操作
      type: Boolean,
      default: true
    },
    isFirstLineSelected: {
      type: Boolean,
      default: false
    },
    isFirstLineOpened: {
      type: Boolean,
      default: false
    },
    openOnClick: {
      type: Boolean,
      default: false
    },
    openIds: {// 树结构的所有节点id
      type: Array,
      default: () => []
    },
    addPowerBtn: {
      type: String,
      default: () => ''
    },
    editTwoClassBtn: {
      type: String,
      default: () => ''
    },
    editPowerBtn: {
      type: String,
      default: () => ''
    },
    deleteTwoClassBtn: {
      type: String,
      default: () => ''
    },
    deletePowerBtn: {
      type: String,
      default: () => ''
    }
  },
  data () {
    return {
      currendClickId: [],
      rounded: true,
      active: [],
      open: [],
      search: null
    };
  },
  methods: {
    resetSel () {
      this.currendClickId = [];
    },
    removes (item, open, index) {
      this.$emit('removes', item, open, index);
    },
    edits (item, open, index) {
      this.$emit('edits', item, open, index);
    },
    adds (item, open, index) {
      this.$emit('adds', item, open, index);
    },
    // 默认展开第一项内容
    setOpen (value) {
      this.$nextTick(() => {
        this.open = value;
      });
    },
    // 当前树&表联动
    updateActive (ev, items) {
      if (ev.length > 0) {
        this.currendClickId = ev;
        this.$emit('getList', ev);
      } else {
        this.active.push(this.currendClickId[0]);
      }
    }
  },
  watch: {
    items (val) {
      if (val.length) {
        if (this.treeActive) {
          this.active.push(this.treeActive);
        } else {
          this.active.push(val[0].id);
        }
      }
    },
    isFirstLineOpened (val) {

    },
    openIds (val) {
      if (val.length) {
        this.open = val;
      }
    }
  },
  created () {}
};
</script>
<style>
.v-treeview-node__root.v-treeview-node--active .v-treeview-node__content .v-icon {
  padding: 0 0 0 5px;
}
.theme--light.v-treeview .v-treeview-node__root.v-treeview-node--active:hover::before,
.theme--light.v-treeview .v-treeview-node__root.v-treeview-node--active::before {
  opacity: 0;
}
.v-treeview>.v-treeview-node--leaf {
    margin-left: 0;
}
.v-treeview-node.v-treeview-node--rounded .v-treeview-node__root {
  margin-top: 1px;
  margin-bottom: 1px;
}
.v-treeview-node--leaf > .v-treeview-node__root {
  padding-left: 1px;
}
.v-treeview-node {
  margin-left: 0;
}
</style>
<style lang="stylus" scoped>
>>> .v-sheet--tile {
    border-radius: 4px 4px 0 0;
}
</style>
