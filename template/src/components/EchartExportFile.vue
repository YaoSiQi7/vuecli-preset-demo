<template>
  <div>
    <v-menu bottom left>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          icon
          v-bind="attrs"
          v-on="on"
          :disabled="isActive ? false : true"
          v-if="isEchart || isHoverShow"
        >
          <v-icon :class="{ 'echart-export-file-show-btns': !hover }"
            >mdi-menu</v-icon
          >
        </v-btn>
        <v-btn
          color="primary"
          :disabled="isActive ? false : true"
          v-bind="attrs"
          v-on="on"
          class="echart-export-file-btn"
          v-else
        >
          导出
          <v-icon>mdi-chevron-down</v-icon>
        </v-btn>
      </template>
      <v-list class="echart-export-file">
        <v-list-item @click="exportExcel">
          <v-list-item-title>导出Excel</v-list-item-title>
        </v-list-item>
        <v-list-item @click="exportCSV">
          <v-list-item-title>导出CSV</v-list-item-title>
        </v-list-item>
        <v-list-item @click="exportImg" v-if="isEchart">
          <v-list-item-title>导出PNG</v-list-item-title>
        </v-list-item>
        <v-list-item @click="exportPDF" v-if="isEchart">
          <v-list-item-title>导出PDF</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import moment from 'moment';
import * as dataService from 'api/addOperateLog.js';
import exportPngPdfBtns from '@/utils/exportPngPdfBtns';
const PDF = jsPDF;
export default {
  name: 'echartExportFile',
  props: {
    hover: {},
    isHoverShow: {
      type: Boolean,
      default: false
    },
    chartId: {
      type: String,
      default: ''
    },
    fileName: {
      type: String,
      default: ''
    },
    isEchart: {
      type: Boolean,
      default: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    // 导出pdf
    exportPDF () {
      let that = this;
      // 把canvas转换成图片
      html2canvas(document.getElementById(this.chartId)).then(function (canvas) {
        let contentWidth = canvas.width;
        let contentHeight = canvas.height;
        let imgWidth = 595.28;
        let imgHeight = 592.28 / contentWidth * contentHeight;
        that.createPDFObject(canvas.toDataURL('image/jpeg'), imgWidth, imgHeight);
      });
    },
    createPDFObject (imgData, imgWidth, imgHeight) {
      let doc = new PDF('p', 'pt');
      // 把图片添加到pdf
      doc.addImage(imgData, 10, 10, imgWidth, imgHeight, 'img');
      // 保存pdf
      doc.save(`${this.fileName}-${moment().format('YYYY-MM-DD')}.pdf`);
      this.addOperateLog('PDF');
    },
    // 导出图片
    exportImg () {
      const myChart = this.$echarts.init(document.getElementById(this.chartId));
      var img = new Image();
      img.src = myChart.getDataURL({
        pixelRatio: 2,
        backgroundColor: '#fff'
      });
      this.downloadFileByBase64(img.src);
    },
    dataURLtoBlob (dataurl) {
      let arr = dataurl.split(',');
      let mime = arr[0].match(/:(.*?);/)[1];
      let bstr = atob(arr[1]);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    },

    downloadFile (url) {
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${this.fileName}-${moment().format('YYYY-MM-DD')}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      this.addOperateLog('PNG');
    },

    downloadFileByBase64 (base64) {
      var myBlob = this.dataURLtoBlob(base64);
      var myUrl = URL.createObjectURL(myBlob);
      this.downloadFile(myUrl);
    },
    // 导出Excel
    exportExcel () {
      this.$emit('exportExcel', `${this.fileName}-${moment().format('YYYY-MM-DD')}.xlsx`);
    },
    // 导出CSV
    exportCSV () {
      this.$emit('exportCSV', `${this.fileName}-${moment().format('YYYY-MM-DD')}.csv`);
    },
    async addOperateLog (val) {
      for (let i = 0; i < exportPngPdfBtns.length - 1; i++) {
        if (exportPngPdfBtns[i].url === this.$route.path && exportPngPdfBtns[i].chartId === this.chartId && exportPngPdfBtns[i].type === val) {
          let params = {
            module: exportPngPdfBtns[i].moduleCode,
            function: exportPngPdfBtns[i].btnCode,
            operateMsg: '',
            status: 'success'
          };
          let res = await dataService.addOperateLog(params);
          break;
        }
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
// 导出按钮
.echart-export-file {
  .v-list-item {
    padding: 0 16px;
  }

  .v-list-item:hover {
    cursor: pointer;
    background-color: var(--v-primary-base);
  }

  .v-list-item:hover .v-list-item__title {
    color: #fff !important;
    font-size: 12px;
  }

  .v-list-item .v-list-item__title {
    font-size: 12px;
  }
}

.echart-export-file-show-btns {
  color: rgba(255, 255, 255, 0) !important;
}

.echart-export-file-btn .mdi-download::before {
  font-size: 16px;
}
</style>
