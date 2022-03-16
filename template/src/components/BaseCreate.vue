<template>
  <v-row justify="center">

    <v-dialog
      v-model="crudFormDialog"
      persistent
      scrollable
      max-width="500px"
    >
      <v-card class="baseCardStyle" :style="styleObject">
        <v-card-title>
          <!-- 新建模式 -->
          <v-toolbar-title v-if="formHeader.isEdit === false">
            {{ formHeader.name }}
            <!-- 新建 -->
          </v-toolbar-title>
          <!-- 查看模式 -->
          <v-toolbar-title v-else-if="formHeader.isEdit === true && isEditMode === false">
            {{ formHeader.name }}
            <!-- 详情 -->
          </v-toolbar-title>
          <!-- 编辑模式 -->
          <v-toolbar-title v-else>
            {{ formHeader.name }}
            <!-- 编辑 -->
          </v-toolbar-title>
        <div class="flex-grow-1" />
          <v-btn
            icon
            dark
            @click="cancelCrudFormDialog"
          >
            <v-icon color="var(--v-headerCloseIconColor-base)">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
          <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <slot>
              <!-- 编辑模式 -->
              <div v-if="formHeader.isEdit">
                <v-row>
                  <v-col cols="3"></v-col>
                  <v-col cols="7" justify-left v-show="isCanEdit && hasPermission(baseCteateEditPowerBtn)" class="py-0">
                   <v-switch v-model="isEditMode" inset dense label="启用编辑" @change="switchChange">
                   </v-switch>
                  </v-col>
                </v-row>
                <v-form
                  class="ruleSetAddOrEdit"
                  ref="form" v-model="valid"
                  :lazy-validation="lazy"
                  :key="newDate">
                  <v-row
                    v-for="(item, index) in formData"
                    :key="index">
                    <v-col cols="3" class="pr-0">
                      <div class="mt-2">{{item.label}}:</div>
                    </v-col>
                    <v-col
                      v-if="item.type === 'noEditText'"
                      cols="7"
                    >
                      <v-text-field
                        v-if="isEditMode"
                        :required="item.required"
                        :rules="item.rules"
                        v-model.trim="item.value"
                        solo
                        flat
                        dense
                        disabled
                        :type="item.inputType"
                      />
                      <v-text-field
                        v-else
                        :required="item.required"
                        :rules="item.rules"
                        v-model.trim="item.value"
                        solo
                        flat
                        dense
                        disabled
                        :type="item.inputType"
                      />
                    </v-col>
                    <v-col
                      v-if="item.type === 'text'"
                      cols="7"
                    >
                      <v-text-field
                        v-if="isEditMode"
                        :required="item.required"
                        :counter="item.counter"
                        :rules="item.rules"
                        v-model.trim="item.value"
                        outlined
                        dense
                        :type="item.inputType"
                        :disabled="!isEditMode"
                      />
                      <v-text-field
                        v-else
                        :required="item.required"
                        :rules="item.rules"
                        v-model.trim="item.value"
                        solo
                        flat
                        dense
                        :type="item.inputType"
                        :disabled="!isEditMode"
                      />
                    </v-col>
                    <v-col
                      v-if="item.type === 'textarea'"
                      cols="7"
                    >
                      <v-textarea
                        v-if="isEditMode"
                        v-model.trim="item.value"
                        outlined
                        :required="item.required"
                        :rules="item.rules"
                        :counter="item.counter"
                        :disabled="!isEditMode"
                        :rows="item.rows"
                        :row-height="item.rowHeight"
                        auto-grow
                      />
                      <v-textarea
                        v-else
                        v-model.trim="item.value"
                        :required="item.required"
                        :counter="item.counter"
                        :rules="item.rules"
                        :disabled="!isEditMode"
                        :rows="item.rows"
                        :row-height="item.rowHeight"
                        auto-grow
                        solo
                        flat
                      />

                    </v-col>
                    <v-col
                      v-if="item.type === 'autocomplete'"
                      cols="7"
                    >
                      <v-autocomplete
                        v-if="isEditMode"
                        v-model.trim="item.value"
                        outlined
                        dense
                        :multiple="item.multiple"
                        :chips="item.chips"
                        no-data-text="没有匹配数据"
                        :required="item.required"
                        :rules="item.rules"
                        :item-text="item.selectText"
                        :item-value="item.selectField"
                        :items="item.autocompleteOptions"
                        :disabled="!isEditMode"
                        @change="handleChangeSelect(item, index)"
                      />
                      <v-autocomplete
                        v-else
                        v-model.trim="item.value"
                        solo
                        flat
                        dense
                        :multiple="item.multiple"
                        no-data-text="没有匹配数据"
                        :required="item.required"
                        :rules="item.rules"
                        :label="item.label"
                        :item-text="item.selectText"
                        :item-value="item.selectField"
                        :items="item.autocompleteOptions"
                        :disabled="!isEditMode"
                        class="isEditDropdown"
                      />
                    </v-col>
                    <v-col
                      v-if="item.type === 'select'"
                      cols="7"
                      style="position: relative;"
                    >
                      <v-select
                        v-if="isEditMode"
                        v-model="item.value"
                        :item-text="item.selectText"
                        :item-value="item.selectField"
                        :items="item.options"
                        :required="item.required"
                        :rules="item.rules"
                        :multiple="item.multiple"
                        :attach="item.attach"
                        no-data-text="没有匹配数据"
                        outlined
                        dense
                        :disabled="!isEditMode || item.disabled"
                        @change="handleChangeSelect(item, index)"
                      />
                      <v-select
                        v-else
                        v-model="item.value"
                        :item-text="item.selectText"
                        :item-value="item.selectField"
                        :items="item.options"
                        :label="item.label"
                        :required="item.required"
                        :rules="item.rules"
                        :multiple="item.multiple"
                        no-data-text="没有匹配数据"
                        solo
                        flat
                        dense
                        :disabled="!isEditMode"
                        class="isEditDropdown"
                      />
                      <span v-if="item.comment" class="questionMark">
                        <v-tooltip right >
                          <template v-slot:activator="{ on }">
                            <v-icon
                              class="mr-1"
                              color="primary"
                              v-on="on"
                              size="20"
                            >mdi-help-circle</v-icon>
                          </template>
                          <span>{{item.comment || '无说明'}}</span>
                        </v-tooltip>
                        <!-- <v-icon class="mr-1" color="primary" size="20">mdi-help-circle</v-icon> -->
                      </span>
                    </v-col>
                    <v-col
                      v-if="item.type === 'combobox'"
                      cols="7"
                    >
                      <v-combobox
                        v-if="isEditMode"
                        v-model="item.value"
                        :item-text="item.selectText"
                        :item-value="item.selectField"
                        :items="item.options"
                        no-data-text="没有匹配数据"
                        required
                        outlined
                        dense
                        :multiple="item.multiple"
                        :disabled="!isEditMode"
                        class="isEditDropdown"
                      />
                      <v-combobox
                        v-else
                        v-model="item.value"
                        :item-text="item.selectText"
                        :item-value="item.selectField"
                        :items="item.options"
                        no-data-text="没有匹配数据"
                        required
                        solo
                        flat
                        dense
                        :multiple="item.multiple"
                        :disabled="!isEditMode"
                        class="isEditDropdown"
                      />
                    </v-col>
                    <!-- 过期时间（不含时分秒） -->
                    <v-col
                      v-if="item.type === 'dateSelection'"
                      cols="7"
                    >
                      <v-menu
                        v-if="isEditMode"
                        v-model="menu"
                        :close-on-content-click="false"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            append-icon="event"
                            v-model="item.value"
                            :label="item.label"
                            v-on="on"
                            outlined
                            dense
                            :disabled="!isEditMode"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          :min="item.minTime"
                          :max="item.maxTime"
                          v-model="item.value"
                          @input="menu = false"
                        ></v-date-picker>
                      </v-menu>
                      <v-text-field
                        v-else
                        :required="item.required"
                        :rules="item.rules"
                        v-model.trim="item.value"
                        solo
                        flat
                        dense
                        :disabled="!isEditMode"
                      />
                    </v-col>
                    <!-- 失效时间(含时分秒) -->
                    <v-col
                      v-if="item.type === 'dateTypeEnd'"
                      cols="7"
                    >
                      <datetime-picker
                        v-if="isEditMode"
                        required
                        solo
                        flat
                        dense
                        v-model="item.value"
                        time-format="HH:mm:ss"
                        :type='3'
                        :validTime='validTime'
                        @clear="item.value=''"
                        :text-field-props="item.textFieldProps"
                        :date-picker-props="item.dateProps"
                        :time-picker-props="item.timeProps"
                        placeholder="不填写时，默认永久有效"
                        :disabled="!isEditMode"
                        class="isEditDropdown"
                      />
                      <datetime-picker
                        v-else
                        required
                        solo
                        flat
                        dense
                        v-model="item.value"
                        time-format="HH:mm:ss"
                        :type='3'
                        @clear="item.value=''"
                        :text-field-props="item.textFieldProps"
                        :date-picker-props="item.dateProps"
                        :time-picker-props="item.timeProps"
                        placeholder="不填写时，默认永久有效"
                        :disabled="!isEditMode"
                        class="isEditDropdown"
                        :validTime='validTime'
                      />
                    </v-col>

                    <v-col v-if="item.type === 'treeSelect'" cols="7" class="mb-6">
                      <treeselect
                        :load-options="loadOptions"
                        :multiple="item.isMultiple"
                        :options="item.options"
                        :default-expand-level="1"
                        :placeholder="item.label"
                        :disabled="!isEditMode"
                        v-model="item.value"
                        :value-consists-of="valueConsistsOf"
                        noChildrenText="没有数据"
                        noResultsText="没有匹配数据"
                        @input="changInput"
                        :flat="item.flat || false"
                      >
                        <div slot="value-label" slot-scope="{ node }">
                          {{node.raw.label}}
                        </div>
                      </treeselect>

                    </v-col>
                    <v-file-input
                      v-if="item.type === 'file' && isEditMode"
                      :multiple="item.multiple"
                      :accept="item.accept"
                      :required="item.required"
                      :rules="item.rules"
                      outlined
                      dense
                      :disabled="!isEditMode"
                    />
                    <v-file-input
                      v-if="item.type === 'file' && !isEditMode"
                      :multiple="item.multiple"
                      :accept="item.accept"
                      :required="item.required"
                      :rules="item.rules"
                      solo
                      flat
                      dense
                      :disabled="!isEditMode"
                    />

                  </v-row>
                </v-form>
              </div>
              <!-- 新增模式 -->
              <div v-else>
                <v-form class="ruleSetAddOrEdit" ref="form" v-model="valid" :lazy-validation="lazy">
                  <v-row
                    v-for="(item, index) in formData"
                    :key="index"
                  >
                    <v-col cols="2">
                    </v-col>
                    <v-col
                      v-if="item.type === 'noAddText'"
                      cols="8"
                    >
                      <v-text-field
                        :label="item.label"
                        :required="item.required"
                        :counter="item.counter"
                        :rules="item.rules"
                        v-model.trim="item.value"
                        outlined
                        dense
                        disabled
                        :type="item.inputType"
                      />
                    </v-col>
                    <v-col
                      v-if="item.type === 'text'"
                      cols="8"
                    >
                      <v-text-field
                        :label="item.label"
                        :required="item.required"
                        :counter="item.counter"
                        :rules="item.rules"
                        v-model.trim="item.value"
                        outlined
                        dense
                        :type="item.inputType"
                      />
                    </v-col>
                    <v-col
                      v-if="item.type === 'textarea'"
                      cols="8"
                    >
                      <v-textarea
                        v-model.trim="item.value"
                        outlined
                        :counter="item.counter"
                        :required="item.required"
                        :rules="item.rules"
                        :label="item.label"
                        :rows="item.rows"
                        :row-height="item.rowHeight"
                        auto-grow
                      />
                    </v-col>
                    <v-col
                      v-if="item.type === 'autocomplete'"
                      cols="8"
                    >
                      <v-autocomplete
                        v-model.trim="item.value"
                        outlined
                        dense
                        :multiple="item.multiple"
                        :chips="item.chips"
                        :required="item.required"
                        :rules="item.rules"
                        :label="item.label"
                        :item-text="item.selectText"
                        :item-value="item.selectField"
                        :items="item.autocompleteOptions"
                        no-data-text="没有匹配数据"
                        @change="handleChangeSelect(item, index)"
                      />
                    </v-col>
                    <v-col
                      v-if="item.type === 'select'"
                      cols="8"
                      style="position: relative;"
                    >
                      <v-select
                        v-model="item.value"
                        :item-text="item.selectText"
                        :item-value="item.selectField"
                        :items="item.options"
                        :label="item.label"
                        :required="item.required"
                        :rules="item.rules"
                        :multiple="item.multiple"
                        :attach="item.attach"
                        outlined
                        dense
                        no-data-text="没有匹配数据"
                        @change="handleChangeSelect(item, index)"
                      />
                      <span v-if="item.comment" class="questionMark">
                        <v-tooltip right >
                          <template v-slot:activator="{ on }">
                            <v-icon
                              class="mr-1"
                              color="primary"
                              v-on="on"
                              size="20"
                            >mdi-help-circle</v-icon>
                          </template>
                          <span>{{item.comment || '无说明'}}</span>
                        </v-tooltip>
                        <!-- <v-icon class="mr-1" color="primary" size="20">mdi-help-circle</v-icon> -->
                      </span>
                    </v-col>
                    <v-col
                      v-if="item.type === 'combobox'"
                      cols="8"
                    >
                      <v-combobox
                        v-model="item.value"
                        :item-text="item.selectText"
                        :item-value="item.selectField"
                        :items="item.options"
                        :label="item.label"
                        required
                        outlined
                        dense
                        :multiple="item.multiple"
                        no-data-text="没有匹配数据"
                      />
                    </v-col>
                    <v-col
                      v-if="item.type === 'dateSelection'"
                      cols="8"
                    >
                      <v-menu
                        v-model="menu"
                        :close-on-content-click="false"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            append-icon="event"
                            v-model="item.value"
                            :label="item.label"
                            v-on="on"
                            outlined
                            dense
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          :min="item.minTime"
                          :max="item.maxTime"
                          v-model="item.value"
                          @input="menu = false"
                          style="width:100%"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col
                      v-if="item.type === 'dateTypeEnd'"
                      cols="8"
                    >
                      <datetime-picker
                        v-model="item.value"
                        time-format="HH:mm:ss"
                        :type='3'
                        :validTime='validTime'
                        @clear="item.value=''"
                        :text-field-props="item.textFieldProps"
                        :date-picker-props="item.dateProps"
                        :time-picker-props="item.timeProps"
                        placeholder="不填写时，默认永久有效"
                      />
                    </v-col>
                    <v-col
                      v-if="item.type === 'treeSelect'"
                      cols="8"
                      class="mb-6"
                    >
                       <treeselect
                        :load-options="loadOptions"
                        :multiple="item.isMultiple"
                        :options="item.options"
                        :placeholder="item.label"
                        v-model="item.value"
                        :value-consists-of="valueConsistsOf"
                        noChildrenText="没有数据"
                        noResultsText="没有匹配数据"
                        @input="changInput"
                        :flat="item.flat || false"
                      >
                        <div slot="value-label" slot-scope="{ node }">
                          {{ node.raw.label }}
                        </div>
                      </treeselect>
                    </v-col>
                    <v-file-input
                      v-if="item.type === 'file'"
                      :label="item.label"
                      :multiple="item.multiple"
                      :accept="item.accept"
                      :required="item.required"
                      :rules="item.rules"
                      outlined
                      dense
                    />
                  </v-row>
                </v-form>
              </div>
            </slot>
          </v-container>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <div class="flex-grow-1" />
          <div v-if="formHeader.isEdit === false && !formHeader.needReview">
            <v-btn
              class="cancelButton mr-4"
              outlined
              @click="cancelCrudFormDialog">取消
            </v-btn>
            <v-btn
                class="primary mr-4"
                style="margin-right:10px;color:white"
                @click="confimDialogSave()"
                :disabled="!valid"
              >
              保存
            </v-btn>
          </div>
          <div v-else-if="formHeader.isEdit === true && isEditMode === true && !formHeader.needReview">
            <v-btn
              class="cancelButton mr-4"
              outlined
              @click="cancelCrudFormDialog">取消
            </v-btn>
            <v-btn
                class="primary mr-4"
                style="margin-right:10px;color:white"
                @click="confimDialogSave()"
                :disabled="!valid"
              >
              保存
            </v-btn>
          </div>
          <div v-else-if="formHeader.needReview === true && formHeader.isEdit === false && isEditMode === false">
            <v-btn
              class="cancelButton mr-4"
              outlined
              @click="cancelCrudFormDialog">取消
            </v-btn>
            <v-btn
                class="primary mr-4"
                style="margin-right:10px;color:white"
                @click="confimDialogSave()"
                :disabled="!valid"
              >
              保存
            </v-btn>
            <v-btn
                class="primary mr-4"
                style="margin-right:10px;color:white"
                @click="submitReview()"
                :disabled="!valid"
              >
              送审
            </v-btn>
          </div>
          <div v-else-if="formHeader.needReview === true && formHeader.isEdit === true && isEditMode === true">
            <v-btn
              class="cancelButton mr-4"
              outlined
              @click="cancelCrudFormDialog">取消
            </v-btn>
            <v-btn
                class="primary mr-4"
                style="margin-right:10px;color:white"
                @click="confimDialogSave()"
                :disabled="!valid"
              >
              保存
            </v-btn>
            <v-btn
                class="primary mr-4"
                style="margin-right:10px;color:white"
                @click="submitReview()"
                :disabled="!valid"
              >
              送审
            </v-btn>
          </div>
          <div v-else>
            <v-btn class="primary mr-4" @click="cancelCrudFormDialog">确定
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import { format, parse } from 'date-fns';
import { Treeselect, LOAD_ROOT_OPTIONS } from '@riophae/vue-treeselect';
import DatetimePicker from '@c/DateTimePicker';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
// eslint-disable-next-line promise/param-names
const sleep = d => new Promise(r => setTimeout(r, d));
let called = false;
export default {
  name: 'BaseCreate',
  props: {
    crudFormDialog: {
      type: Boolean,
      default: false
    },
    formHeader: {
      type: Object,
      required: true,
      default: () => ({
        isEdit: true
      })
    },
    formData: {
      type: Array,
      default: () => []
    },
    // 区分树结构方法的标记
    nodeFlg: {
      type: String,
      default: '1'
    },
    isCanEdit: {
      type: Boolean,
      default: true
    },
    cardHeight: {
      type: String,
      default: ''
    },
    baseCteateEditPowerBtn: {
      type: String,
      default: () => ''
    }
  },
  watch: {
    crudFormDialog (val) {
      if (this.$refs.form) {
        this.$refs.form.reset();
      }
    }
  },
  data () {
    return {
      newDate: null,
      menu: false,
      valid: true,
      lazy: false,
      isEditMode: false,
      nodeList: [],
      valueConsistsOf: 'ALL_WITH_INDETERMINATE',
      validTime: new Date()
    };
  },
  beforeDestroy () {
    this.isEditMode = false;
  },
  methods: {
    // 延迟加载
    async loadOptions ({ action }) {
      if (action === LOAD_ROOT_OPTIONS) {
        if (!called) {
          await sleep(2000);
          called = true;
          throw new Error('Failed to load options: test.');
        } else {
          await sleep(2000);
          this.options = [ 'a', 'b', 'c', 'd', 'e' ].map(id => ({
            id,
            label: `option-${id}`
          }));
        }
      }
    },
    changInput (value, instanceId) {
      console.log(instanceId);
    },
    confimDialogSave () {
      this.isEditMode = false;
      this.$emit('confimDialogSave', this.formData, this.$refs.form);
    },
    cancelCrudFormDialog () {
      this.resetDefault();
      this.$emit('cancelCrudFormDialog', this.$refs.form);
    },
    enableEditMode () {
      this.isEditMode = !this.isEditMode;
    },
    resetDefault () {
      this.isEditMode = false;
      this.$refs.form.reset();
    },
    switchChange (fl) {
      this.$emit('switchOnChange', fl);
      this.newDate = new Date().getTime();
    },
    submitReview () {
      this.$emit('submitReview', this.formData, this.$refs.form);
    },
    // select下拉框的change事件
    handleChangeSelect (item, index) {
      this.$emit('handleChangeSelect', item, index);
    },
    // 清空添加或编辑弹框中验证规则的提示词
    resetValidation () {
      this.$refs.form.resetValidation();
    }
  },
  computed: {
    isEditDropdown () {
      return {
        'v-input__icon': this.isEditMode ? 'display: none' : '',
        'v-input__icon--append': this.isEditMode ? 'display: none' : ''
      };
    },
    styleObject () {
      return {
        height: this.cardHeight
      };
    }
  },
  components: {
    Treeselect,
    DatetimePicker
  },
  created () {}
};
</script>
<style lang="stylus" scoped>
.isEditDropdown >>> .v-select__slot .v-input__append-inner {
  display: none !important
}
.ruleSetAddOrEdit >>> .v-input__control {
  height: auto !important;
}
.ruleSetAddOrEdit .col {
  padding: 0 !important;
}
>>> .v-text-field.v-text-field--enclosed .v-text-field__details {
    margin-bottom: 4px;
}
/* 问好样式 */
.questionMark {
  margin-left: 14px;
  cursor: pointer;
  display: inline-block;
  position: absolute;
  top: 6px;
  right: -35px;
}
>>> .vue-treeselect__menu{
  max-height: 200px !important;
}
>>> .vue-treeselect--has-value .vue-treeselect__multi-value{
 margin-bottom: 5px;
 max-height: 500px;
 overflow: auto;
}
</style>
