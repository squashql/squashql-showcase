"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[192,231],{2231:function(e,t,n){n.d(t,{Z:function(){return a}});var r=n(3827),l=n(5077);function a(e){return(0,r.jsxs)("div",{className:"form-floating",children:[(0,r.jsxs)("select",{className:"form-select",id:"floatingSelect","aria-label":"Floating label select example",onChange:e.onChange,value:void 0===e.value?"DEFAULT":e.value,children:[(0,r.jsxs)("option",{value:"DEFAULT",children:["Select ",e.label]},-1),e.fields.map((e,t)=>(0,r.jsx)("option",{value:(0,l.$$)(e),children:(0,l.$$)(e)},t))]}),(0,r.jsx)("label",{htmlFor:"floatingSelect",children:e.label})]})}n(4090)},8899:function(e,t,n){n.d(t,{C5:function(){return w},Ge:function(){return u},Qz:function(){return f},c9:function(){return s},fZ:function(){return c},iG:function(){return h},j3:function(){return i},np:function(){return m}});var r=n(4194),l=n(5077),a=n(4090),o=n(1857);function i(e){return{type:e,showTotals:!0}}function u(e){return{type:e,showTotals:!0}}class s{toJSON(){return{"@class":"PivotTableCellFormatter",field:this.field,label:this.formatter.label}}constructor(e,t){this.field=e,this.formatter=t}}function c(e,t,n,r,a){{let t=window.localStorage.getItem(e);if(t){let e=y(t),n=new Map,r=e.filters.map(l.$$);return e.filtersValues.forEach((t,a)=>{let o=r.indexOf((0,l.$$)(a));o>=0&&n.set(e.filters[o].type,t)}),e.filtersValues=n,e}}return{columns:[],filters:[],filtersValues:new Map,rows:[],selectableElements:t,selectableFilters:n,selectableValues:r,values:[],formatters:a}}function f(e,t){window.localStorage.setItem(e,JSON.stringify(t,b))}function m(e){window.localStorage.removeItem(e)}function d(e,t){if("filtersValues"===e){let e=new Map;return Object.entries(t).forEach(t=>{let[n,l]=t;return e.set((0,r.squashQLReviver)(n,JSON.parse(n)),l)}),e}if("object"==typeof t&&"PivotTableCellFormatter"===t["@class"]){let e=t.label,n=o.$0.find(t=>t.label===e);return n?new s(t.field,n):void 0}return t}function b(e,t){return"filtersValues"===e?Object.fromEntries(function(e){let t=new Map;for(let[n,r]of e)t.set(JSON.stringify(n),r);return t}(t)):t}function h(e){return y(e)}function y(e){return JSON.parse(e,(e,t)=>(0,r.squashQLReviver)(e,t,d))}function w(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:8,[n,r]=(0,a.useState)({states:[e],currentIndex:0}),l=(0,a.useCallback)(()=>{r({...n,currentIndex:Math.max(n.currentIndex-1,0)})},[n]),o=(0,a.useCallback)(()=>{r({...n,currentIndex:Math.min(n.currentIndex+1,n.states.length-1)})},[n]);return(0,a.useEffect)(()=>{let e=e=>{(e.ctrlKey||e.metaKey)&&e.shiftKey&&"z"===e.key?o():(e.ctrlKey||e.metaKey)&&"y"===e.key?o():(e.ctrlKey||e.metaKey)&&"z"===e.key&&l()};return window.addEventListener("keydown",e),()=>window.removeEventListener("keydown",e)},[o,l]),{state:n.states[n.currentIndex],setState:function(e){r(n=>{let r=e({...n.states[n.currentIndex]}),l=n.states.slice(0,n.currentIndex+1);return l.push(r),l.length>t&&(l=l.slice(l.length-t)),{states:l,currentIndex:l.length-1}})},undo:l,redo:o,canUndo:n.currentIndex>0,canRedo:n.currentIndex<n.states.length-1}}},1857:function(e,t,n){n.d(t,{$0:function(){return f},an:function(){return c},mI:function(){return s},yE:function(){return u}});let r=new Intl.NumberFormat("en-US",{style:"decimal",maximumFractionDigits:2}),l=new Intl.NumberFormat("en-US",{style:"currency",currency:"EUR"}),a=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}),o=new Intl.NumberFormat("en-US",{style:"percent",minimumFractionDigits:2}),i=Intl.NumberFormat("en-US",{notation:"compact",maximumFractionDigits:1}),u={label:"12.15%",formatter:e=>o.format(e)},s={label:"4,999.99",formatter:e=>r.format(e)},c={label:"VaR 95 - Date",formatter:e=>e?new Date(e[0],e[1]-1,e[2]).toLocaleDateString():""},f=[{label:"None",formatter:e=>e},s,{label:"$4,999.99",formatter:e=>a.format(e)},{label:"€4,999.99",formatter:e=>l.format(e)},{label:"5K",formatter:e=>i.format(e)},u,c]}}]);