export const secondTimeAuditFlow = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:activiti="http://activiti.org/bpmn" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" typeLanguage="http://www.w3.org/2001/XMLSchema" expressionLanguage="http://www.w3.org/1999/XPath" targetNamespace="http://www.activiti.org/test">
  <process id="secondlevel" name="secondlevel" isExecutable="true">
    <startEvent id="startevent1" name="开始"></startEvent>
    <exclusiveGateway id="exclusivegateway2" name="任务分配"></exclusiveGateway>
    <sequenceFlow id="flow26" name="分级审核" sourceRef="startevent1" targetRef="exclusivegateway2"></sequenceFlow>
    <endEvent id="endevent3" name="结束"></endEvent>
    <userTask id="usertask7" name="复审" activiti:assignee="second"></userTask>
    <userTask id="usertask8" name="审核" activiti:assignee="first"></userTask>
    <sequenceFlow id="flow28" name="二级审核" sourceRef="exclusivegateway2" targetRef="usertask8">
      <conditionExpression xsi:type="tFormalExpression"><![CDATA[level ==2]]></conditionExpression>
    </sequenceFlow>
    <sequenceFlow id="flow29" name="同意" sourceRef="usertask8" targetRef="usertask7">
      <conditionExpression xsi:type="tFormalExpression"><![CDATA[approval1==true]]></conditionExpression>
    </sequenceFlow>
    <exclusiveGateway id="exclusivegateway3" name="复审意见"></exclusiveGateway>
    <sequenceFlow id="flow30" sourceRef="usertask7" targetRef="exclusivegateway3"></sequenceFlow>
    <sequenceFlow id="flow31" name="同意" sourceRef="exclusivegateway3" targetRef="endevent3">
      <conditionExpression xsi:type="tFormalExpression"><![CDATA[approval2==true]]></conditionExpression>
    </sequenceFlow>
    <sequenceFlow id="flow33" name="驳回" sourceRef="exclusivegateway3" targetRef="usertask8">
      <conditionExpression xsi:type="tFormalExpression"><![CDATA[approval2==false]]></conditionExpression>
    </sequenceFlow>
  </process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_secondlevel">
    <bpmndi:BPMNPlane bpmnElement="secondlevel" id="BPMNPlane_secondlevel">
      <bpmndi:BPMNShape bpmnElement="startevent1" id="BPMNShape_startevent1">
        <omgdc:Bounds height="35.0" width="35.0" x="93.0" y="121.0"></omgdc:Bounds>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape bpmnElement="exclusivegateway2" id="BPMNShape_exclusivegateway2">
        <omgdc:Bounds height="40.0" width="40.0" x="257.0" y="118.0"></omgdc:Bounds>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape bpmnElement="endevent3" id="BPMNShape_endevent3">
        <omgdc:Bounds height="35.0" width="35.0" x="970.0" y="256.0"></omgdc:Bounds>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape bpmnElement="usertask7" id="BPMNShape_usertask7">
        <omgdc:Bounds height="55.0" width="105.0" x="493.0" y="246.0"></omgdc:Bounds>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape bpmnElement="usertask8" id="BPMNShape_usertask8">
        <omgdc:Bounds height="55.0" width="105.0" x="225.0" y="246.0"></omgdc:Bounds>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape bpmnElement="exclusivegateway3" id="BPMNShape_exclusivegateway3">
        <omgdc:Bounds height="40.0" width="40.0" x="804.0" y="253.0"></omgdc:Bounds>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge bpmnElement="flow26" id="BPMNEdge_flow26">
        <omgdi:waypoint x="128.0" y="138.0"></omgdi:waypoint>
        <omgdi:waypoint x="257.0" y="138.0"></omgdi:waypoint>
        <bpmndi:BPMNLabel>
          <omgdc:Bounds height="16.0" width="64.0" x="139.0" y="118.0"></omgdc:Bounds>
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge bpmnElement="flow28" id="BPMNEdge_flow28">
        <omgdi:waypoint x="277.0" y="158.0"></omgdi:waypoint>
        <omgdi:waypoint x="277.0" y="246.0"></omgdi:waypoint>
        <bpmndi:BPMNLabel>
          <omgdc:Bounds height="16.0" width="64.0" x="283.0" y="197.0"></omgdc:Bounds>
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge bpmnElement="flow29" id="BPMNEdge_flow29">
        <omgdi:waypoint x="330.0" y="273.0"></omgdi:waypoint>
        <omgdi:waypoint x="493.0" y="273.0"></omgdi:waypoint>
        <bpmndi:BPMNLabel>
          <omgdc:Bounds height="16.0" width="32.0" x="379.0" y="253.0"></omgdc:Bounds>
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge bpmnElement="flow30" id="BPMNEdge_flow30">
        <omgdi:waypoint x="598.0" y="273.0"></omgdi:waypoint>
        <omgdi:waypoint x="804.0" y="273.0"></omgdi:waypoint>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge bpmnElement="flow31" id="BPMNEdge_flow31">
        <omgdi:waypoint x="844.0" y="273.0"></omgdi:waypoint>
        <omgdi:waypoint x="970.0" y="273.0"></omgdi:waypoint>
        <bpmndi:BPMNLabel>
          <omgdc:Bounds height="16.0" width="32.0" x="879.0" y="253.0"></omgdc:Bounds>
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge bpmnElement="flow33" id="BPMNEdge_flow33">
        <omgdi:waypoint x="824.0" y="293.0"></omgdi:waypoint>
        <omgdi:waypoint x="823.0" y="370.0"></omgdi:waypoint>
        <omgdi:waypoint x="277.0" y="370.0"></omgdi:waypoint>
        <omgdi:waypoint x="277.0" y="370.0"></omgdi:waypoint>
        <omgdi:waypoint x="277.0" y="301.0"></omgdi:waypoint>
        <bpmndi:BPMNLabel>
          <omgdc:Bounds height="16.0" width="32.0" x="471.0" y="349.0"></omgdc:Bounds>
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>`;
