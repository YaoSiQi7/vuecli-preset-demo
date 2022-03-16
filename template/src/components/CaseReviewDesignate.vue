<!-- author: 古雪瑞-->
<!-- updateTime: 2020-04-14-->
<!--案件管理中心 指派or转派 公共弹窗-->
<template>
   <v-row dense>
    <v-dialog
      v-model="showDialog"
      persistent
      scrollable
      max-width="1251px"
    >
      <v-card>
        <v-card-title>
          <v-toolbar-title>{{ titleInfo.dialogTitle }}</v-toolbar-title>
          <div class="flex-grow-1" />
          <v-btn
            icon
            dark
            @click="cancelDialog"
          >
            <v-icon color="var(--v-headerCloseIconColor-base)">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pl-4 pr-4 mt-5 mb-5">
          <div class="dialog-subtitle">{{ titleInfo.tableTitle }}</div>
        </v-card-text>
        <v-card-text>
          <v-data-table :headers="dataHeaders" :items="dataItems" hide-default-footer class="elevation-1">
            <template
              v-slot:item.riskTime="{ item }"
            >
              <span :title="item.riskTime">{{ item.riskTime }}</span>
            </template>
            <template
              v-slot:item.bankCard="{ item }"
            >
              <span :title="item.bankCard">{{ item.bankCard | ellipsis() }}</span>
            </template>
            <template
              v-slot:item.account="{ item }"
            >
              <span :title="item.account">{{ item.account | ellipsis() }}</span>
            </template>
            <template v-slot:no-data>
              <div>没有数据</div>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-text class="pl-4 pr-4 mt-5 mb-5">
          <div class="dialog-subtitle">{{ titleInfo.actionTitle }}</div>
        </v-card-text>
        <div class="pl-10 pr-4 mb-2" v-if="!titleInfo.isTransfer">
          <v-form ref="form">
            <div class="mb-4">
              <span class="review-flow-text-left">
                选择审核流：
              </span>
              <span class="review-flow-select-right">
                <v-select
                  required="true"
                  v-model="selectForm.selectReviewFlow"
                  :items="reviewFlowItems"
                  solo
                  flat
                  dense
                  outlined
                  placeholder="选择审核流"
                />
              </span>
            </div>
            <div class="mb-4">
              <span class="review-flow-text-left">
                选择一级审核员：
              </span>
              <span class="review-flow-select-right">
                <v-select
                  required="true"
                  v-model="selectForm.designatePerson"
                  :items="designatePersonItsms"
                  solo
                  flat
                  dense
                  outlined
                  placeholder="选择一级审核员"
                />
              </span>
            </div>
          </v-form>
        </div>
        <div class="pl-10 pr-4 mb-2" v-else>
          <v-form ref="form">
            <div class="mb-4">
              <span class="review-flow-text-left">
                选择转派人员：
              </span>
              <span class="review-flow-select-right">
                <v-select
                  required="true"
                  v-model="selectForm.transferPerson"
                  :items="designatePersonItsms"
                  solo
                  flat
                  dense
                  outlined
                  placeholder="选择转派人员"
                />
              </span>
            </div>
          </v-form>
        </div>
        <v-divider />
        <v-card-actions class="pt-4 pb-4">
          <div class="flex-grow-1"></div>
          <v-btn class="pl-0 mr-4" @click="cancelDialog">返回</v-btn>
          <v-btn color="primary" class="mr-2" @click="submit">提交</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
export default {
  name: 'caseReviewDesignate',
  props: {
    titleInfo: {
      type: Object,
      default: () => {}
    },
    showDialog: {
      type: Boolean,
      default: false
    },
    dataHeaders: {
      type: Array,
      default: () => []
    },
    dataItems: {
      type: Array,
      default: () => []
    },
    reviewFlowItems: {
      type: Array,
      default: () => {}
    },
    designatePersonItsms: {
      type: Array,
      default: () => {}
    }
  },
  data: () => ({
    selectForm: {
      selectReviewFlow: '',
      designatePerson: '',
      transferPerson: ''
    }
  }),
  methods: {
    cancelDialog () {
      this.$emit('cancelDialog', this.$refs.form);
    },
    submit () {
      this.$emit('submitReview', this.selectForm, this.$refs.form);
    }
  }
};
</script>
<style lang="stylus" scoped>
  .dialog-subtitle {
    text-align: center;
    color: #000;
    font-size: 16px;
    height: 30px;
    line-height: 30px;
    background-color: #D4E4EA;
  }
  .review-flow-text-left {
    display: inline-block;
    width: 10%;
    min-width: 112px;
    height: 40px;
    line-height: 40px;
    vertical-align: top;
  }
  .review-flow-select-right {
    display: inline-block;
    width: 20%;
    min-width: 140px;
    height: 40px;
    line-height: 40px;
  }
</style>
