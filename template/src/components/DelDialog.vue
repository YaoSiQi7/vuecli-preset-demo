<template>
  <v-row justify="center">
    <v-dialog
      v-model="isDialogShow"
      persistent
      width="381"
    >
      <v-card class="del-dialog">
        <v-card-title v-if="customDelTitle" class="del-dialog-title">
          {{ customDelTitle }}
        </v-card-title>
        <v-card-title v-else class="del-dialog-title">
          {{ deleteTitle }}
        </v-card-title>
        <v-card-actions style="margin-right:12px;margin-top:10px;">
          <div class="flex-grow-1" />
          <v-btn
            text
            class="del-dialog-btn"
            @click="cancelDel()"
          >
            取消
          </v-btn>
          <v-btn
            color="primary"
            text
            class="del-dialog-btn"
            @click="confimDel()"
          >
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name: 'DelDialog',
  props: {
    isDialogShow: {
      type: Boolean,
      default: false
    },
    debugModeClueCode: { // 调试模式下，删除语
      type: String,
      default: ''
    },
    customDelTitle: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
    };
  },
  computed: {
    deleteTitle: function () {
      return this.debugModeClueCode ? this.debugModeClueCode : '您确定要删除此行？';
    }
  },
  watch: {},
  mounted () {},
  methods: {
    confimDel () {
      this.$emit('confimDel');
    },
    cancelDel () {
      this.$emit('cancelDel');
    }
  }
};
</script>
<style lang="stylus" scoped>
  .delDialogIcon {
    color: var(--v-primary-base) !important;
  }
</style>
