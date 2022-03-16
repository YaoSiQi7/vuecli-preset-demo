export const firstTimeAuditFlow = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:activiti="http://activiti.org/bpmn" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" typeLanguage="http://www.w3.org/2001/XMLSchema" expressionLanguage="http://www.w3.org/1999/XPath" targetNamespace="http://www.activiti.org/test">
  <process id="firstlevel" name="firstlevel" isExecutable="true">
    <startEvent id="startevent1" name="开始"></startEvent>
    <exclusiveGateway id="exclusivegateway2" name="任务分配"></exclusiveGateway>
    <sequenceFlow id="flow26" name="分级审核" sourceRef="startevent1" targetRef="exclusivegateway2"></sequenceFlow>
    <endEvent id="endevent3" name="结束"></endEvent>
    <userTask id="usertask9" name="审核" activiti:assignee="first"></userTask>
    <sequenceFlow id="flow27" name="一级审核" sourceRef="exclusivegateway2" targetRef="usertask9">
      <conditionExpression xsi:type="tFormalExpression"><![CDATA[level==1]]></conditionExpression>
    </sequenceFlow>
    <sequenceFlow id="flow32" name="同意" sourceRef="usertask9" targetRef="endevent3"></sequenceFlow>
  </process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_firstlevel">
    <bpmndi:BPMNPlane bpmnElement="firstlevel" id="BPMNPlane_firstlevel">
      <bpmndi:BPMNShape bpmnElement="startevent1" id="BPMNShape_startevent1">
        <omgdc:Bounds height="35.0" width="35.0" x="91.0" y="130.0"></omgdc:Bounds>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape bpmnElement="exclusivegateway2" id="BPMNShape_exclusivegateway2">
        <omgdc:Bounds height="40.0" width="40.0" x="255.0" y="127.0"></omgdc:Bounds>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape bpmnElement="endevent3" id="BPMNShape_endevent3">
        <omgdc:Bounds height="35.0" width="35.0" x="805.0" y="130.0"></omgdc:Bounds>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape bpmnElement="usertask9" id="BPMNShape_usertask9">
        <omgdc:Bounds height="55.0" width="105.0" x="440.0" y="120.0"></omgdc:Bounds>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge bpmnElement="flow26" id="BPMNEdge_flow26">
        <omgdi:waypoint x="126.0" y="147.0"></omgdi:waypoint>
        <omgdi:waypoint x="255.0" y="147.0"></omgdi:waypoint>
        <bpmndi:BPMNLabel>
          <omgdc:Bounds height="16.0" width="64.0" x="139.0" y="120.0"></omgdc:Bounds>
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge bpmnElement="flow27" id="BPMNEdge_flow27">
        <omgdi:waypoint x="295.0" y="147.0"></omgdi:waypoint>
        <omgdi:waypoint x="440.0" y="147.0"></omgdi:waypoint>
        <bpmndi:BPMNLabel>
          <omgdc:Bounds height="16.0" width="64.0" x="313.0" y="120.0"></omgdc:Bounds>
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge bpmnElement="flow32" id="BPMNEdge_flow32">
        <omgdi:waypoint x="545.0" y="147.0"></omgdi:waypoint>
        <omgdi:waypoint x="805.0" y="147.0"></omgdi:waypoint>
        <bpmndi:BPMNLabel>
          <omgdc:Bounds height="16.0" width="32.0" x="640.0" y="120.0"></omgdc:Bounds>
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>`;
