(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{"0b8eb3e35929778b339a":function(e,n,t){"use strict";t.r(n);var r,o=t("8af190b70a6bc55c6f1b"),a=t.n(o),c=(t("8a2d1b95e05b6a321e74"),t("d7dd51e1bf6bfc2c9c3d")),i=t("0d7f0986bcd2f33d8a2a"),l=t("a28fc3c963a1d4d1a2e5"),f=t("ab4cb61bcb2dc161defb"),d=t("adc20f99e57c573c589c"),u=t("d95b0cf107403b178365"),s=t("9127de0d572c6321d91c"),b=t("a72b40110d9c31c9b5c5"),m=t("49112c95d93be1863904"),v=t.n(m);function p(e,n,t,o){r||(r="function"===typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103);var a=e&&e.defaultProps,c=arguments.length-3;if(n||0===c||(n={children:void 0}),1===c)n.children=o;else if(c>1){for(var i=new Array(c),l=0;l<c;l++)i[l]=arguments[l+3];n.children=i}if(n&&a)for(var f in a)void 0===n[f]&&(n[f]=a[f]);else n||(n=a||{});return{$$typeof:r,type:e,key:void 0===t?null:""+t,ref:null,props:n,_owner:null}}var h,y=p(s.a,{}),g=v()({loader:function(){return Promise.resolve().then(t.bind(null,"f318ce6ba0668e624433"))},loading:function(){return y},render:function(e,n){var t=e.default;return a.a.createElement(t,n)}});function w(e,n,t,r){h||(h="function"===typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103);var o=e&&e.defaultProps,a=arguments.length-3;if(n||0===a||(n={children:void 0}),1===a)n.children=r;else if(a>1){for(var c=new Array(a),i=0;i<a;i++)c[i]=arguments[i+3];n.children=c}if(n&&o)for(var l in o)void 0===n[l]&&(n[l]=o[l]);else n||(n=o||{});return{$$typeof:h,type:e,key:void 0===t?null:""+t,ref:null,props:n,_owner:null}}var x=w(s.a,{}),j=v()({loader:function(){return Promise.resolve().then(t.bind(null,"76071651b6395d00ce72"))},loading:function(){return x},render:function(e,n){var t=e.default;return a.a.createElement(t,n)}}),k=t("bb5434d0b565c4dc5c64"),O=t.n(k),P=t("7edf83707012a871cdfb"),S=t("fcb99a06256635f70435"),R={contentful:{loading:!1,data:[],error:!1,hasMore:!0,limit:100,skip:0}},$=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:R,n=arguments.length>1?arguments[1]:void 0;return Object(P.a)(e,function(t){switch(n.type){case S.d:t.contentful.loading=!0;break;case S.b:n.payload.length<100&&(t.contentful.hasMore=!1,t.contentful.loading=!1),t.contentful.data=O()(e.contentful.data,n.payload),t.contentful.skip+=t.contentful.limit;break;case S.a:t.contentful.error=n.error}})},A=function(e){return e.homePage||R},E=function(){return Object(l.a)(A,function(e){return e})},M=t("d782b72bc5b680c7122c"),N=t("5c0c65b02f40fba66ba8"),_=regeneratorRuntime.mark(D),z=regeneratorRuntime.mark(H);function D(){var e,n,t,r,o,a;return regeneratorRuntime.wrap(function(c){for(;;)switch(c.prev=c.next){case 0:return c.next=2,Object(M.select)(E());case 2:return e=c.sent,n=e.contentful,t=n.skip,r=n.limit,c.prev=4,c.next=7,Object(M.call)(N.a,{skip:t,limit:r});case 7:return o=c.sent,c.next=10,Promise.resolve(o.getParentEntriesAsync);case 10:return a=c.sent,c.next=13,Object(M.put)(Object(b.c)(a));case 13:c.next=19;break;case 15:return c.prev=15,c.t0=c.catch(4),c.next=19,Object(M.put)(Object(b.a)(c.t0));case 19:case"end":return c.stop()}},_,null,[[4,15]])}function H(){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(M.takeLatest)(S.d,D);case 2:case"end":return e.stop()}},z)}var q;t("60c59be048bba1492d28");function I(e,n,t,r){q||(q="function"===typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103);var o=e&&e.defaultProps,a=arguments.length-3;if(n||0===a||(n={children:void 0}),1===a)n.children=r;else if(a>1){for(var c=new Array(a),i=0;i<a;i++)c[i]=arguments[i+3];n.children=c}if(n&&o)for(var l in o)void 0===n[l]&&(n[l]=o[l]);else n||(n=o||{});return{$$typeof:q,type:e,key:void 0===t?null:""+t,ref:null,props:n,_owner:null}}t.d(n,"HomePage",function(){return W});var J=I(s.a,{}),L=I("div",{className:"d-flex flex-column align-items-center justify-content-between w-100 h-100"},void 0,I(i.Helmet,{},void 0,I("title",{},void 0,"World of darkness"),I("meta",{name:"description",content:"Description of HomePage"})),I(g,{}),I("div",{className:"container d-flex flex-column align-items-start justify-content-center w-100 h-100"},void 0,I("div",{"data-v-59e17c94":"",className:"welcome"},void 0,"Welcome"),I("a",{role:"button",tabIndex:"0",href:"#",target:"_self",className:"btn btn-primary"},void 0,"Learn More")),I(j,{}));function W(e){var n=e.onRequestData,t=e.homePage;Object(u.a)({key:"homePage",reducer:$}),Object(d.a)({key:"homePage",saga:H});var r=t.contentful,a=r.hasMore,c=r.loading;return Object(o.useEffect)(function(){a&&n()}),c&&a?J:L}var C=Object(l.b)({homePage:E()});var B=Object(c.connect)(C,function(e){return{onRequestData:function(){return e(Object(b.b)())}}});n.default=Object(f.compose)(B)(W)},"18083e2c1c9dd71794d4":function(e,n,t){(e.exports=t("0e326f80368fd0b1333e")(!1)).push([e.i,".welcome {\r\n  font-family: Cinzel;\r\n  font-size: 2rem;\r\n  color: #fff;\r\n  text-transform: uppercase;\r\n  margin-bottom: 40px;\r\n}\r\n\r\n@media (min-width: 991px) {\r\n  .welcome {\r\n    font-size: 64px;\r\n  }\r\n}\r\n",""])},"60c59be048bba1492d28":function(e,n,t){var r=t("18083e2c1c9dd71794d4");"string"===typeof r&&(r=[[e.i,r,""]]);var o={hmr:!0,transform:void 0,insertInto:void 0};t("1e4534d1d62a11482e97")(r,o);r.locals&&(e.exports=r.locals)}}]);