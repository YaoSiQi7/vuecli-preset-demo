<!-- author: 古雪瑞-->
<!-- updateTime: 2020-04-14-->
<template>
  <v-app class="inspire">
    <div class="home-main">
      <div class="left-center-item-bgColor">
        <!-- 最左侧导航栏 -->
        <Header :MenuList="MenuList" @handleRouter="handleRouter(arguments)"  @funcToggleMini="toggleMini"/>
      </div>
      <!-- 左侧导航栏 -->
      <div id="menuLeft" class="home-left-menu">
        <left-menu @changeRouter="changeRouter" :MenuItems="MenuItems"></left-menu>
      </div>
      <!-- 主体内容部分 -->
      <div id="main" style="float:left;width: calc(100% - 228px);height: auto;">
        <header-nav :switchApplication="switchApplication" @handleRouter="handleRouter(arguments)"></header-nav>
        <v-content id='main--content' style="padding: 0;" class="main--content">
          <v-container
            fluid
            class="py-0"
          >
            <router-view />
          </v-container>
        </v-content>
      </div>
    </div>
    <!-- 公共弹框提示 -->
      <v-snackbar
        v-model="snackbarServe"
        :timeout="timeout"
        :color="snackbarServeColor"
        :top="isSnackbarTop"
      >
        {{ snackbarServeMsg }}
      </v-snackbar>
  </v-app>
</template>

<script>
import Header from '@/components/Header';
import LeftMenu from '@/components/LeftMenu';
import HeaderNav from '@/components/HeaderNav';
import { mapGetters, mapActions } from 'vuex';
export default {
  name: 'home',
  components: {
    Header,
    LeftMenu,
    HeaderNav
  },
  data: () => ({
    toggleFlag: true,
    isMini: false,
    MenuItems: [],
    hoverMenuItems: [],
    switchApplication: true,
    MenuListObj: {},
    MenuList: [],
    secItem: [],
    // 提示弹框参数
    timeout: 2000,
    isSnackbarTop: true,
    snackbarServe: false,
    snackbarServeMsg: '',
    snackbarServeColor: 'error'
  }),
  created () {
    // 在页面加载时读取sessionStorage里的应用列表数据
    if (sessionStorage.getItem('vuexAppList')) {
      this.setAppList(JSON.parse(sessionStorage.getItem('vuexAppList')));
    }
    if (sessionStorage.getItem('secondLevelRouterItems')) {
      this.toSecondRouterPage(JSON.parse(sessionStorage.getItem('secondLevelRouterItems')));
    }
    // 在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('vuexAppList', JSON.stringify(this.$store.state.appList));
      sessionStorage.setItem('secondLevelRouterItems', JSON.stringify(this.$store.state.secondLevelRouterItems));
    });
    // 移除存储在sessionStorage中的vuex信息
    sessionStorage.removeItem('secondLevelRouterItems');
  },
  mounted () {
    // 监听接口报错
    this.$bus.$on('snackBar', res => {
      this.snackbarServe = res.show;
      this.snackbarServeMsg = res.msg;
    });
    if (localStorage.getItem('loginData')) {
      this.MenuListObj = JSON.parse(localStorage.getItem('loginData'));// 登录接口返回所有数据
      this.MenuList = JSON.parse(this.MenuListObj.textContent); // 导航树数据
      this.ruleEditMode(JSON.parse(sessionStorage.getItem('ruleEditMode')));
      let name = this.MenuList[0].id;
      // let name = this.MenuList[0].id;
      if (sessionStorage.getItem('appName')) {
        this.changeAppName(JSON.parse(sessionStorage.getItem('appName')));
      } else {
        if (this.MenuListObj.appList.length) {
          sessionStorage.setItem('appName', JSON.stringify(this.MenuListObj.appList[0]));
          this.changeAppName(this.MenuListObj.appList[0]);
          this.setAppList(this.MenuListObj.appList);// 应用列表数据存储到vuex里
        }
      }
      // 刷新页面时保持当前菜单高亮
      // if (sessionStorage.getItem('isActive')) {
      // this.isActive = sessionStorage.getItem('isActive');
      // this.MenuItems = JSON.parse(this.MenuListObj[sessionStorage.getItem('isActive')]);
      this.MenuItems = JSON.parse(sessionStorage.getItem('menuItems'));
      this.isShowApplication();// 是否显示右上角应用
      if (sessionStorage.getItem('itemChildren')) {
        this.changeRouter(JSON.parse(sessionStorage.getItem('itemChildren')));
      } else {
        this.changeRouter(this.MenuItems[0]);
      }
      // }
      // else {
      // this.isActive = this.MenuList[0].id;
      // sessionStorage.setItem('isActive', this.isActive);
      // this.MenuItems = JSON.parse(sessionStorage.getItem('menuItems'));
      // }
      this.secItem = [];
      this.secItem.push(this.navItems[1].text);// 添加默认的到展开的二级目录数组中
      this.getSelectItem();// 展开打开的二级目录
    } else {
      this.$router.replace('/login');
    }
  },
  methods: {
    toggleMini (data) { // 展开收缩
      this.isMini = data;
    },
    getSelectItem () { // 展开已选的二级菜单
      this.MenuItems.forEach((item) => {
        item.model = false;
        this.secItem.forEach((key) => {
          if (item.text === key) {
            item.model = true;
          }
        });
      });
    },
    handleRouter (params) {
      this.MenuItems = [];// 二三级目录集合
      this.isShowApplication(); // 右上角是否显示切换应用按钮
      this.MenuItems = JSON.parse(this.MenuListObj[this.isActive]); // 切换中心，更新二级菜单
      // 定义跳转路由变量，存储所点击中心的第一个菜单路由，跳转页面
      if (params) {
        this.isMini = params[0];// 点击一级菜单展开二三级目录
        let jumpPath;
        if (this.MenuItems[0] && this.MenuItems[0].children && !this.MenuItems[0].children[0].pageType) {
          jumpPath = this.MenuItems[0].children[0].path;
        } else {
          jumpPath = this.MenuItems[0].path;
        }
        this.$router.replace(jumpPath).catch(data => { });
      } else {
        this.$router.replace(this.$route.path).catch(data => { });
      }
      this.secItem = [];// 所展开的二级目录
      // 点击中心时将每个二级菜单的model重置为false， 保证是收起状态
      this.MenuItems.forEach((item) => {
        item.model = false;
        if (this.navItems[1].text === item.text) {
          item.model = true;
          this.secItem.push(this.navItems[1].text);
        }
      });
    },
    // 判断当前所选的中心是否展示应用信息
    isShowApplication () {
      if (this.isActive === 'desicionModelItems' || this.isActive === 'systemManagementCenter') {
        this.switchApplication = false;
      } else {
        this.switchApplication = true;
      }
    },
    // 点击三级菜单
    changeRouter (itemChildren) {
      // 点击三级菜单,获取当前点击菜单信息
      // 如当前三级菜单有第四级菜单，则只取第三级菜单路径和名称，去掉第四级，用于vuex存储面包屑导航
      let activeItemChildren = {};
      if (itemChildren.children && itemChildren.children.length) {
        activeItemChildren['path'] = itemChildren.path;
        activeItemChildren['text'] = itemChildren.text;
      } else {
        activeItemChildren = itemChildren;
      }
      this.$router.replace(activeItemChildren.path).catch(data => { });
    },
    ...mapActions([
      'handleChangeNavItems',
      'setAppList',
      'changeAppName',
      'ruleEditMode',
      'toSecondRouterPage'
    ])
  },
  computed: {
    ...mapGetters([
      'navItems',
      'isActive'
    ])
  },
  watch: {
    isMini: {
      handler: function (newval, oldval) {
        if (!newval) {
          this.$nextTick(() => {
            document.getElementById('menuLeft').style.width = '160px';
            document.getElementById('menuLeft').style.transition = 'all .2s';
            document.getElementById('menuLeft').style.visibility = 'visible';
            document.getElementById('main').style.width = 'calc(100% - 228px)';
          });
        } else {
          this.$nextTick(() => {
            document.getElementById('menuLeft').style.width = '0px';
            document.getElementById('main').style.transition = 'all .2s';
            document.getElementById('menuLeft').style.visibility = 'hidden';
            document.getElementById('main').style.width = 'calc(100% - 68px)';
          });
        }
      },
      immediate: true
    },
    isActive: {// 当前中心
      handler: function (val) {
        if (val) {
          this.isMini = false;
          this.handleRouter();
        }
      }
    }
  },
  beforeDestroy () {
    // 事件并不会自动销毁, 所以要在逐渐地销毁之前将其关闭
    this.$bus.$off('snackBar');
  }
};
</script>
<style lang="stylus" scoped>
  .home-main {
    height: 100%;
    overflow: hidden;
  }
  .left-center-item-bgColor {
    width: 68px;
    height: 100%;
    float: left;
    overflow: hidden;
    background: var(--v-navMenuColor-base);
  }
  .home-left-menu {
    float: left;
    width: 160px;
    height:100%;
    background-color: #f5f5f6;
    overflow: hidden;
  }
  .hoverLeftMenu {
    width: 160px;
    height: 100%;
    background-color: #f5f5f6;
    position: absolute;
    left: 68px;
    top: 0;
    display: none;
  }
</style>
