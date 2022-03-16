import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import zhHans from 'vuetify/es5/locale/zh-Hans';
import LRU from 'lru-cache';

const themeCache = new LRU({
  max: 10,
  maxAge: 1000 * 60 * 60 // 1 hour
});

Vue.use(Vuetify);

export default new Vuetify({
  breakpoint: {
    thresholds: {
      xs: 340,
      sm: 540,
      md: 800,
      lg: 1280
    },
    mdAndUp: true
  },
  theme: {
    themes: {
      light: {
        primary: window.g.baseColor,
        secondary: '#424242',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107',
        background: window.g.bgColor,
        emptyCircleColor: window.g.emptyCircleColor,
        automaticPermitThroughColor: window.g.automaticPermitThroughColor,
        identificationColor: window.g.identificationColor,
        manuallyReviewColor: window.g.manuallyReviewColor,
        tacitlyApproveColor: window.g.tacitlyApproveColor,
        seeDetialFieldColor: window.g.seeDetialFieldColor,
        dashedColor: window.g.dashedColor,
        seeDetailsHeadBgColor: window.g.seeDetailsHeadBgColor,
        headerTextColor: window.g.headerTextColor,
        leftMenuActiveBgColor: window.g.leftMenuActiveBgColor,
        headerBtnColor: window.g.headerBtnColor,
        tableRowHoverActive: '#eeeeee',
        tabBannerBgColor: '#FFFFFF',
        navMenuColor: window.g.navMenuColor,
        headerCloseIconColor: window.g.headerCloseIconColor
      },
      dark: {
        background: '#303030',
        headerTextColor: window.g.headerTextColor,
        leftMenuActiveBgColor: window.g.leftMenuActiveBgColor,
        headerBtnColor: window.g.headerBtnColor,
        tableRowHoverActive: '#616161',
        tabBannerBgColor: '#000000'
      }
    },
    dark: false,
    options: {
      customProperties: true,
      minifyTheme: function (css) {
        return process.env.NODE_ENV === 'production'
          ? css.replace(/[\r\n|\r|\n]/g, '')
          : css;
      }
    },
    themeCache: function () {
      return process.env.NODE_ENV === 'production';
    }
  },
  lang: {
    locales: { zhHans },
    current: 'zh-Hans'
  }
});
