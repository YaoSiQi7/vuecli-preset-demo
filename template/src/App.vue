<template>
  <v-app>
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data: () => ({})
};
</script>
<style>
  @font-face {
    font-family: PingFangSC Semibold;
    src: url("../static/fonts/PingFangSC-Semibold.woff2") format("woff2");
  }
  @font-face {
    font-family: "Roboto Light";
    src: url("../node_modules/roboto-font/fonts/Roboto/roboto-regular-webfont.woff") format("woff2");
  }

  @font-face {
    font-family: "Roboto";
    src: url("../node_modules/roboto-font/fonts/Roboto/roboto-regular-webfont.woff") format("woff2");
  }

  @font-face {
    font-family: "Roboto Bold";
    src: url("../node_modules/roboto-font/fonts/Roboto/roboto-regular-webfont.woff") format("woff2");
  }
</style>
