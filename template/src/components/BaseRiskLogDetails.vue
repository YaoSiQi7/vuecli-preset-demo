<template>
  <v-row justify="center">
    <v-dialog v-model="detailsDialog" scrollable persistent max-width="1200px">
      <v-card>
        <v-card-title>
          <span class="seeDetails_size">查看详情</span>
          <div class="flex-grow-1" />
          <v-btn icon dark @click="cancleDetailsDialog">
            <v-icon color="var(--v-headerCloseIconColor-base)">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="6"  v-if="Object.keys(hitRule).length > 0">
              <div style="border: 1px solid #F3F3F3;">
                <v-card-title class="header_bg_color">
                  上线风险策略
                </v-card-title>
                <v-row class="mt-2" style="padding: 0;margin:0;">
                  <v-col
                    cols="3"
                    style="padding: 0;margin:0;text-align: center;"
                  >
                    <!-- 人工审核 -->
                    <span v-if="hitRule.officialResult.strategy === '人工审核'" class="emptyCircle manuallyReview">
                      <em style="position: relative;top: -7px;font-style: normal;">{{ hitRule.officialResult.strategy }}</em>
                    </span>
                    <!-- 自动放行 -->
                    <span v-else-if="hitRule.officialResult.strategy === '自动放行'" class="emptyCircle automaticPermitThrough">
                      <em style="position: relative;top: -7px;font-style: normal;">{{ hitRule.officialResult.strategy }}</em>
                    </span>
                    <!-- 加强认证 -->
                    <span v-else-if="hitRule.officialResult.strategy === '加强认证'" class="emptyCircle identification">
                      <em style="position: relative;top: -7px;font-style: normal;">{{ hitRule.officialResult.strategy }}</em>
                    </span>
                    <!-- 自动阻断 -->
                    <span v-else-if="hitRule.officialResult.strategy === '自动阻断'" class="emptyCircle autoBlacking">
                      <em style="position: relative;top: -7px;font-style: normal;">{{ hitRule.officialResult.strategy }}</em>
                    </span>
                    <!-- 试运行：默认颜色 -->
                    <span v-else class="emptyCircle tacitlyApprove">
                      <em style="position: relative;top: -7px;font-style: normal;">{{ hitRule.officialResult.strategy }}</em>
                    </span>
                  </v-col>
                  <v-col
                    cols="9"
                  >
                    <div>
                      <span class="base_field_text_cu">匹配模式：</span>
                      <span>{{ hitRule.officialResult.matchType }}</span>
                    </div>
                    <div>
                      <span class="base_field_text_cu">建议策略：</span>
                      <span>{{ hitRule.officialResult.strategy }}</span>
                    </div>
                    <div>
                      <span class="base_field_text_cu">风险标签：</span>
                      <span class="base_field_color">{{ hitRule.officialResult.hit_labels }}</span>
                    </div>
                  </v-col>
                </v-row>
                <div class="dashed_color"></div>
                <v-row class="addDetilBaseMTop">
                  <v-col>
                    <v-row>
                      <v-col cols="8">
                        <span class="base_field_text_cu">命中规则：</span>
                      </v-col>
                      <v-col cols="4">
                        <span v-if="hitRule.officialResult.matchType === '评分模式'" class="base_field_text_cu">规则权重：</span>
                        <span v-else class="base_field_text_cu">处置策略：</span>
                      </v-col>
                    </v-row>
                    <div v-if="Object.keys(hitRule.officialResult).length > 0 && hitRule.officialResult.hit_rules.length > 0">
                      <v-row v-for="(item, index) in hitRule.officialResult.hit_rules" :key="index">
                        <v-col cols="8">
                          <div class="base_field_color">{{ item.rule_name }}</div>
                        </v-col>
                        <v-col cols="4">
                          <div v-if="hitRule.officialResult.matchType === '评分模式'">{{ item.rule_score | matchTypeValue() }}</div>
                          <div v-else>{{ item.rule_strategy }}</div>
                        </v-col>
                      </v-row>
                    </div>
                    <div v-else></div>
                  </v-col>
                </v-row>
              </div>
              <div style="border: 1px solid #F3F3F3;margin-top: 10px;">
                <v-card-title class="header_bg_color">
                  试运行风险策略
                </v-card-title>
                <v-row class="mt-2" style="padding: 0;margin:0;height: 90px;">
                  <v-col
                    cols="3"
                    style="padding: 0;margin:0;text-align: center;"
                  >
                    <!-- 人工审核 -->
                    <span v-if="hitRule.simulatedResult.strategy === '人工审核'" class="emptyCircle manuallyReview">
                      <em style="position: relative;top: -7px;font-style: normal;">{{ hitRule.simulatedResult.strategy }}</em>
                    </span>
                    <!-- 自动放行 -->
                    <span v-else-if="hitRule.simulatedResult.strategy === '自动放行'" class="emptyCircle automaticPermitThrough">
                      <em style="position: relative;top: -7px;font-style: normal;">{{ hitRule.simulatedResult.strategy }}</em>
                    </span>
                    <!-- 加强认证 -->
                    <span v-else-if="hitRule.simulatedResult.strategy === '加强认证'" class="emptyCircle identification">
                      <em style="position: relative;top: -7px;font-style: normal;">{{ hitRule.simulatedResult.strategy }}</em>
                    </span>
                    <!-- 自动阻断 -->
                    <span v-else-if="hitRule.simulatedResult.strategy === '自动阻断'" class="emptyCircle autoBlacking">
                      <em style="position: relative;top: -7px;font-style: normal;">{{ hitRule.simulatedResult.strategy }}</em>
                    </span>
                    <!-- 试运行：默认颜色 -->
                    <span v-else class="emptyCircle tacitlyApprove">
                      <em style="position: relative;top: -7px;font-style: normal;">{{ hitRule.simulatedResult.strategy }}</em>
                    </span>
                  </v-col>
                  <v-col
                    cols="9"
                  >
                    <div>
                      <span class="base_field_text_cu">匹配模式：</span>
                      <span>{{ hitRule.simulatedResult.matchType }}</span>
                    </div>
                    <div>
                      <span class="base_field_text_cu">建议策略：</span>
                      <span>{{ hitRule.simulatedResult.strategy }}</span>
                    </div>
                    <div>
                      <span class="base_field_text_cu">风险标签：</span>
                      <span class="base_field_color">{{ hitRule.simulatedResult.hit_labels }}</span>
                    </div>
                  </v-col>
                </v-row>
                <div class="dashed_color"></div>
                <v-row class="addDetilBaseMTop">
                  <v-col>
                    <v-row>
                      <v-col cols="8">
                        <span class="base_field_text_cu">命中规则：</span>
                      </v-col>
                      <v-col cols="4">
                        <span v-if="hitRule.simulatedResult.matchType === '评分模式'" class="base_field_text_cu">规则权重：</span>
                        <span v-else class="base_field_text_cu">处置策略：</span>
                      </v-col>
                    </v-row>
                    <div v-if="Object.keys(hitRule.simulatedResult).length > 0 && hitRule.simulatedResult.hit_rules.length > 0">
                      <v-row v-for="(item, index) in hitRule.simulatedResult.hit_rules" :key="index">
                        <v-col cols="8">
                          <div class="base_field_color">{{ item.rule_name }}</div>
                        </v-col>
                        <v-col cols="4">
                          <div v-if="hitRule.simulatedResult.matchType === '评分模式'">{{ item.rule_score | matchTypeValue() }}</div>
                          <div v-else>{{ item.rule_strategy }}</div>
                        </v-col>
                      </v-row>
                    </div>
                    <div v-else></div>
                  </v-col>
                </v-row>
              </div>
            </v-col>
            <v-col cols="6">
              <!-- 二期详情右边的自动配置 -->
              <div v-for="(item, index) in oplogDetail" :key="index" style="border: 1px solid #F3F3F3;margin-bottom: 10px;">
                <v-card-title class="header_bg_color">
                  {{ item.groupName }}
                </v-card-title>
                <v-row v-for="(i, x) in item.groupData" :key="x" class="addDetilBaseMTop">
                  <v-col>
                    <span class="base_field_text_cu">{{ i.name}}：</span>
                    <span>{{ i.value }}</span>
                  </v-col>
                </v-row>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
export default {
  name: 'BaseRiskLogDetails',
  props: {
    detailsDialog: {
      type: Boolean,
      default: false
    },
    hitRule: {
      type: Object,
      default: () => {}
    },
    oplogDetail: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {};
  },
  created () {
  },
  methods: {
    // 此处是点击弹框的叉号的点击事件，detailsDialog传的是弹窗的v-model
    cancleDetailsDialog () {
      this.$emit('cancleDetailsDialog');
    }
  },
  filters: {
    // 评分模式下：规则权重的值删除小数点后的数字。
    matchTypeValue: function (data) {
      let dataValue;
      let dataIndex = String(data).indexOf('.');
      if (data && String(data).indexOf('.') !== -1) {
        dataValue = String(data).substring(0, dataIndex);
      } else {
        dataValue = data;
      }
      return dataValue;
    }
  },
  computed: {},
  components: {}
};
</script>
<style lang="stylus" scoped>
.isEditDropdown >>> .v-select__slot .v-input__append-inner {
  display: none !important
}
.base_field_text_cu {
  font-weight: bold;
}
.addDetilBaseMTop {
  padding: 0 10px;
}
.emptyCircle {
  width: 80px;
  height:80px;
  border-radius:50%;
  display: inline-block;
  text-align: center;
  line-height: 80px;
}
.manuallyReview {
  border: 8px solid var(--v-manuallyReviewColor-base);
}
.automaticPermitThrough {
  border: 8px solid var(--v-automaticPermitThroughColor-base);
}
.identification {
  border: 8px solid var(--v-identificationColor-base);
}
.autoBlacking {
  border: 8px solid var(--v-emptyCircleColor-base);
}
.tacitlyApprove {
  border: 8px solid var(--v-tacitlyApproveColor-base);
}
.base_field_color {
  color: var(--v-seeDetialFieldColor-base);
}
.dashed_color {
  height: 1px;
  border-top: 1px dashed var(--v-dashedColor-base);
}
.header_bg_color {
  height: 40px;
  padding: 0;
  padding-left: 10px;
  font-size: 14px;
  background: var(--v-seeDetailsHeadBgColor-base) !important;
  color: #000;
  font-size: 16px;
}
.seeDetails_size {
  font-size: 18px;
}
</style>
