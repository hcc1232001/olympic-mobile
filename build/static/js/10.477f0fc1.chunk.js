(this.webpackJsonpolympic=this.webpackJsonpolympic||[]).push([[10],{24:function(e,a,t){"use strict";t.r(a);var c=t(48),n=t(52),l=t(41),r=t(0),m=t.n(r),s=t(5),i=t(85),o=t(86),u=t(87),d=t(88),v=t(89),E=t(42),N=t(43),g=t(39),j=t.n(g),b=0,f=1,q=2,h=3,p=4,k=5,O=6,I=7,S=["#ed334e","#00652e","#0080C7","#fbb130","#231f20"];a.default=function(){var e,a=Object(v.a)(),t=Object(l.a)(a,2),g=t[0],y=g.moveCounter,C=g.permissionGranted,x=t[1],w=x.setMoveCounter,M=x.setPermissionGranted,H=Object(r.useState)(b),z=Object(l.a)(H,2),B=z[0],L=z[1],R=Object(r.useState)(-1),T=Object(l.a)(R,2),G=T[0],W=T[1],D=Object(r.useState)(0),A=Object(l.a)(D,2),P=A[0],F=A[1],J=Object(r.useState)(""),X=Object(l.a)(J,2),_=X[0],K=X[1],Q=Object(r.useState)(!1),U=Object(l.a)(Q,2),V=U[0],Y=U[1],Z=Object(r.useState)(-1),$=Object(l.a)(Z,2),ee=$[0],ae=$[1],te=Object(r.useState)(S[0]),ce=Object(l.a)(te,2),ne=ce[0],le=ce[1],re=Object(r.useState)([]),me=Object(l.a)(re,2),se=me[0],ie=me[1],oe=Object(s.i)("playerId"),ue=Object(r.useRef)(null),de=Object(r.useRef)(null),ve=function(e){var a=!0;switch(e.key){case"1":a=!1;case"2":case"3":case"4":case"5":case"6":case"7":L(e.key-1),Y(a)}};Object(r.useEffect)((function(){return document.addEventListener("keyup",ve),function(){document.removeEventListener("keyup",ve)}}),[]),Object(r.useEffect)((function(){requestAnimationFrame((function(){ae(B)})),B===p&&ie([])}),[B]);var Ee=function(){C||("function"===typeof DeviceOrientationEvent&&"function"===typeof DeviceOrientationEvent.requestPermission?DeviceOrientationEvent.requestPermission().then((function(e){"granted"==e?M(!0):alert("...")})).catch(console.error):M(!0))};Object(r.useEffect)((function(){C&&(ue.current=Object(E.a)({host:N.a.socketioHost,eventEmitters:[{emitter:"joinRoom",data:oe,ack:function(e){"joined"!==e.data?(L(I),K(e.data)):le(S[e.index])}}],eventListeners:[{listener:"gameStage",callback:function(e){var a=e.data;L(a),a===O&&ue.current.disconnect()}},{listener:"gameResult",callback:function(e){console.log(e);var a=e.data;F(Math.round(a))}},{listener:"playersInfo",callback:function(e){e.data.forEach((function(e){e.playerId===oe.playerId&&Y(e.joined)}))}},{listener:"gameChoice",callback:function(e){var a=e.data;W(a)}},{listener:"gameSelected",callback:function(e){var a=e.data;W(a)}}]}))}),[C]),Object(r.useEffect)((function(){y>2&&(Ne(),w(0))}),[y,B]);var Ne=function(){ue.current&&ue.current.emit("shake"),ge()},ge=function(){var e=(Math.random()+8)/9,a=50*Math.random()-25,t=30*Math.random()-10,c=10*Math.random()-5,l=180*Math.random()-90,r=90*Math.random()-45,s=Math.random()+4,i=m.a.createElement(d.a,{className:j.a["shake-icon"],colorCodeInHex:ne,initialStyles:{bottom:"".concat(72+c,"vw"),left:"".concat(50+a,"%"),transform:"translateX(-50%) scale(".concat(e,") rotate(").concat(l,"DEG)"),opacity:.8,transition:"all ".concat(s,"s")},finalStyles:{bottom:"100vh",left:"".concat(t,"%"),transform:"translateX(-50%) scale(0) rotate(".concat(r,"DEG)"),opacity:0,transition:"all ".concat(s,"s")}});ie((function(e){return[].concat(Object(n.a)(e),[i])}))};return m.a.createElement("div",{ref:function(e){return de.current=e},className:j.a.wrapper},(e={},Object(c.a)(e,b,m.a.createElement("div",{className:[j.a.stage,j.a["stage-idle"],j.a.active].join(" ")},m.a.createElement("div",{className:j.a.background},m.a.createElement("div",{className:j.a.texture})),m.a.createElement("div",{className:[j.a.marquee,j.a.marqueeTop,j.a.marqueeIdle].join(" ")}),m.a.createElement("div",{className:[j.a.marquee,j.a.marqueeLeft,j.a.marqueeIdle].join(" ")}),m.a.createElement("div",{className:[j.a.marquee,j.a.marqueeBottom,j.a.marqueeIdle].join(" ")}),m.a.createElement("div",{className:[j.a.marquee,j.a.marqueeRight,j.a.marqueeIdle].join(" ")}),m.a.createElement("div",{className:j.a.title}),m.a.createElement("div",{className:[j.a.counter,j.a.counter1].join(" ")},m.a.createElement("div",{className:[j.a["background-en"]]}),m.a.createElement("div",{className:[j.a["background-zh"]]}),m.a.createElement("span",null,2884)," km"),m.a.createElement("div",{className:[j.a.counter,j.a.counter2].join(" ")},m.a.createElement("div",{className:[j.a["background-en"]]}),m.a.createElement("div",{className:[j.a["background-zh"]]}),m.a.createElement("span",null,"10")),m.a.createElement("div",{className:j.a.logo}),m.a.createElement("div",{className:j.a["join-game"],onClick:Ee},m.a.createElement("div",{className:j.a["text-en"]}),m.a.createElement("div",{className:j.a["text-zh"]})))),Object(c.a)(e,f,V?m.a.createElement("div",{className:[j.a.stage,j.a["stage-waiting"],ee===f?j.a.active:null].join(" ")},m.a.createElement("div",{className:j.a.background},m.a.createElement("div",{className:j.a.texture}),m.a.createElement(i.a,{className:[j.a.movingIcon,j.a.movingIcon1].join(" "),colorCodeInHex:ne}),m.a.createElement(i.a,{className:[j.a.movingIcon,j.a.movingIcon2].join(" "),colorCodeInHex:ne}),m.a.createElement(i.a,{className:[j.a.movingIcon,j.a.movingIcon3].join(" "),colorCodeInHex:ne}),m.a.createElement(i.a,{className:[j.a.movingIcon,j.a.movingIcon4].join(" "),colorCodeInHex:ne})),m.a.createElement("div",{className:[j.a.marquee,j.a.marqueeTop,j.a.marqueeWaiting].join(" ")}),m.a.createElement("div",{className:[j.a.marquee,j.a.marqueeLeft,j.a.marqueeWaiting].join(" ")}),m.a.createElement("div",{className:[j.a.marquee,j.a.marqueeBottom,j.a.marqueeWaiting].join(" ")}),m.a.createElement("div",{className:[j.a.marquee,j.a.marqueeRight,j.a.marqueeWaiting].join(" ")})):m.a.createElement("div",{className:[j.a.stage,j.a["stage-idle"]].join(" ")},m.a.createElement("div",{className:j.a.background},m.a.createElement("div",{className:j.a.texture})),m.a.createElement("div",{className:j.a.title}),m.a.createElement("div",{className:[j.a.counter,j.a.counter1].join(" ")},m.a.createElement("div",{className:[j.a["background-en"]]}),m.a.createElement("div",{className:[j.a["background-zh"]]}),m.a.createElement("span",null,1884)," km"),m.a.createElement("div",{className:[j.a.counter,j.a.counter2].join(" ")},m.a.createElement("span",null,"10,000,121")),m.a.createElement("div",{className:j.a.logo}),m.a.createElement("div",{className:j.a["join-game"],onClick:Ee}))),Object(c.a)(e,q,m.a.createElement("div",{className:[j.a.stage,j.a["stage-selecting"],ee===q?j.a.active:null,-1!==G?j.a.selected:null].join(" ")},m.a.createElement("div",{className:j.a.background},m.a.createElement("div",{className:j.a.texture})),m.a.createElement("div",{className:[j.a.marquee,j.a.marqueeTop,j.a.marqueeSelecting].join(" ")}),m.a.createElement("div",{className:[j.a.marquee,j.a.marqueeLeft,j.a.marqueeSelecting].join(" ")}),m.a.createElement("div",{className:[j.a.marquee,j.a.marqueeBottom,j.a.marqueeSelecting].join(" ")}),m.a.createElement("div",{className:[j.a.marquee,j.a.marqueeRight,j.a.marqueeSelecting].join(" ")}),m.a.createElement("div",{className:[j.a.buttonsWrapper].join(" ")},new Array(3).fill(0).map((function(e,a){return m.a.createElement("div",{className:j.a.button},m.a.createElement("button",{onClick:function(){return e=a,void(ue.current?ue.current.emit("selectGame",{data:e},(function(e){var a=e.data;W(a)})):W(G===e?-1:e));var e},className:[j.a.gameButton,j.a["gameButton".concat(a)],G===a?j.a.selected:null].join(" ")},m.a.createElement("div",{className:j.a.contentWrapper},m.a.createElement("div",{className:j.a.zh}),m.a.createElement("div",{className:j.a.en}),m.a.createElement("div",{className:j.a.ani}))))}))))),Object(c.a)(e,h,m.a.createElement("div",{className:[j.a.stage,j.a["stage-selected"],ee===h?j.a.active:null].join(" ")},m.a.createElement("div",{className:j.a.background},m.a.createElement("div",{className:j.a.texture})),m.a.createElement("div",{className:[j.a.marquee,j.a.marqueeTop,j.a.marqueeSelecting].join(" ")}),m.a.createElement("div",{className:[j.a.marquee,j.a.marqueeLeft,j.a.marqueeSelecting].join(" ")}),m.a.createElement("div",{className:[j.a.marquee,j.a.marqueeBottom,j.a.marqueeSelecting].join(" ")}),m.a.createElement("div",{className:[j.a.marquee,j.a.marqueeRight,j.a.marqueeSelecting].join(" ")}),m.a.createElement("div",{className:j.a.title}),m.a.createElement("div",{className:[j.a.gameName,j.a["game".concat(G)]].join(" ")},m.a.createElement("div",{className:j.a.zh}),m.a.createElement("div",{className:j.a.en})),m.a.createElement("div",{className:[j.a.gacha,j.a.gachaTop].join(" ")}),m.a.createElement("div",{className:[j.a.gacha,j.a.gachaBottom].join(" ")}),m.a.createElement("div",{className:[j.a.result,j.a["result".concat(G)]].join(" ")}))),Object(c.a)(e,p,m.a.createElement("div",{className:[j.a.stage,j.a["stage-ready"],ee===p?j.a.active:null].join(" ")},m.a.createElement("div",{className:j.a.background}),m.a.createElement("div",{className:j.a["get-image"]}),m.a.createElement("div",{className:j.a["set-image"]}),m.a.createElement("div",{onClick:Ne},m.a.createElement(o.a,{className:[j.a.fanIcon].join(" "),colorCodeInHex:ne})),se)),Object(c.a)(e,k,m.a.createElement("div",{className:[j.a.stage,j.a["stage-started"],ee===k?j.a.active:null].join(" ")},m.a.createElement("div",{className:j.a.background}),m.a.createElement("div",{className:j.a["go-image"]}),m.a.createElement("div",{onClick:Ne},m.a.createElement(o.a,{className:[j.a.fanIcon].join(" "),colorCodeInHex:ne})),se)),Object(c.a)(e,O,m.a.createElement("div",{className:[j.a.stage,j.a["stage-result"],ee===O?j.a.active:null].join(" ")},m.a.createElement("div",{className:j.a.background},m.a.createElement("div",{className:j.a.texture})),m.a.createElement("div",{className:j.a.splashScreen},new Array(10).fill(0).map((function(e,a){return m.a.createElement("div",{className:[j.a["banner-wrapper"],j.a["bannerLot".concat(Math.floor(a/5))],j.a["bannerType".concat(a%5)]].join(" ")},m.a.createElement("div",{className:j.a.banner}))}))),m.a.createElement("div",{className:j.a.title}),m.a.createElement("div",{className:j.a.header}),m.a.createElement("div",{className:[j.a.score,j.a["digit".concat(P.toString().split("").length)]].join(" ")},P.toString().split("").map((function(e,a){return m.a.createElement("span",{key:a,className:[j.a.number,j.a["number".concat(e)]].join(" ")})})),m.a.createElement("div",{className:j.a.unit},"km"),m.a.createElement("div",{className:j.a.remain},m.a.createElement("div",{className:j.a.zh},2884-P),m.a.createElement("div",{className:j.a.en},2884-P," to go"))),m.a.createElement("div",{className:j.a["bar-chart"]},m.a.createElement("div",{className:j.a.bar,style:{backgroundColor:ne,width:"".concat(ee===O?50*Math.random()+50:0,"%")}}),m.a.createElement(u.a,{className:j.a.icon,colorCodeInHex:ne})),m.a.createElement("div",{className:[j.a.selected,j.a["selected".concat(G)]].join(" ")}),m.a.createElement("a",{className:j.a.shareToFb,href:"https://www.facebook.com/sharer/sharer.php?u=".concat(window.location.origin,"&quote=I played Shake Shake Game and got ").concat(P," marks !"),target:"_blank"},m.a.createElement("div",{className:j.a.zh}),m.a.createElement("div",{className:j.a.en})))),Object(c.a)(e,I,m.a.createElement("div",{className:j.a.joinButton},m.a.createElement("div",null,_))),e)[B])}}}]);
//# sourceMappingURL=10.477f0fc1.chunk.js.map