(this.webpackJsonpolympic=this.webpackJsonpolympic||[]).push([[5,12],{25:function(e,t,n){"use strict";n.r(t);var a=n(49),c=n(39),o=n(0),i=n.n(o),r=n(5),s=function(){var e=Object(o.useState)(!1),t=Object(c.a)(e,2),n=t[0],a=t[1],i=Object(o.useState)(0),r=Object(c.a)(i,2),s=r[0],u=r[1];Object(o.useEffect)((function(){return n&&window.addEventListener("devicemotion",m,!1),function(){window.removeEventListener("devicemotion",m,!1)}}),[n]);var l=[null,null,null],m=function(e){var t=e.acceleration,n=t.x,a=t.y,c=t.z,o=(Math.abs(n-l[0]),Math.abs(a-l[1]));Math.abs(c-l[2]);u(o>45?function(e){return e+1}:function(e){return Math.max(0,e-1)}),l=[n,a,c]};return[{moveCounter:s,permissionGranted:n},{setPermissionGranted:a,setMoveCounter:u}]},u=n(40),l=n(42),m=n(38),f=n.n(m),b=0,d=1,j=2,v=3,E=4,O=5,p=6;t.default=function(){var e,t=s(),n=Object(c.a)(t,2),m=n[0],k=m.moveCounter,h=m.permissionGranted,B=n[1],_=B.setMoveCounter,y=B.setPermissionGranted,N=Object(o.useState)(b),C=Object(c.a)(N,2),G=C[0],g=C[1],S=Object(o.useState)(0),w=Object(c.a)(S,2),R=w[0],H=w[1],M=Object(o.useState)(0),I=Object(c.a)(M,2),J=I[0],L=I[1],P=Object(o.useState)(!1),x=Object(c.a)(P,2),D=x[0],q=x[1],z=Object(r.i)("playerId"),Q=Object(o.useRef)(null),W=function(){h||("function"===typeof DeviceOrientationEvent&&"function"===typeof DeviceOrientationEvent.requestPermission?DeviceOrientationEvent.requestPermission().then((function(e){"granted"==e&&y(!0)})).catch(console.error):y(!0))};Object(o.useEffect)((function(){h&&(Q.current=Object(u.a)({host:l.a.socketioHost,eventEmitters:[{emitter:"joinRoom",data:z,ack:function(e){"failed, scan again"===e&&alert("Room not found, please Scan the QRcode again.")}}],eventListeners:[{listener:"gameStage",callback:function(e){g(e),e===j&&H(0)}},{listener:"gameResult",callback:function(e){L(e)}},{listener:"playersInfo",callback:function(e){e.forEach((function(e){e.playerId===z.playerId&&q(e.joined)}))}},{listener:"gameChoice",callback:function(e){H(e)}},{listener:"gameSelected",callback:function(e){H(e)}}]}))}),[h]),Object(o.useEffect)((function(){k>2&&(A(),_(0))}),[k]);var A=function(){Q.current.emit("shake")},F=function(e){Q.current.emit("selectGame",e,(function(e){H(e)}))};return i.a.createElement("div",{className:f.a.wrapper},(e={},Object(a.a)(e,b,i.a.createElement("button",{className:f.a.joinButton,onClick:W},"Join Game!")),Object(a.a)(e,d,D?i.a.createElement("div",{className:f.a.joinButton},"Wait for other players"):i.a.createElement("button",{className:f.a.joinButton,onClick:W},"Join Game!")),Object(a.a)(e,j,i.a.createElement("div",{className:f.a.joinButton},i.a.createElement("button",{onClick:function(){return F(0)},className:f.a.selectButton+(0===R?" "+f.a.selected:"")},"Game 1"),i.a.createElement("br",null),i.a.createElement("button",{onClick:function(){return F(1)},className:f.a.selectButton+(1===R?" "+f.a.selected:"")},"Game 2"),i.a.createElement("br",null),i.a.createElement("button",{onClick:function(){return F(2)},className:f.a.selectButton+(2===R?" "+f.a.selected:"")},"Game 3"))),Object(a.a)(e,v,i.a.createElement("div",{className:f.a.joinButton},"Game ",R+1)),Object(a.a)(e,E,i.a.createElement("div",{className:f.a.joinButton},"Ready")),Object(a.a)(e,O,i.a.createElement("button",{className:f.a.joinButton,onClick:A},"Shake!")),Object(a.a)(e,p,i.a.createElement("div",{className:f.a.joinButton},"Result",i.a.createElement("div",null,i.a.createElement("b",null,J)))),e)[G])}},38:function(e,t,n){e.exports={wrapper:"mobileHome_wrapper__2dkv9",joinButton:"mobileHome_joinButton__2dv24",selectButton:"mobileHome_selectButton__13aoe",selected:"mobileHome_selected__2QI_z"}},40:function(e,t,n){"use strict";var a=n(53),c=n.n(a);t.a=function(e){var t=e.host,n=e.eventListeners,a=e.eventEmitters,o=c()(t,{secure:!1});return o.on("connect",(function(){console.log("connected !"),a.forEach((function(e){var t="function"===typeof e.ack?e.ack:null;o.emit(e.emitter,e.data,t)}))})),n.forEach((function(e){o.on(e.listener,e.callback)})),o}},42:function(e,t,n){"use strict";t.a={socketioHost:"shakeshakegame.herokuapp.com"}},56:function(e,t){}}]);
//# sourceMappingURL=5.dc53d1cf.chunk.js.map