<!----------  @author: guxuerui  ----------->
<!----------  @updated_at: 2020-04-27  ----------->
<!----------  @version: 1.1  ----------->
<template>
  <div class="bpmn-viewer">
    <div class="bpmn-canvas" ref="viewerCanvas"></div>
  </div>
</template>

<script>
import BpmnViewer from 'bpmn-js/lib/Viewer';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import { firstTimeAuditFlow } from '@/assets/bpmn/firstTimeAudit.js';
import { secondTimeAuditFlow } from '@/assets/bpmn/secondTimeAudit.js';
export default {
  name: 'FlowViewer',
  props: {
    level: {
      type: Number,
      default: 1
    },
    colorIdList: {
      type: Array,
      default: () => []
    }
  },
  data: function () {
    return {
      bpmnViewer: null,
      bpmnModeler: null,
      elementRegistry: null,
      eventBus: null,
      modeling: null
    };
  },
  created () {
  },
  mounted () {
    this.init();
  },
  methods: {
    init () {
      const viewCanvas = this.$refs.viewerCanvas;
      this.bpmnViewer = new BpmnViewer({
        container: viewCanvas
      });
      this.bpmnModeler = new BpmnModeler({
        container: viewCanvas
      });
      this.viewerXML(this.xmlString);
    },
    viewerXML (xmlStr) {
      this.bpmnViewer.importXML(xmlStr, (err) => {
        var canvas = this.bpmnViewer.get('canvas');
        for (var i = this.colorIdList.length - 1; i >= 0; i--) {
          canvas.addMarker(this.colorIdList[i], 'highlight');
          if (!this.colorIdList[i].includes('usertask')) {
            if (this.colorIdList[i] + '_label' && this.colorIdList[i] !== 'flow30') {
              canvas.addMarker(this.colorIdList[i] + '_label', 'highlightText');
            }
          }
        }
        if (err) {
          console.error(err);
        }
      });
    }
  },
  computed: {
    xmlString: function () {
      if (this.level === 1) {
        return firstTimeAuditFlow;
      }
      return secondTimeAuditFlow;
    }
  }
};
</script>

<style>
  .bpmn-viewer{
    position: absolute;
    background-color: #ffffff;
    width: 100%;
    height: 100%;
  }
  .bpmn-canvas{
    width: 100%;
    height: 100%;
  }
  .bjs-powered-by{
    display: none;
  }
  .bpmn-icon-task{
    display: none;
  }
  .highlight {
    opacity: 1;
    pointer-events: none; /* no pointer events, allows clicking through onto the element */
  }
  .highlight:not(.djs-connection) .djs-visual > :nth-child(1) {
    stroke: var(--v-primary-base) !important; /* color elements as green */
    stroke-width: 1px;
  }
  .highlight .djs-visual .djs-label {
    fill: var(--v-primary-base) !important; /* color elements as green */
  }
  .highlightText .djs-visual > :nth-child(1) {
    fill: var(--v-primary-base) !important; /* color elements as green */
  }
</style>
