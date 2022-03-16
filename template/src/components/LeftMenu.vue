<!-- author: 古雪瑞-->
<!-- updateTime: 2020-04-07-->
<template>
  <div>
      <v-list id="menuLeft" dense style="height:100vh;background-color: #f5f5f6;overflow-y: scroll;width: 190px;padding-right: 29px;" :expand="true">
        <div v-for="(item, index) in MenuItems"
            :key="index"
            >
        <v-list-group
          v-model="item.model"
          :class="index===MenuItems.length-1? &quot;lastGroup&quot;:&quot;&quot;"
          :prepend-icon="item.icon"
          append-icon="mdi-chevron-down"
          small
          v-if="item.children && !item.children[0].pageType"
          @click="handleMiddleItems(item)"
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title
                class="menu-primary-text-color"
                v-text="item.text"
              />
            </v-list-item-content>
          </template>
          <v-list-item
            v-for="(itemChildren, i) in item.children"
            :key="i"
            :to="itemChildren.path"
            @click="changeRouter(itemChildren)"
          >
            <v-list-item-content>
              <v-list-item-title class="pdleft">{{ itemChildren.text}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
        <v-list-item
            v-else
            :to="item.path"
            @click="changeRouter(item)">
            <v-avatar class="sec-icon">
              <v-icon style="font-size: 20.5px;margin-left: -4px;width:20px;">{{item.icon}}</v-icon>
            </v-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ item.text}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </div>
      </v-list>
  </div>
</template>
<script>
export default {
  name: 'leftMenu',
  props: {
    MenuItems: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    changeRouter (itemChildren) {
      this.$emit('changeRouter', itemChildren);
    },
    handleMiddleItems (item) {
      this.$emit('handleMiddleItems', item);
    }
  }
};
</script>
<style lang="stylus" scoped>
.sec-icon{
  height: 24px !important;
  min-width: 24px !important;
  width: 24px !important;
  margin: 8px 10px 8px 0 !important;
  border-radius: 0 !important;
  >>> .theme--light.v-icon {
    color:#333;
  }
}
>>> .v-list-item--active .sec-icon .theme--light.v-icon {
    color:var(--v-primary-base) !important;
  }
>>> .v-list-group__items {
   padding-top: 0px !important;
   padding-bottom: 10px !important;
   .v-avatar{
    width:30px !important;
    height:30px !important;
    min-width: 30px !important;
    line-height 30px;
    margin-right: 5px;
  }
 }
 >>> .v-list .v-list-item--active {
    color: var(--v-primary-base) !important;
    border-radius: 3px;
}
  .navgation-bgColor {
    background-color: #26344B !important;
  }
  .pdleft {
    padding-left: 26%;
  }
  .v-list-item__title {
    font-size: 12px !important;
  }
</style>
