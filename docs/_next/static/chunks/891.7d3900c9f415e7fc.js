"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[891],{2891:function(e,a,s){s.r(a),s.d(a,{default:function(){return Z}});var l,i,t=s(3827),o=s(4090),n=s(5077),r=s(8408),d=s(4232),c=s(4194),m=s(2231);function u(e){return(0,t.jsxs)("form",{className:"form-floating",children:[(0,t.jsx)("input",{type:"text",className:"form-control",id:"measureAliasInput",value:e.textValue,onChange:e.onChange}),(0,t.jsx)("label",{htmlFor:"measureAliasInput",className:"form-label",children:"alias"})]})}var h=s(1857);function b(e){return Object.values(i).filter(a=>a===e).filter(f)[0]}(l=i||(i={})).GrandTotal="% on grand total",l.ParentOnRows="% of parent of row",l.TotalOnRows="% of row",l.ParentOnColumns="% of parent of column",l.TotalOnColumns="% of column";let p={alias:""},f=e=>!!e,x=Object.values(i).map(e=>b(e)).filter(f);function v(e){var a;let[s,l]=(0,o.useState)(p);function r(e,a){return""===s.alias&&e&&a?e.alias+" - "+b(a):s.alias}return(0,t.jsx)("div",{className:"modal fade",id:"hiercompModal",tabIndex:-1,"aria-labelledby":"hiercompModalLabel","aria-hidden":"true",children:(0,t.jsx)("div",{className:"modal-dialog",children:(0,t.jsxs)("div",{className:"modal-content",children:[(0,t.jsxs)("div",{className:"modal-header",children:[(0,t.jsx)("h1",{className:"modal-title fs-5",id:"hiercompModalLabel",children:"Hierarchical comparison"}),(0,t.jsx)("button",{type:"button",className:"btn-close","data-bs-dismiss":"modal","aria-label":"Close"})]}),(0,t.jsxs)("div",{className:"modal-body",children:[(0,t.jsx)("div",{className:"pb-1",children:(0,t.jsx)(m.Z,{label:"measure",value:null===(a=s.underlyingMeasure)||void 0===a?void 0:a.alias,fields:e.measures,onChange:a=>{let i=e.measures.map(e=>(0,n.$$)(e)).indexOf(a.target.value),t=e.measures[i];l(e=>({...s,underlyingMeasure:t,alias:r(t,e.type)}))}})}),(0,t.jsx)("div",{className:"pb-1",children:(0,t.jsx)(m.Z,{label:"type",value:b(s.type),fields:x,onChange:e=>{let a=x.indexOf(e.target.value),t=Object.values(i)[a];l(e=>({...s,type:t,alias:r(e.underlyingMeasure,t)}))}})}),(0,t.jsx)("div",{className:"pb-1",children:(0,t.jsx)(u,{textValue:s.alias,onChange:e=>{l({...s,alias:e.target.value})}})})]}),(0,t.jsxs)("div",{className:"modal-footer",children:[(0,t.jsx)("button",{type:"button",className:"btn btn-secondary","data-bs-dismiss":"modal",children:"Close"}),(0,t.jsx)("button",{type:"button",className:"btn btn-primary","data-bs-dismiss":"modal",disabled:!(void 0!==s.underlyingMeasure&&void 0!==s.type&&""!==s.alias),onClick:function(){if(s.underlyingMeasure){let a;switch(s.type){case"% on grand total":a=(0,c.multiply)(s.alias,(0,c.comparisonMeasureWithGrandTotal)("__"+s.alias+"__",c.ComparisonMethod.DIVIDE,s.underlyingMeasure),(0,c.integer)(100));break;case"% of parent of row":a=new c.PartialHierarchicalComparisonMeasure(s.alias,c.ComparisonMethod.DIVIDE,s.underlyingMeasure,c.Axis.ROW,!1);break;case"% of row":a=new c.PartialHierarchicalComparisonMeasure(s.alias,c.ComparisonMethod.DIVIDE,s.underlyingMeasure,c.Axis.ROW,!0);break;case"% of parent of column":a=new c.PartialHierarchicalComparisonMeasure(s.alias,c.ComparisonMethod.DIVIDE,s.underlyingMeasure,c.Axis.COLUMN,!1);break;case"% of column":a=new c.PartialHierarchicalComparisonMeasure(s.alias,c.ComparisonMethod.DIVIDE,s.underlyingMeasure,c.Axis.COLUMN,!0)}a&&(e.onNewMeasure(a,h.yE),l(p))}},children:"Create"})]})]})})})}let j={alias:"",referencePosition:new Map},g=["Year","Month"];function N(e){var a;let[s,l]=(0,o.useState)(j);return(0,t.jsx)("div",{className:"modal fade",id:"timeperiodcompModal",tabIndex:-1,"aria-labelledby":"timeperiodcompModalLabel","aria-hidden":"true",children:(0,t.jsx)("div",{className:"modal-dialog",children:(0,t.jsxs)("div",{className:"modal-content",children:[(0,t.jsxs)("div",{className:"modal-header",children:[(0,t.jsx)("h1",{className:"modal-title fs-5",id:"timeperiodcompModalLabel",children:"Time period comparison"}),(0,t.jsx)("button",{type:"button",className:"btn-close","data-bs-dismiss":"modal","aria-label":"Close"})]}),(0,t.jsxs)("div",{className:"modal-body",children:[(0,t.jsx)("div",{className:"pb-1",children:(0,t.jsx)(m.Z,{label:"measure",value:null===(a=s.underlyingMeasure)||void 0===a?void 0:a.alias,fields:e.measures,onChange:a=>{let i=e.measures.map(e=>(0,n.$$)(e)).indexOf(a.target.value);l({...s,underlyingMeasure:e.measures[i]})}})}),(0,t.jsx)("div",{className:"pb-1",children:(0,t.jsx)(m.Z,{label:"period",value:s.period,fields:g,onChange:e=>{("Year"===e.target.value||"Month"===e.target.value)&&l({...s,period:e.target.value})}})}),(0,t.jsx)("div",{className:"pb-1",children:s.period&&function(e,a,s,l,i,o){switch(e){case"Year":return(0,t.jsx)(m.Z,{label:"year",value:a&&(0,n.$$)(a),fields:l,onChange:i});case"Month":return(0,t.jsxs)("div",{children:[(0,t.jsx)("div",{className:"pb-1",children:(0,t.jsx)(m.Z,{label:"year",value:a&&(0,n.$$)(a),fields:l,onChange:i})}),(0,t.jsx)("div",{children:(0,t.jsx)(m.Z,{label:"month",value:s&&(0,n.$$)(s),fields:l,onChange:o})})]});default:return}}(s.period,s.year,s.month,e.fields,a=>{let i=e.fields.map(e=>(0,n.$$)(e)).indexOf(a.target.value);l({...s,year:e.fields[i]})},a=>{let i=e.fields.map(e=>(0,n.$$)(e)).indexOf(a.target.value);l({...s,month:e.fields[i]})})}),(0,t.jsx)("div",{className:"pb-1",children:s.period&&(0,t.jsx)(m.Z,{label:"comparison method",value:s.comparisonMethod,fields:Object.keys(c.ComparisonMethod),onChange:e=>{let a=Object.keys(c.ComparisonMethod).map(e=>(0,n.$$)(e)).indexOf(e.target.value);l({...s,comparisonMethod:Object.values(c.ComparisonMethod)[a]})}})}),(0,t.jsxs)("div",{className:"pb-1",children:["Year"===s.period&&(0,t.jsx)(m.Z,{label:"compare with",value:s.referencePositionLabel,fields:["previous year"],onChange:e=>{s.year&&"previous year"===e.target.value&&l({...s,referencePosition:new Map([[s.year,"y-1"]]),referencePositionLabel:e.target.value})}}),"Month"===s.period&&(0,t.jsx)(m.Z,{label:"compare with",value:s.referencePositionLabel,fields:["previous year, same month","same year, previous month"],onChange:e=>{s.year&&s.month&&("previous year, same month"===e.target.value?l({...s,referencePosition:new Map([[s.year,"y-1"],[s.month,"m"]]),referencePositionLabel:e.target.value}):"same year, previous month"===e.target.value&&l({...s,referencePosition:new Map([[s.year,"y"],[s.month,"m-1"]]),referencePositionLabel:e.target.value}))}})]}),(0,t.jsx)("div",{className:"pb-1",children:s.period&&(0,t.jsx)(u,{textValue:s.alias,onChange:e=>{l({...s,alias:e.target.value})}})})]}),(0,t.jsxs)("div",{className:"modal-footer",children:[(0,t.jsx)("button",{type:"button",className:"btn btn-secondary","data-bs-dismiss":"modal",children:"Close"}),(0,t.jsx)("button",{type:"button",className:"btn btn-primary","data-bs-dismiss":"modal",disabled:!function(){let e=!1;switch(s.period){case"Year":e=void 0!==s.year;break;case"Month":e=void 0!==s.year&&void 0!==s.month}return void 0!==s.underlyingMeasure&&void 0!==s.period&&e&&""!==s.alias&&void 0!==s.comparisonMethod&&s.referencePosition.size>0}(),onClick:function(){let a;switch(s.period){case"Year":let i=e=>{if(s.year&&s.underlyingMeasure&&s.comparisonMethod&&s.referencePosition.size>0)return(0,c.comparisonMeasureWithPeriod)(e,s.comparisonMethod,s.underlyingMeasure,s.referencePosition,new c.Year(s.year))};if(s.comparisonMethod===c.ComparisonMethod.RELATIVE_DIFFERENCE){let e=i("__"+s.alias+"__");a=e&&(0,c.multiply)(s.alias,(0,c.integer)(100),e)}else a=i(s.alias);break;case"Month":s.year&&s.month&&s.underlyingMeasure&&s.comparisonMethod&&s.referencePosition.size>0&&(a=(0,c.comparisonMeasureWithPeriod)(s.alias,s.comparisonMethod,s.underlyingMeasure,s.referencePosition,new c.Month(s.month,s.year)))}a&&(e.onNewMeasure(a),l(j))},children:"Create"})]})]})})})}let y={alias:""};function M(e){var a,s;let[l,i]=(0,o.useState)(y);return(0,t.jsx)("div",{className:"modal fade",id:"calcmeasModal",tabIndex:-1,"aria-labelledby":"calcmeasModalLabel","aria-hidden":"true",children:(0,t.jsx)("div",{className:"modal-dialog",children:(0,t.jsxs)("div",{className:"modal-content",children:[(0,t.jsxs)("div",{className:"modal-header",children:[(0,t.jsx)("h1",{className:"modal-title fs-5",id:"calcmeasModalLabel",children:"Calculated measure"}),(0,t.jsx)("button",{type:"button",className:"btn-close","data-bs-dismiss":"modal","aria-label":"Close"})]}),(0,t.jsxs)("div",{className:"modal-body",children:[(0,t.jsx)("div",{className:"pb-1",children:(0,t.jsx)(m.Z,{label:"left operand",value:null===(a=l.leftOperand)||void 0===a?void 0:a.alias,fields:e.measures,onChange:a=>{let s=e.measures.map(e=>(0,n.$$)(e)).indexOf(a.target.value),l=e.measures[s];i(e=>({...e,leftOperand:l}))}})}),(0,t.jsx)("div",{className:"pb-1",children:(0,t.jsx)(m.Z,{label:"type",value:l.operator,fields:Object.keys(c.BinaryOperator),onChange:e=>{let a=Object.keys(c.BinaryOperator).map(e=>(0,n.$$)(e)).indexOf(e.target.value),s=Object.values(c.BinaryOperator)[a];i(e=>({...e,operator:s}))}})}),(0,t.jsx)("div",{className:"pb-1",children:(0,t.jsx)(m.Z,{label:"right operand",value:null===(s=l.rightOperand)||void 0===s?void 0:s.alias,fields:e.measures,onChange:a=>{let s=e.measures.map(e=>(0,n.$$)(e)).indexOf(a.target.value),l=e.measures[s];i(e=>({...e,rightOperand:l}))}})}),(0,t.jsx)("div",{className:"pb-1",children:(0,t.jsx)(u,{textValue:l.alias,onChange:e=>{i(a=>({...a,alias:e.target.value}))}})})]}),(0,t.jsxs)("div",{className:"modal-footer",children:[(0,t.jsx)("button",{type:"button",className:"btn btn-secondary","data-bs-dismiss":"modal",children:"Close"}),(0,t.jsx)("button",{type:"button",className:"btn btn-primary","data-bs-dismiss":"modal",disabled:!(void 0!==l.leftOperand&&void 0!==l.rightOperand&&void 0!==l.operator&&""!==l.alias),onClick:function(){if(void 0!==l.leftOperand&&void 0!==l.rightOperand&&void 0!==l.operator&&""!==l.alias){let a=new c.BinaryOperationMeasure(l.alias,l.operator,l.leftOperand,l.rightOperand);e.onNewMeasure(a),i(y)}},children:"Create"})]})]})})})}function C(e){var a,s;let[l,i]=(0,o.useState)({});return(0,t.jsx)("div",{className:"modal fade",id:"formatmeasModal",tabIndex:-1,"aria-labelledby":"formatmeasModalLabel","aria-hidden":"true",children:(0,t.jsx)("div",{className:"modal-dialog",children:(0,t.jsxs)("div",{className:"modal-content",children:[(0,t.jsxs)("div",{className:"modal-header",children:[(0,t.jsx)("h1",{className:"modal-title fs-5",id:"formatmeasModalLabel",children:"Format measure"}),(0,t.jsx)("button",{type:"button",className:"btn-close","data-bs-dismiss":"modal","aria-label":"Close"})]}),(0,t.jsxs)("div",{className:"modal-body",children:[(0,t.jsx)("div",{className:"pb-1",children:(0,t.jsx)(m.Z,{label:"measure",value:null===(a=l.measure)||void 0===a?void 0:a.alias,fields:e.measures,onChange:a=>{let s=e.measures.map(e=>(0,n.$$)(e)).indexOf(a.target.value),l=e.measures[s];i(e=>({...e,measure:l}))}})}),(0,t.jsx)("div",{className:"pb-1",children:(0,t.jsx)(m.Z,{label:"formatter",value:null===(s=l.formatter)||void 0===s?void 0:s.label,fields:h.$0.map(e=>e.label),onChange:e=>{let a=h.$0.map(e=>e.label).indexOf(e.target.value),s=h.$0[a];i(e=>({...e,formatter:s}))}})})]}),(0,t.jsxs)("div",{className:"modal-footer",children:[(0,t.jsx)("button",{type:"button",className:"btn btn-secondary","data-bs-dismiss":"modal",children:"Close"}),(0,t.jsx)("button",{type:"button",className:"btn btn-primary","data-bs-dismiss":"modal",disabled:!(void 0!==l.measure&&void 0!==l.formatter),onClick:function(){void 0!==l.measure&&void 0!==l.formatter&&(e.onNewMeasureFormatter(l.measure,l.formatter),i({}))},children:"Apply"})]})]})})})}var w=s(8899);let O={alias:"",referencePosition:new Map};function k(e){var a;let[s,l]=(0,o.useState)(O);return(0,t.jsx)("div",{className:"modal fade",id:"columncompModal",tabIndex:-1,"aria-labelledby":"columncompModalLabel","aria-hidden":"true",children:(0,t.jsx)("div",{className:"modal-dialog",children:(0,t.jsxs)("div",{className:"modal-content",children:[(0,t.jsxs)("div",{className:"modal-header",children:[(0,t.jsx)("h1",{className:"modal-title fs-5",id:"columncompModalLabel",children:"Dimension comparison"}),(0,t.jsx)("button",{type:"button",className:"btn-close","data-bs-dismiss":"modal","aria-label":"Close"})]}),(0,t.jsxs)("div",{className:"modal-body",children:[(0,t.jsx)("div",{className:"pb-1",children:(0,t.jsx)(m.Z,{label:"measure",value:null===(a=s.underlyingMeasure)||void 0===a?void 0:a.alias,fields:e.measures,onChange:a=>{let i=e.measures.map(e=>(0,n.$$)(e)).indexOf(a.target.value);l({...s,underlyingMeasure:e.measures[i]})}})}),(0,t.jsx)("div",{className:"pb-1",children:(0,t.jsx)(m.Z,{label:"dimension",value:s.column&&(0,n.$$)(s.column),fields:e.fields,onChange:a=>{let i=e.fields.map(e=>(0,n.$$)(e)).indexOf(a.target.value);l({...s,column:e.fields[i]})}})}),(0,t.jsx)("div",{className:"pb-1",children:s.column&&(0,t.jsx)(m.Z,{label:"comparison method",value:s.comparisonMethod,fields:Object.keys(c.ComparisonMethod),onChange:e=>{let a=Object.keys(c.ComparisonMethod).map(e=>(0,n.$$)(e)).indexOf(e.target.value);l({...s,comparisonMethod:Object.values(c.ComparisonMethod)[a]})}})}),(0,t.jsx)("div",{className:"pb-1",children:s.comparisonMethod&&(0,t.jsx)(m.Z,{label:"compare with",value:s.referencePositionLabel,fields:["previous","first"],onChange:e=>{if(s.column){let a;let i=e.target.value;if("previous"===i)a="s-1";else if("first"===i)a="first";else throw Error("unexpected value ".concat(i));l({...s,referencePosition:new Map([[s.column,a]]),referencePositionLabel:i})}}})}),(0,t.jsx)("div",{className:"pb-1",children:s.referencePositionLabel&&(0,t.jsx)(u,{textValue:s.alias,onChange:e=>{l({...s,alias:e.target.value})}})})]}),(0,t.jsxs)("div",{className:"modal-footer",children:[(0,t.jsx)("button",{type:"button",className:"btn btn-secondary","data-bs-dismiss":"modal",children:"Close"}),(0,t.jsx)("button",{type:"button",className:"btn btn-primary","data-bs-dismiss":"modal",disabled:!(void 0!==s.underlyingMeasure&&void 0!==s.column&&""!==s.alias&&void 0!==s.comparisonMethod&&s.referencePosition.size>0),onClick:function(){void 0!==s.underlyingMeasure&&void 0!==s.column&&""!==s.alias&&void 0!==s.comparisonMethod&&s.referencePosition.size>0&&(e.onNewMeasure((0,c.comparisonMeasureWithinSameGroup)(s.alias,s.comparisonMethod,s.underlyingMeasure,s.referencePosition)),l(O))},children:"Create"})]})]})})})}let $=["sum","min","max","avg","count","distinct count"],P={alias:""};function E(e){let[a,s]=(0,o.useState)(P);function l(e,s){return""===a.alias&&e&&s?(0,n.$$)(e)+"_"+s:a.alias}return(0,t.jsx)("div",{className:"modal fade",id:"basicmeasModal",tabIndex:-1,"aria-labelledby":"basicmeasModalLabel","aria-hidden":"true",children:(0,t.jsx)("div",{className:"modal-dialog",children:(0,t.jsxs)("div",{className:"modal-content",children:[(0,t.jsxs)("div",{className:"modal-header",children:[(0,t.jsx)("h1",{className:"modal-title fs-5",id:"basicmeasModalLabel",children:"Basic measure"}),(0,t.jsx)("button",{type:"button",className:"btn-close","data-bs-dismiss":"modal","aria-label":"Close"})]}),(0,t.jsxs)("div",{className:"modal-body",children:[(0,t.jsx)("div",{className:"pb-1",children:(0,t.jsx)(m.Z,{label:"dimension",value:a.column&&(0,n.$$)(a.column),fields:e.fields,onChange:a=>{let i=e.fields.map(e=>(0,n.$$)(e)).indexOf(a.target.value);s(a=>({...a,column:e.fields[i],alias:l(e.fields[i],a.aggregationFunction)}))}})}),(0,t.jsx)("div",{className:"pb-1",children:(0,t.jsx)(m.Z,{label:"aggregation function",value:a.aggregationFunction,fields:$,onChange:e=>{let a=$.map(e=>e.toString()).indexOf(e.target.value),i=$[a];s(e=>({...e,alias:l(e.column,i),aggregationFunction:i}))}})}),(0,t.jsx)("div",{className:"pb-1",children:(0,t.jsx)(u,{textValue:a.alias,onChange:e=>{s(a=>({...a,alias:e.target.value}))}})})]}),(0,t.jsxs)("div",{className:"modal-footer",children:[(0,t.jsx)("button",{type:"button",className:"btn btn-secondary","data-bs-dismiss":"modal",children:"Close"}),(0,t.jsx)("button",{type:"button",className:"btn btn-primary","data-bs-dismiss":"modal",disabled:!(void 0!==a.column&&void 0!==a.aggregationFunction&&""!==a.alias),onClick:function(){if(void 0!==a.column&&void 0!==a.aggregationFunction&&""!==a.alias){let l="distinct count"===a.aggregationFunction,i=l?"count":a.aggregationFunction,t=new c.AggregatedMeasure(a.alias,a.column,i,l);e.onNewMeasure(t),s(P)}},children:"Create"})]})]})})})}let L=(0,d.default)(()=>Promise.all([s.e(470),s.e(835),s.e(726),s.e(696)]).then(s.bind(s,5696)),{loadableGenerated:{webpack:()=>[5696]},ssr:!1}),V=(0,d.default)(()=>Promise.all([s.e(415),s.e(899)]).then(s.bind(s,6899)),{loadableGenerated:{webpack:()=>[6899]},ssr:!1});function Z(e){var a,s;let l=null!==(s=e.storageKey)&&void 0!==s?s:"state#".concat(e.title.toLowerCase()),i=e.queryProvider,[d,c]=(0,o.useState)(),[m,u]=(0,o.useState)(!0),[h,b]=(0,o.useState)("tree"),{state:p,setState:f,undo:x,redo:j,canUndo:g,canRedo:y}=(0,w.C5)((0,w.fZ)(l,i.selectableFields.map(w.j3),i.selectableFields.map(w.j3),i.measures.map(w.Ge),i.formatters),8);function O(){return $(p.rows,p.columns,p.values,p.filtersValues,m)}function $(e,a,s,l,t){return r.c_.executePivotQuery(i,e,a,s.map(e=>e.type),l,t).then(e=>c(e))}function P(e,a){let s=new Map(p.filtersValues);s.set(e,a),f(e=>({...e,filtersValues:s})),$(p.rows,p.columns,p.values,s,m)}function Z(e,a){let s=p.values.slice();s.push((0,w.Ge)(e));let l=p.formatters;a&&(l=l.slice()).push(new w.c9(e.alias,a)),f(e=>({...e,values:s,formatters:l}))}return(0,o.useEffect)(()=>{O().then(()=>(0,w.Qz)(l,p))},[p]),(0,t.jsxs)("div",{className:"container-fluid",children:[(0,t.jsxs)("div",{className:"row row-cols-auto",children:[(0,t.jsx)("div",{className:"col px-0 mx-1 my-1",children:(0,t.jsx)("button",{className:"btn btn-sm btn-secondary",type:"button","data-bs-toggle":"offcanvas","data-bs-target":"#offcanvasRight","aria-controls":"offcanvasRight",children:(0,t.jsx)("i",{className:"bi bi-pencil-square"})})}),(0,t.jsx)("div",{className:"col px-0 mx-1 my-1",children:(0,t.jsxs)("div",{className:"dropdown",children:[(0,t.jsx)("button",{className:"btn btn-light btn-sm dropdown-toggle",type:"button","data-bs-toggle":"dropdown","aria-expanded":"false",children:"Edit"}),(0,t.jsxs)("ul",{className:"dropdown-menu",children:[(0,t.jsx)("li",{children:(0,t.jsx)("a",{className:"dropdown-item ".concat(g?"":"disabled"),href:"#",onClick:x,children:"Undo"})}),(0,t.jsx)("li",{children:(0,t.jsx)("a",{className:"dropdown-item ".concat(y?"":"disabled"),href:"#",onClick:j,children:"Redo"})}),(0,t.jsx)("li",{children:(0,t.jsx)("a",{className:"dropdown-item",href:"#",onClick:()=>(0,w.np)(l),children:"Clear state"})}),(0,t.jsx)("li",{children:(0,t.jsx)("hr",{className:"dropdown-divider"})}),(0,t.jsx)("li",{children:(0,t.jsx)("a",{className:"dropdown-item",href:"#",onClick:O,children:"Re-execute"})})]})]})}),(0,t.jsx)("div",{className:"col px-0 mx-1 my-1",children:(0,t.jsxs)("div",{className:"dropdown",children:[(0,t.jsx)("button",{className:"btn btn-light btn-sm dropdown-toggle",type:"button","data-bs-toggle":"dropdown","aria-expanded":"false",children:"Data"}),(0,t.jsxs)("ul",{className:"dropdown-menu",children:[(0,t.jsx)("li",{children:(0,t.jsx)("a",{className:"dropdown-item",href:"#","data-bs-toggle":"modal","data-bs-target":"#formatmeasModal",children:"Format"})}),(0,t.jsx)("li",{children:(0,t.jsx)("hr",{className:"dropdown-divider"})}),(0,t.jsx)("li",{children:(0,t.jsx)("a",{className:"dropdown-item",href:"#","data-bs-toggle":"modal","data-bs-target":"#basicmeasModal",children:"Basic measure"})}),(0,t.jsx)("li",{children:(0,t.jsx)("a",{className:"dropdown-item",href:"#","data-bs-toggle":"modal","data-bs-target":"#calcmeasModal",children:"Calculated measure"})}),(0,t.jsx)("li",{children:(0,t.jsx)("a",{className:"dropdown-item",href:"#","data-bs-toggle":"modal","data-bs-target":"#timeperiodcompModal",children:"Time period comparison"})}),(0,t.jsx)("li",{children:(0,t.jsx)("a",{className:"dropdown-item",href:"#","data-bs-toggle":"modal","data-bs-target":"#hiercompModal",children:"Hierarchical comparison"})}),(0,t.jsx)("li",{children:(0,t.jsx)("a",{className:"dropdown-item",href:"#","data-bs-toggle":"modal","data-bs-target":"#columncompModal",children:"Dimension comparison"})})]})]})}),e.menuElements]}),(0,t.jsxs)("div",{className:"offcanvas offcanvas-end","data-bs-scroll":"true","data-bs-backdrop":"false",tabIndex:-1,id:"offcanvasRight","aria-labelledby":"offcanvasRightLabel",children:[(0,t.jsxs)("div",{className:"offcanvas-header pb-1",children:[(0,t.jsx)("h5",{className:"my-0",id:"offcanvasRightLabel",children:"Pivot Table Editor"}),(0,t.jsx)("button",{type:"button",className:"btn-close text-reset","data-bs-dismiss":"offcanvas","aria-label":"Close"})]}),(0,t.jsxs)("div",{className:"offcanvas-body",children:[(0,t.jsx)(n.ZP,{axisType:n.we.ROWS,selectedElements:p.rows,selectableElements:p.selectableElements,elementsDispatcher:(e,a)=>f(s=>({...s,rows:e,selectableElements:a})),showTotalsCheckBox:!0}),(0,t.jsx)("hr",{}),(0,t.jsx)(n.ZP,{axisType:n.we.COLUMNS,selectedElements:p.columns,selectableElements:p.selectableElements,elementsDispatcher:(e,a)=>f(s=>({...s,columns:e,selectableElements:a})),showTotalsCheckBox:!0}),(0,t.jsx)("hr",{}),(0,t.jsx)(n.ZP,{axisType:n.we.VALUES,selectedElements:p.values,selectableElements:p.selectableValues,elementsDispatcher:(e,a)=>f(s=>({...s,values:e,selectableValues:a})),showTotalsCheckBox:!1}),(0,t.jsx)("hr",{}),(0,t.jsx)(n.ZP,{axisType:n.we.FILTERS,selectedElements:p.filters,selectableElements:p.selectableFilters,elementsDispatcher:(e,a)=>f(s=>{let l=new Map(p.filtersValues);for(let[a,s]of l)if(0>e.map(e=>e.type).indexOf(a)&&l.delete(a))break;return{...s,filters:e,selectableFilters:a,filtersValues:l}}),showTotalsCheckBox:!1}),null===(a=p.filters)||void 0===a?void 0:a.map((e,a)=>{let s=e.type,l=p.filtersValues.get(s);return(0,t.jsx)(V,{table:i.table[0],field:s,filters:p.filtersValues,preSelectedValues:null!=l?l:[],onFilterChange:P},a)})]})]}),(0,t.jsxs)("div",{className:"row row-cols-auto",children:[(0,t.jsxs)("div",{className:"col px-1",children:[(0,t.jsx)("input",{className:"form-check-input",type:"checkbox",value:"",id:"flexCheckChecked",checked:m,onChange:function(){u(!m),$(p.rows,p.columns,p.values,p.filtersValues,!m)}}),(0,t.jsx)("label",{className:"form-check-label px-1",htmlFor:"flexCheckChecked",children:"Minify"})]}),(0,t.jsxs)("div",{className:"col px-0",children:[(0,t.jsxs)("div",{className:"form-check form-check-inline mx-1",children:[(0,t.jsx)("input",{className:"form-check-input",type:"radio",name:"inlineRadioOptions",id:"treeRadio",value:"tree",checked:"tree"===h,onChange:()=>b("tree")}),(0,t.jsx)("label",{className:"form-check-label",htmlFor:"treeRadio",children:"tree"})]}),(0,t.jsxs)("div",{className:"form-check form-check-inline mx-1",children:[(0,t.jsx)("input",{className:"form-check-input",type:"radio",name:"inlineRadioOptions",id:"gridRadio",value:"grid",checked:"grid"===h,onChange:()=>b("grid")}),(0,t.jsx)("label",{className:"form-check-label",htmlFor:"gridRadio",children:"grid"})]})]}),(0,t.jsx)(C,{measures:p.selectableValues.concat(p.values).map(e=>e.type).sort((e,a)=>e.alias.localeCompare(a.alias)),onNewMeasureFormatter:function(e,a){let s=p.formatters?p.formatters.slice():[],l=(0,n.$$)(e),i=s.map(e=>e.field).indexOf(l);i>=0&&s.splice(i,1),s.push(new w.c9(l,a)),f(e=>({...e,formatters:s}))}}),(0,t.jsx)(E,{fields:i.selectableFields,onNewMeasure:Z}),(0,t.jsx)(M,{measures:p.selectableValues.concat(p.values).map(e=>e.type).sort((e,a)=>e.alias.localeCompare(a.alias)),onNewMeasure:Z}),(0,t.jsx)(N,{measures:p.selectableValues.concat(p.values).map(e=>e.type).sort((e,a)=>e.alias.localeCompare(a.alias)),fields:i.selectableFields,onNewMeasure:Z}),(0,t.jsx)(v,{measures:p.selectableValues.concat(p.values).map(e=>e.type).sort((e,a)=>e.alias.localeCompare(a.alias)),onNewMeasure:Z}),(0,t.jsx)(k,{fields:i.selectableFields,measures:p.selectableValues.concat(p.values).map(e=>e.type).sort((e,a)=>e.alias.localeCompare(a.alias)),onNewMeasure:Z}),e.elements]}),(0,t.jsx)("div",{className:"row pt-2",children:void 0!==d?(0,t.jsx)(L,{result:d,hierarchyType:h,formatters:p.formatters}):void 0})]})}}}]);