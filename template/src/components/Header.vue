<template>
  <div>
      <ul style="height: 100vh;margin: 0;padding: 0">
        <li
          v-for="(item, index) in MenuList"
          :key="index"
          :class="{'active':isActive === item.id}"
        >
          <v-btn
            text
            class="left-center-men-icon-color"
            @click="handleClick(item)"
          >
            <v-icon>{{ item.icon }}</v-icon>
          </v-btn>
        </li>
      </ul>
      <!-- 收缩按钮 -->
      <div class="togglemini">
        <v-app-bar-nav-icon @click.stop="toggleMini"></v-app-bar-nav-icon>
      </div>
  </div>
</template>
<script>
import { queryAppListAll } from 'api/queryHeaderAppList.js';
import { mapGetters, mapActions } from 'vuex';
export default {
  name: 'Header',
  props: {
    MenuList: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    navHeaderColor: '',
    bannerHeader: '',
    historyColor: [],
    darkMode: false,
    isMini: false
  }),
  mounted () {
    this.navHeaderColor = window.g.navHeaderColor;
    this.bannerHeader = window.g.globalHeader;
    if (localStorage.themeColor) {
      this.$vuetify.theme.themes.light.primary = localStorage.themeColor;
      this.$vuetify.theme.themes.dark.primary = localStorage.themeColor;
      this.color = localStorage.themeColor;
    } else {
      this.$vuetify.theme.themes.light.primary = window.g.baseColor;
      this.$vuetify.theme.themes.dark.primary = window.g.baseColor;
    }
  },
  computed: {
    ...mapGetters([
      'isActive'
    ])
  },
  methods: {
    handleClick (item) {
      this.isMini = false;
      this.setCenterActive(item.id);
      this.$emit('handleRouter', this.isMini);
    },
    toggleMini () {
      this.isMini = !this.isMini;
      this.$emit('funcToggleMini', this.isMini);
    },
    ...mapActions([
      'setCenterActive'
    ])
  }
};
</script>
<style lang="stylus" scoped>
// 收缩按钮
  .togglemini {
    position: fixed !important;
    left: 15px !important;
    bottom: 10px !important;
    width: 40px;
    height: 40px;
    padding-bottom: 10px;
  }
  span {
    cursor: pointer;
    margin-right: 42px;
  }
  li {
    list-style: none;
    cursor: pointer;
    width: 100%;
    height: 59px;
    line-height: 59px;
    >>> .v-btn:not(.v-btn--round).v-size--default {
      height: 100% !important;
    }
  }
  .left-center-men-icon-color {
    color: #fff;
  }
  .active, .activeIcon {
    transition-duration: .3s
    transition-timing-function: cubic-bezier(.4,0,.2,1);
    background: var(--v-primary-base);
    opacity: 1;
    width: 100%;
    height: 59px;
    line-height: 59px;
  }
  .v-tabs-slider-boder
    display: block;
    left: 0;
    bottom: 0;
    margin: 0 !important;
    position: absolute;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
    z-index: 1;
    .slider-boder
      display: block;
      width: 100%;
      height: 3px;
      background: var(--v-headerTextColor-base);
  .togglemini {
    position: absolute;
    bottom: 20px;
    left: 15px;
  }
  .togglemini .v-icon {
    color: #fff;
  }
</style>
