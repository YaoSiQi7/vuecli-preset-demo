<template>
  <div>
    <!-- <base-search /> -->
  <v-card>
    <v-card-text ref="canvas" style="position: relative;">
      <v-btn color="primary" outlined @click="goBack">返回</v-btn>
      <div id="3d-graph" class="mt-2"></div>
      <v-card class="elevation-0 card-legend" style="background-color: transparent;">
        <v-card-text >
          <div class="py-2">
            <v-icon color="#A6CEE3">mdi-circle</v-icon>
            <span class="legend-font">手机号</span>
          </div>
          <div class="py-2">
            <v-icon color="#1F78B4">mdi-circle</v-icon>
            <span class="legend-font">设备</span>
          </div>
          <div class="py-2">
            <v-icon color="#b2df8a">mdi-circle</v-icon>
            <span class="legend-font">IP</span>
          </div>
          <div class="py-2">
            <span class="legend-font pl-0"><span style="color: #fe8894">红色</span>: 风险节点</span>
          </div>
        </v-card-text>
      </v-card>
    </v-card-text>
  </v-card>
        <!-- 右上角固定卡片 -->
  <v-card class="elevation-0 card-info" style="background-color: transparent;">
    <v-card-text class="pr-0 py-0">
      <v-list dense style="background-color: transparent; color: white">
        <v-subheader class="pl-0" style="color: #fff">群体画像</v-subheader>
          <!-- <v-list-item
          class="pl-0"
          v-for="(item, i) in infoItems"
          :key="i"
        >
          <v-list-item-content>
            <v-list-item-title v-if="item.text" v-text="item.text"></v-list-item-title>
            <v-list-item-subtitle v-if="item.subtitle" class="pl-4" v-html="item.subtitle"></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item> -->
        <div class="pr-4 pt-2">手机号数: {{cardIntoItems.phoneNum}}</div>
        <div class="pr-4 pt-2">设备数: {{cardIntoItems.deviceNum}}</div>
        <div class="pr-4 pt-2">IP数: {{cardIntoItems.ipNum}}</div>
        <div class="pr-4 pt-2">风险手机号数: {{cardIntoItems.riskPhone}}</div>
        <div class="pr-4 pt-2">风险设备数: {{cardIntoItems.riskDevice}}</div>
        <div class="pr-4 pt-2">风险IP数: {{cardIntoItems.riskIp}}</div>
      </v-list>
    </v-card-text>
  </v-card>
  </div>
</template>
<script>
import ForceGraph3D from '3d-force-graph';
import relData from 'utils/blocks.json';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { LuminosityShader } from 'three/examples/jsm/shaders/LuminosityShader.js';

export default {
  name: 'rel-graph',
  data () {
    return {
      // 右上角卡片数据
      cardIntoItems: {},
      myjson: relData,
      canvasWidth: null,
      canvasHeight: null,
      threeDGraph: null,
      highlightNodes: null,
      highlightLinks: null,
      graphJson: {
        nodes: [
          { 'id': 0, 'group': 'PHONE', 'val': 4, 'node_id': '21321312312132', 'value': '15152043862', 'color': '#fe8894' },
          { 'id': 1, 'group': 'PHONE', 'value': '15895253354' },
          { 'id': 2, 'group': 'PHONE', 'value': '15895253354' },
          { 'id': 3, 'group': 'PHONE', 'value': '15895253354' },
          { 'id': 4, 'group': 'PHONE', 'value': '15152047230' },
          { 'id': 5, 'group': 'PHONE', 'value': '13905226529' },
          { 'id': 6, 'group': 'PHONE', 'value': '13905226529' },
          { 'id': 7, 'group': 'PHONE', 'value': '13905226529' },
          { 'id': 8, 'group': 'PHONE', 'value': '13905226529' },
          { 'id': 9, 'group': 'PHONE', 'value': '13905226529' },
          { 'id': 10, 'group': 'DEVICE', 'value': '76814f1088ff468cb36e95b9181c1771' },
          { 'id': 11, 'group': 'DEVICE', 'val': 4, 'value': '9f4e2dd740d64c7885cbc757999829d8', 'color': '#fe8894' },
          { 'id': 12, 'group': 'IP', 'value': '29.103.113.114' },
          { 'id': 13, 'group': 'DEVICE', 'value': '2fb62e0fba8b4c9eb40ae7e63b77ed90' },
          { 'id': 14, 'group': 'DEVICE', 'value': '4fc1fd5656254568841bf62359bb984e' },
          { 'id': 15, 'group': 'DEVICE', 'value': '153bf5e1213e451f9edfec5abf9c9ab7' },
          { 'id': 16, 'group': 'IP', 'val': 4, 'value': '101.166.25.215', 'color': '#fe8894' },
          { 'id': 17, 'group': 'IP', 'value': '200.22.148.72' },
          { 'id': 18, 'group': 'IP', 'value': '254.143.80.220' },
          { 'id': 19, 'group': 'IP', 'value': '254.143.80.220' },
          { 'id': 20, 'group': 'IP', 'value': '254.143.80.220' },
          { 'id': 21, 'group': 'IP', 'value': '254.143.80.220' },
          { 'id': 22, 'group': 'IP', 'value': '254.143.80.220' },
          { 'id': 23, 'group': 'IP', 'val': 4, 'value': '24.63.190.202', 'color': '#fe8894' },
          { 'id': 24, 'group': 'PHONE', 'value': '15895254900' },
          { 'id': 25, 'group': 'PHONE', 'val': 4, 'value': '15152043862', 'color': '#fe8894' },
          { 'id': 26, 'group': 'DEVICE', 'val': 4, 'value': '444fdfffb26b48fdb7aad8521f132090', 'color': '#fe8894' },
          { 'id': 27, 'group': 'PHONE', 'val': 4, 'value': '15152043862', 'color': '#fe8894' },
          { 'id': 28, 'group': 'PHONE', 'value': '15834242265' },
          { 'id': 29, 'group': 'DEVICE', 'val': 4, 'value': '5c8e6f6cce774f2b96d5fd3a6e13efbd', 'color': '#fe8894' },
          { 'id': 30, 'group': 'IP', 'value': '26.67.152.244' },
          { 'id': 31, 'group': 'DEVICE', 'value': 'aad75f3f2a6647d9a666af4b3f6a0ae4' },
          { 'id': 32, 'group': 'DEVICE', 'value': 'aad75f3f2a6647d9a666af4b3f6a0ae4' },
          { 'id': 33, 'group': 'DEVICE', 'value': 'aad75f3f2a6647d9a666af4b3f6a0ae4' },
          { 'id': 34, 'group': 'DEVICE', 'value': 'aad75f3f2a6647d9a666af4b3f6a0ae4' },
          { 'id': 35, 'group': 'DEVICE', 'value': 'aad75f3f2a6647d9a666af4b3f6a0ae4' },
          { 'id': 36, 'group': 'DEVICE', 'value': 'aad75f3f2a6647d9a666af4b3f6a0ae4' },
          { 'id': 37, 'group': 'DEVICE', 'value': 'aad75f3f2a6647d9a666af4b3f6a0ae4' },
          { 'id': 38, 'group': 'DEVICE', 'value': 'aad75f3f2a6647d9a666af4b3f6a0ae4' },
          { 'id': 39, 'group': 'PHONE', 'value': '15152049388' },
          { 'id': 40, 'group': 'IP', 'value': '75.97.20.144' },
          { 'id': 41, 'group': 'PHONE', 'value': '15895259707' },
          { 'id': 42, 'group': 'PHONE', 'value': '13905227644' },
          { 'id': 43, 'group': 'DEVICE', 'value': 'aad75f3f2a6647d9a666af4b3f6a0ae4' },
          { 'id': 44, 'group': 'PHONE', 'value': '13905225612' },
          { 'id': 45, 'group': 'PHONE', 'value': '15152041885' },
          { 'id': 46, 'group': 'DEVICE', 'value': 'IPHONEXS' },
          { 'id': 47, 'group': 'DEVICE', 'value': 'IPHONE11' },
          { 'id': 48, 'group': 'IP', 'val': 4, 'value': '5.174.130.38', 'color': '#fe8894' },
          { 'id': 49, 'group': 'DEVICE', 'value': 'aad75f3f2a6647d9a666af4b3f6a0ae4' },
          { 'id': 50, 'group': 'DEVICE', 'value': 'aad75f3f2a6647d9a666af4b3f6a0ae4' },
          { 'id': 51, 'group': 'DEVICE', 'value': 'aad75f3f2a6647d9a666af4b3f6a0ae4' },
          { 'id': 52, 'group': 'DEVICE', 'value': 'aad75f3f2a6647d9a666af4b3f6a0ae4' },
          { 'id': 53, 'group': 'DEVICE', 'value': 'aad75f3f2a6647d9a666af4b3f6a0ae4' },
          { 'id': 54, 'group': 'DEVICE', 'value': 'aad75f3f2a6647d9a666af4b3f6a0ae4' },
          { 'id': 55, 'group': 'IP', 'val': 4, 'value': '5.174.130.38', 'color': '#fe8894' },
          { 'id': 56, 'group': 'DEVICE', 'value': '9dd4245b57ff4abfa2fdbf588fb9f4d4' },
          { 'id': 57, 'group': 'IP', 'val': 4, 'value': '5.174.130.38', 'color': '#fe8894' },
          { 'id': 58, 'group': 'IP', 'value': '150.22.203.61' },
          { 'id': 59, 'group': 'IP', 'value': '147.235.13.213' },
          { 'id': 60, 'group': 'IP', 'value': '120.171.139.26' },
          { 'id': 61, 'group': 'IP', 'value': '209.110.123.214' },
          { 'id': 62, 'group': 'IP', 'value': '209.110.123.214' },
          { 'id': 63, 'group': 'IP', 'value': '72.12.209.192' },
          { 'id': 64, 'group': 'IP', 'value': '248.66.31.28' },
          { 'id': 65, 'group': 'IP', 'value': '92.49.138.154' },
          { 'id': 66, 'group': 'IP', 'value': '227.207.121.149' },
          { 'id': 67, 'group': 'PHONE', 'value': '15152041055' },
          { 'id': 68, 'group': 'PHONE', 'value': '13905220353' },
          { 'id': 69, 'group': 'PHONE', 'value': '15152046889' },
          { 'id': 70, 'group': 'PHONE', 'value': '15152046889' },
          { 'id': 71, 'group': 'PHONE', 'value': '13905220764' },
          { 'id': 72, 'group': 'DEVICE', 'value': '776e0cc3de6c47e48d804654dfb683e1' },
          { 'id': 73, 'group': 'DEVICE', 'value': '776e0cc3de6c47e48d804654dfb683e1' },
          { 'id': 74, 'group': 'DEVICE', 'value': '0f1e215268a9465fa98f521ce5619e0f' },
          { 'id': 75, 'group': 'PHONE', 'value': '15895254527' },
          { 'id': 76, 'group': 'IP', 'value': '209.110.123.214' }
        ],
        links: [
          { 'source': 1, 'target': 0, 'value': 1, 'name': 'napolun' },
          { 'source': 2, 'target': 0, 'value': 8 },
          { 'source': 3, 'target': 0, 'value': 10 },
          { 'source': 3, 'target': 2, 'value': 6 },
          { 'source': 4, 'target': 0, 'value': 1 },
          { 'source': 5, 'target': 0, 'value': 1 },
          { 'source': 6, 'target': 0, 'value': 1 },
          { 'source': 7, 'target': 0, 'value': 1 },
          { 'source': 8, 'target': 0, 'value': 2 },
          { 'source': 9, 'target': 0, 'value': 1 },
          { 'source': 11, 'target': 10, 'value': 1 },
          { 'source': 11, 'target': 3, 'value': 3 },
          { 'source': 11, 'target': 2, 'value': 3 },
          { 'source': 11, 'target': 0, 'value': 5 },
          { 'source': 12, 'target': 11, 'value': 1 },
          { 'source': 13, 'target': 11, 'value': 1 },
          { 'source': 14, 'target': 11, 'value': 1 },
          { 'source': 15, 'target': 11, 'value': 1 },
          { 'source': 17, 'target': 16, 'value': 4 },
          { 'source': 18, 'target': 16, 'value': 4 },
          { 'source': 18, 'target': 17, 'value': 4 },
          { 'source': 19, 'target': 16, 'value': 4 },
          { 'source': 19, 'target': 17, 'value': 4 },
          { 'source': 19, 'target': 18, 'value': 4 },
          { 'source': 20, 'target': 16, 'value': 3 },
          { 'source': 20, 'target': 17, 'value': 3 },
          { 'source': 20, 'target': 18, 'value': 3 },
          { 'source': 20, 'target': 19, 'value': 4 },
          { 'source': 21, 'target': 16, 'value': 3 },
          { 'source': 21, 'target': 17, 'value': 3 },
          { 'source': 21, 'target': 18, 'value': 3 },
          { 'source': 21, 'target': 19, 'value': 3 },
          { 'source': 21, 'target': 20, 'value': 5 },
          { 'source': 22, 'target': 16, 'value': 3 },
          { 'source': 22, 'target': 17, 'value': 3 },
          { 'source': 22, 'target': 18, 'value': 3 },
          { 'source': 22, 'target': 19, 'value': 3 },
          { 'source': 22, 'target': 20, 'value': 4 },
          { 'source': 22, 'target': 21, 'value': 4 },
          { 'source': 23, 'target': 16, 'value': 3 },
          { 'source': 23, 'target': 17, 'value': 3 },
          { 'source': 23, 'target': 18, 'value': 3 },
          { 'source': 23, 'target': 19, 'value': 3 },
          { 'source': 23, 'target': 20, 'value': 4 },
          { 'source': 23, 'target': 21, 'value': 4 },
          { 'source': 23, 'target': 22, 'value': 4 },
          { 'source': 23, 'target': 12, 'value': 2 },
          { 'source': 23, 'target': 11, 'value': 9 },
          { 'source': 24, 'target': 23, 'value': 2 },
          { 'source': 24, 'target': 11, 'value': 7 },
          { 'source': 25, 'target': 24, 'value': 13 },
          { 'source': 25, 'target': 23, 'value': 1 },
          { 'source': 25, 'target': 11, 'value': 12 },
          { 'source': 26, 'target': 24, 'value': 4 },
          { 'source': 26, 'target': 11, 'value': 31 },
          { 'source': 26, 'target': 16, 'value': 1 },
          { 'source': 26, 'target': 25, 'value': 1 },
          { 'source': 27, 'target': 11, 'value': 17 },
          { 'source': 27, 'target': 23, 'value': 5 },
          { 'source': 27, 'target': 25, 'value': 5 },
          { 'source': 27, 'target': 24, 'value': 1 },
          { 'source': 27, 'target': 26, 'value': 1 },
          { 'source': 28, 'target': 11, 'value': 8 },
          { 'source': 28, 'target': 27, 'value': 1 },
          { 'source': 29, 'target': 23, 'value': 1 },
          { 'source': 29, 'target': 27, 'value': 1 },
          { 'source': 29, 'target': 11, 'value': 2 },
          { 'source': 30, 'target': 23, 'value': 1 },
          { 'source': 31, 'target': 30, 'value': 2 },
          { 'source': 31, 'target': 11, 'value': 3 },
          { 'source': 31, 'target': 23, 'value': 2 },
          { 'source': 31, 'target': 27, 'value': 1 },
          { 'source': 32, 'target': 11, 'value': 1 },
          { 'source': 33, 'target': 11, 'value': 2 },
          { 'source': 33, 'target': 27, 'value': 1 },
          { 'source': 34, 'target': 11, 'value': 3 },
          { 'source': 34, 'target': 29, 'value': 2 },
          { 'source': 35, 'target': 11, 'value': 3 },
          { 'source': 35, 'target': 34, 'value': 3 },
          { 'source': 35, 'target': 29, 'value': 2 },
          { 'source': 36, 'target': 34, 'value': 2 },
          { 'source': 36, 'target': 35, 'value': 2 },
          { 'source': 36, 'target': 11, 'value': 2 },
          { 'source': 36, 'target': 29, 'value': 1 },
          { 'source': 37, 'target': 34, 'value': 2 },
          { 'source': 37, 'target': 35, 'value': 2 },
          { 'source': 37, 'target': 36, 'value': 2 },
          { 'source': 37, 'target': 11, 'value': 2 },
          { 'source': 37, 'target': 29, 'value': 1 },
          { 'source': 38, 'target': 34, 'value': 2 },
          { 'source': 38, 'target': 35, 'value': 2 },
          { 'source': 38, 'target': 36, 'value': 2 },
          { 'source': 38, 'target': 37, 'value': 2 },
          { 'source': 38, 'target': 11, 'value': 2 },
          { 'source': 38, 'target': 29, 'value': 1 },
          { 'source': 39, 'target': 25, 'value': 1 },
          { 'source': 40, 'target': 25, 'value': 1 },
          { 'source': 41, 'target': 24, 'value': 2 },
          { 'source': 41, 'target': 25, 'value': 3 },
          { 'source': 42, 'target': 41, 'value': 2 },
          { 'source': 42, 'target': 25, 'value': 2 },
          { 'source': 42, 'target': 24, 'value': 1 },
          { 'source': 43, 'target': 11, 'value': 3 },
          { 'source': 43, 'target': 26, 'value': 1 },
          { 'source': 43, 'target': 27, 'value': 1 },
          { 'source': 44, 'target': 28, 'value': 3 },
          { 'source': 44, 'target': 11, 'value': 1 },
          { 'source': 45, 'target': 28, 'value': 2 },
          { 'source': 47, 'target': 46, 'value': 1 },
          { 'source': 48, 'target': 47, 'value': 2 },
          { 'source': 48, 'target': 25, 'value': 1 },
          { 'source': 48, 'target': 27, 'value': 1 },
          { 'source': 48, 'target': 11, 'value': 1 },
          { 'source': 49, 'target': 26, 'value': 3 },
          { 'source': 49, 'target': 11, 'value': 2 },
          { 'source': 50, 'target': 49, 'value': 1 },
          { 'source': 50, 'target': 24, 'value': 1 },
          { 'source': 51, 'target': 49, 'value': 9 },
          { 'source': 51, 'target': 26, 'value': 2 },
          { 'source': 51, 'target': 11, 'value': 2 },
          { 'source': 52, 'target': 51, 'value': 1 },
          { 'source': 52, 'target': 39, 'value': 1 },
          { 'source': 53, 'target': 51, 'value': 1 },
          { 'source': 54, 'target': 51, 'value': 2 },
          { 'source': 54, 'target': 49, 'value': 1 },
          { 'source': 54, 'target': 26, 'value': 1 },
          { 'source': 55, 'target': 51, 'value': 6 },
          { 'source': 55, 'target': 49, 'value': 12 },
          { 'source': 55, 'target': 39, 'value': 1 },
          { 'source': 55, 'target': 54, 'value': 1 },
          { 'source': 55, 'target': 26, 'value': 21 },
          { 'source': 55, 'target': 11, 'value': 19 },
          { 'source': 55, 'target': 16, 'value': 1 },
          { 'source': 55, 'target': 25, 'value': 2 },
          { 'source': 55, 'target': 41, 'value': 5 },
          { 'source': 55, 'target': 48, 'value': 4 },
          { 'source': 56, 'target': 49, 'value': 1 },
          { 'source': 56, 'target': 55, 'value': 1 },
          { 'source': 57, 'target': 55, 'value': 1 },
          { 'source': 57, 'target': 41, 'value': 1 },
          { 'source': 57, 'target': 48, 'value': 1 },
          { 'source': 58, 'target': 55, 'value': 7 },
          { 'source': 58, 'target': 48, 'value': 7 },
          { 'source': 58, 'target': 27, 'value': 6 },
          { 'source': 58, 'target': 57, 'value': 1 },
          { 'source': 58, 'target': 11, 'value': 4 },
          { 'source': 59, 'target': 58, 'value': 15 },
          { 'source': 59, 'target': 55, 'value': 5 },
          { 'source': 59, 'target': 48, 'value': 6 },
          { 'source': 59, 'target': 57, 'value': 2 },
          { 'source': 60, 'target': 48, 'value': 1 },
          { 'source': 60, 'target': 58, 'value': 4 },
          { 'source': 60, 'target': 59, 'value': 2 },
          { 'source': 61, 'target': 48, 'value': 2 },
          { 'source': 61, 'target': 58, 'value': 6 },
          { 'source': 61, 'target': 60, 'value': 2 },
          { 'source': 61, 'target': 59, 'value': 5 },
          { 'source': 61, 'target': 57, 'value': 1 },
          { 'source': 61, 'target': 55, 'value': 1 },
          { 'source': 62, 'target': 55, 'value': 9 },
          { 'source': 62, 'target': 58, 'value': 17 },
          { 'source': 62, 'target': 59, 'value': 13 },
          { 'source': 62, 'target': 48, 'value': 7 },
          { 'source': 62, 'target': 57, 'value': 2 },
          { 'source': 62, 'target': 41, 'value': 1 },
          { 'source': 62, 'target': 61, 'value': 6 },
          { 'source': 62, 'target': 60, 'value': 3 },
          { 'source': 63, 'target': 59, 'value': 5 },
          { 'source': 63, 'target': 48, 'value': 5 },
          { 'source': 63, 'target': 62, 'value': 6 },
          { 'source': 63, 'target': 57, 'value': 2 },
          { 'source': 63, 'target': 58, 'value': 4 },
          { 'source': 63, 'target': 61, 'value': 3 },
          { 'source': 63, 'target': 60, 'value': 2 },
          { 'source': 63, 'target': 55, 'value': 1 },
          { 'source': 64, 'target': 55, 'value': 5 },
          { 'source': 64, 'target': 62, 'value': 12 },
          { 'source': 64, 'target': 48, 'value': 5 },
          { 'source': 64, 'target': 63, 'value': 4 },
          { 'source': 64, 'target': 58, 'value': 10 },
          { 'source': 64, 'target': 61, 'value': 6 },
          { 'source': 64, 'target': 60, 'value': 2 },
          { 'source': 64, 'target': 59, 'value': 9 },
          { 'source': 64, 'target': 57, 'value': 1 },
          { 'source': 64, 'target': 11, 'value': 1 },
          { 'source': 65, 'target': 63, 'value': 5 },
          { 'source': 65, 'target': 64, 'value': 7 },
          { 'source': 65, 'target': 48, 'value': 3 },
          { 'source': 65, 'target': 62, 'value': 5 },
          { 'source': 65, 'target': 58, 'value': 5 },
          { 'source': 65, 'target': 61, 'value': 5 },
          { 'source': 65, 'target': 60, 'value': 2 },
          { 'source': 65, 'target': 59, 'value': 5 },
          { 'source': 65, 'target': 57, 'value': 1 },
          { 'source': 65, 'target': 55, 'value': 2 },
          { 'source': 66, 'target': 64, 'value': 3 },
          { 'source': 66, 'target': 58, 'value': 3 },
          { 'source': 66, 'target': 59, 'value': 1 },
          { 'source': 66, 'target': 62, 'value': 2 },
          { 'source': 66, 'target': 65, 'value': 2 },
          { 'source': 66, 'target': 48, 'value': 1 },
          { 'source': 66, 'target': 63, 'value': 1 },
          { 'source': 66, 'target': 61, 'value': 1 },
          { 'source': 66, 'target': 60, 'value': 1 },
          { 'source': 67, 'target': 57, 'value': 3 },
          { 'source': 68, 'target': 25, 'value': 5 },
          { 'source': 68, 'target': 11, 'value': 1 },
          { 'source': 68, 'target': 24, 'value': 1 },
          { 'source': 68, 'target': 27, 'value': 1 },
          { 'source': 68, 'target': 48, 'value': 1 },
          { 'source': 68, 'target': 41, 'value': 1 },
          { 'source': 69, 'target': 25, 'value': 6 },
          { 'source': 69, 'target': 68, 'value': 6 },
          { 'source': 69, 'target': 11, 'value': 1 },
          { 'source': 69, 'target': 24, 'value': 1 },
          { 'source': 69, 'target': 27, 'value': 2 },
          { 'source': 69, 'target': 48, 'value': 1 },
          { 'source': 69, 'target': 41, 'value': 1 },
          { 'source': 70, 'target': 25, 'value': 4 },
          { 'source': 70, 'target': 69, 'value': 4 },
          { 'source': 70, 'target': 68, 'value': 4 },
          { 'source': 70, 'target': 11, 'value': 1 },
          { 'source': 70, 'target': 24, 'value': 1 },
          { 'source': 70, 'target': 27, 'value': 1 },
          { 'source': 70, 'target': 41, 'value': 1 },
          { 'source': 70, 'target': 58, 'value': 1 },
          { 'source': 71, 'target': 27, 'value': 1 },
          { 'source': 71, 'target': 69, 'value': 2 },
          { 'source': 71, 'target': 68, 'value': 2 },
          { 'source': 71, 'target': 70, 'value': 2 },
          { 'source': 71, 'target': 11, 'value': 1 },
          { 'source': 71, 'target': 48, 'value': 1 },
          { 'source': 71, 'target': 41, 'value': 1 },
          { 'source': 71, 'target': 25, 'value': 1 },
          { 'source': 72, 'target': 26, 'value': 2 },
          { 'source': 72, 'target': 27, 'value': 1 },
          { 'source': 72, 'target': 11, 'value': 1 },
          { 'source': 73, 'target': 48, 'value': 2 },
          { 'source': 74, 'target': 48, 'value': 2 },
          { 'source': 74, 'target': 73, 'value': 3 },
          { 'source': 75, 'target': 69, 'value': 3 },
          { 'source': 75, 'target': 68, 'value': 3 },
          { 'source': 75, 'target': 25, 'value': 3 },
          { 'source': 75, 'target': 48, 'value': 1 },
          { 'source': 75, 'target': 41, 'value': 1 },
          { 'source': 75, 'target': 70, 'value': 1 },
          { 'source': 75, 'target': 71, 'value': 1 },
          { 'source': 76, 'target': 64, 'value': 1 },
          { 'source': 76, 'target': 65, 'value': 1 },
          { 'source': 76, 'target': 66, 'value': 1 },
          { 'source': 76, 'target': 63, 'value': 1 },
          { 'source': 76, 'target': 62, 'value': 1 },
          { 'source': 76, 'target': 48, 'value': 1 },
          { 'source': 76, 'target': 58, 'value': 1 }
        ]
      }
    };
  },
  mounted () {
    window.addEventListener('resize', this.onWindowResize);
    this.init();
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onWindowResize);
    this.threeDGraph = null;
  },
  methods: {
    onWindowResize (event) {
      this.relGraphHeight = window.innerHeight - 130;
      this.canvasWidth = document.getElementById('3d-graph').clientWidth;
      this.threeDGraph.height(this.relGraphHeight).width(this.canvasWidth);
    },
    goBack () {
      this.$router.push('/relationGraph');
    },
    updateHighlight () {
      // trigger update of highlighted objects in scene
      this.threeDGraph
        .nodeColor(this.threeDGraph.nodeColor())
        .linkWidth(this.threeDGraph.linkWidth())
        .linkDirectionalParticles(this.threeDGraph.linkDirectionalParticles());
    },
    init () {
      this.cardIntoItems = Object.assign({}, {
        deviceNum: this.graphJson.nodes.filter(item => item.group === 'DEVICE').length,
        phoneNum: this.graphJson.nodes.filter(item => item.group === 'PHONE').length,
        ipNum: this.graphJson.nodes.filter(item => item.group === 'IP').length,
        riskDevice: this.graphJson.nodes.filter(item => item.group === 'DEVICE' && item.val).length,
        riskPhone: this.graphJson.nodes.filter(item => item.group === 'PHONE' && item.val).length,
        riskIp: this.graphJson.nodes.filter(item => item.group === 'IP' && item.val).length
      });
      console.info(this.myjson);
      const elem = document.getElementById('3d-graph');
      const distance = 2000;

      this.canvasWidth = document.getElementById('3d-graph').clientWidth;
      this.canvasHeight = window.innerHeight - 130;
      this.canvasWidth = this.canvasWidth;
      // console.info(this.myjson)
      //
      this.graphJson.links.forEach(link => {
        const a = this.graphJson.nodes[link.source];
        const b = this.graphJson.nodes[link.target];
        !a.neighbors && (a.neighbors = []);
        !b.neighbors && (b.neighbors = []);
        a.neighbors.push(b);
        b.neighbors.push(a);

        !a.links && (a.links = []);
        !b.links && (b.links = []);
        a.links.push(link);
        b.links.push(link);
      });
      this.highlightNodes = new Set();
      this.highlightLinks = new Set();
      let hoverNode = null;

      this.graphJson.links.forEach(link => {
        const a = this.graphJson.nodes[link.source];
        const b = this.graphJson.nodes[link.target];
        !a.neighbors && (a.neighbors = []);
        !b.neighbors && (b.neighbors = []);
        a.neighbors.push(b);
        b.neighbors.push(a);

        !a.links && (a.links = []);
        !b.links && (b.links = []);
        a.links.push(link);
        b.links.push(link);
      });

      const NODE_R = 6;

      this.threeDGraph = ForceGraph3D({ controlType: 'orbit' })(elem)
        .graphData(this.graphJson)
        .width(this.canvasWidth)
        .height(this.canvasHeight)
        .nodeRelSize(NODE_R)
        .backgroundColor('#080f21')
        .cameraPosition({ z: distance })
        // .jsonUrl('../utils/blocks.json')
        // link 的 moving particles
        .linkDirectionalParticles(link => this.highlightLinks.has(link) ? 4 : 0)
        // link moviing particle size
        .linkDirectionalParticleWidth(2)
        // .nodeColor(node => this.highlightNodes.has(node) ? node === hoverNode ? 'rgb(255,0,0,1)' : 'rgba(255,160,0,0.8)' : 'rgba(0,255,255,0.6)')
        .nodeAutoColorBy('group')
        .nodeLabel((node) => {
          if (node.val) {
            return `节点ID: ${node.value} <br/> 分组: ${node.group} <br/>风险高`;
          } else {
            return `节点ID: ${node.value} <br/> 分组: ${node.group}`;
          }
        })
        .linkLabel(link => `${link.value}`)// eslint-disable-next-line
        // .onNodeHover(node => elem.style.cursor = node ? 'pointer' : null)
        .onNodeHover(node => {
          // no state change
          if ((!node && !this.highlightNodes.size) || (node && hoverNode === node)) return;

          this.highlightNodes.clear();
          this.highlightLinks.clear();
          if (node) {
            this.highlightNodes.add(node);
            node.neighbors.forEach(neighbor => this.highlightNodes.add(neighbor));
            node.links.forEach(link => this.highlightLinks.add(link));
          }

          hoverNode = node || null;
          elem.style.cursor = node ? 'pointer' : null;

          this.updateHighlight();
        })
        .onNodeClick(node => {
          // Aim at node from outside it
          const distance = 40;
          const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

          this.threeDGraph.cameraPosition(
            { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
            node, // lookAt ({ x, y, z })
            3000 // ms transition duration
          );
        }).onLinkHover(link => {
          this.highlightNodes.clear();
          this.highlightLinks.clear();

          if (link) {
            this.highlightLinks.add(link);
            this.highlightNodes.add(link.source);
            this.highlightNodes.add(link.target);
          }

          this.updateHighlight();
        });
      // .onNodeClick(node => window.open(`https://bl.ocks.org/${node.user}/${node.id}`, '_blank'));

      // unreal bloom effect
      const bloomPass = new UnrealBloomPass();
      bloomPass.strength = 1;
      bloomPass.radius = 0.5;
      bloomPass.threshold = 0.1;
      this.threeDGraph.postProcessingComposer().addPass(bloomPass);

      // camera orbit rorate
      // let angle = 0;
      // setInterval(() => {
      //   Graph.cameraPosition({
      //     x: distance * Math.sin(angle),
      //     z: distance * Math.cos(angle)
      //   });
      //   angle += Math.PI / 300;
      // }, 10);

      // 动态追加数据
      // setInterval(() => {
      //   const { nodes, links } = Graph.graphData();
      //   const id = nodes.length;
      //   Graph.graphData({
      //     nodes: [...nodes, { id }],
      //     links: [...links, { source: id, target: Math.round(Math.random() * (id-1)) }]
      //   });
      // }, 1000);
    }
  }
};
</script>
<style scoped>
.scene-nav-info {
  display: none
}
.card-legend {
  position: absolute;
  top: 30%;
  left: 20px;
  z-index: 2;
}
.py-2 {
  color: white;
}
.scene-tooltip {
  background-color:rgba(255,255,255,0.5);
}
.card-info {
  position: absolute;
  top: 52px;
  right: 28px;
  z-index: 2;
}
</style>
