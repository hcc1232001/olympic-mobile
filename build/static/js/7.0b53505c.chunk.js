(this.webpackJsonpolympic=this.webpackJsonpolympic||[]).push([[7],{25:function(t,e,n){"use strict";n.r(e);var r=n(39),a=n(0),i=n.n(a),o=n(38),c=n.n(o);e.default=function(){var t=Object(a.useState)(0),e=Object(r.a)(t,2),n=(e[0],e[1]),o=Object(a.useState)(!1),u=Object(r.a)(o,2),s=u[0],l=u[1],f=Object(a.useState)([0,0,0]),b=Object(r.a)(f,2),v=b[0],m=b[1],p=Object(a.useState)(0),d=Object(r.a)(p,2),h=d[0],y=d[1],O=[null,null,null],j=Object(a.useRef)(0),w=function(t){var e=t.acceleration,r=e.x,a=e.y,i=e.z,o=Date.now(),c=o-j.current;j.current=o;Math.abs(r-O[0]);var u=Math.abs(a-O[1]);Math.abs(i-O[2]);n(u/c>.5?function(t){return t+1}:function(t){return Math.max(0,t-1)}),m([r,a,i]),y(c),O=[r,a,i]};return Object(a.useEffect)((function(){return s&&window.addEventListener("devicemotion",w,!1),function(){window.removeEventListener("devicemotion",w,!1)}}),[s]),i.a.createElement("div",{className:c.a.wrapper},i.a.createElement("button",{className:c.a.joinButton,onClick:function(){s||("function"===typeof DeviceOrientationEvent&&"function"===typeof DeviceOrientationEvent.requestPermission?DeviceOrientationEvent.requestPermission().then((function(t){"granted"==t&&l(!0)})).catch(console.error):l(!0))}},"Join Game!"),Math.round(1e3*v[1])/1e3,i.a.createElement("br",null),h)}},39:function(t,e,n){"use strict";function r(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t)){var n=[],r=!0,a=!1,i=void 0;try{for(var o,c=t[Symbol.iterator]();!(r=(o=c.next()).done)&&(n.push(o.value),!e||n.length!==e);r=!0);}catch(u){a=!0,i=u}finally{try{r||null==c.return||c.return()}finally{if(a)throw i}}return n}}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}n.d(e,"a",(function(){return r}))}}]);
//# sourceMappingURL=7.0b53505c.chunk.js.map