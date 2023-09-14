(this["webpackJsonpawesome-store"]=this["webpackJsonpawesome-store"]||[]).push([[0],{100:function(e,t,n){},101:function(e,t,n){},102:function(e,t,n){},104:function(e,t,n){},105:function(e,t,n){},106:function(e,t,n){},107:function(e,t,n){},108:function(e,t,n){"use strict";n.r(t);var a=n(12),c=n(61),r=n.n(c),s=n(70),i=n(2),o=n(0),l=n.n(o),u=n(10),d=n.n(u),j=(n(94),n(52)),b=n(18),O=n(14),m=n(164),h=n(151),f=(n(95),n(144)),p=n(148),x=n(149),v=n(110),g=n(150),y=n(11),N={basket:[],total:0,itemCount:0},C="addItem",k="removeItem",S="removeAll",w="clearBasket",q=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:N,t=arguments.length>1?arguments[1]:void 0,n=t.type,c=t.payload;switch(n){case C:var r=e.basket.slice(),s=r.map((function(e){return e.id})).indexOf(c.id);if(s<0)r.push(Object(a.a)(Object(a.a)({},c),{},{quantity:1,subtotal:c.unitPrice}));else{var i=r[s];i.quantity++,i.subtotal=i.quantity*i.unitPrice}var o=r.map((function(e){return e.subtotal})).reduce((function(e,t){return e+t}),0),l=r.map((function(e){return e.quantity})).reduce((function(e,t){return e+t}),0);e={basket:r,total:o,itemCount:l};break;case k:var u=e.basket.slice(),d=u.map((function(e){return e.id})).indexOf(c.id);if(d>-1){var j=u[d];j.quantity>1?(j.quantity--,j.subtotal=j.quantity*j.unitPrice):u.splice(d,1);var b=u.map((function(e){return e.subtotal})).reduce((function(e,t){return e+t}),0),O=u.map((function(e){return e.quantity})).reduce((function(e,t){return e+t}),0);e={basket:u,total:b,itemCount:O}}break;case S:var m=e.basket.slice(),h=m.map((function(e){return e.id})).indexOf(c.id);if(h>-1){m.splice(h,1);var f=m.map((function(e){return e.subtotal})).reduce((function(e,t){return e+t}),0),p=m.map((function(e){return e.quantity})).reduce((function(e,t){return e+t}),0);e={basket:m,total:f,itemCount:p}}break;case w:e={basket:[],total:0,itemCount:0}}return e},I=function(e){var t=e.item,n=Object(y.b)();return Object(i.jsxs)(f.a,{className:"item-card",children:[Object(i.jsxs)("div",{children:[Object(i.jsx)(p.a,{className:"item-image",image:t.imageUrl,title:t.title}),Object(i.jsxs)(x.a,{className:"item-detail",children:[Object(i.jsx)(v.a,{gutterBottom:!0,variant:"h5",component:"h2",children:t.title}),Object(i.jsxs)("span",{children:["$",t.unitPrice]})]})]}),Object(i.jsx)(g.a,{children:Object(i.jsx)(h.a,{size:"small",color:"primary",onClick:function(){n({type:C,payload:t})},children:"Add to cart"})})]})},P=(n(100),{headers:{"Content-Type":"application/json"}}),A=document.querySelector("link[rel='api-root']"),E=void 0;function T(e,t,n){return E&&"/"===e.charAt(0)&&(e=E+e),function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:P,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"GET",c=Object(a.a)(Object(a.a)({},P),t);if(c.method=n,"object"===typeof c.body&&c.headers){"application/json"===c.headers["Content-Type"]&&(c.body=JSON.stringify(c.body))}return c.headers&&(c.headers=new Headers(c.headers)),fetch(e,c).then((function(e){return e.ok?e:e.json().then((function(t){throw{code:e.status,message:t.message}}))})).then((function(e){return e.json()})).catch((function(e){throw e}))}(e,t,n)}A&&(E=A.getAttribute("href"))&&"/"===E.charAt(E.length-1)&&(E=E.slice(0,E.length-1));var z=function(){var e=Object(o.useContext)(xe).endpoints,t=Object(o.useState)([]),n=Object(b.a)(t,2),a=n[0],c=n[1];return Object(o.useEffect)((function(){T(e.catalogue).then((function(e){c(e)}))}),[]),Object(i.jsx)("div",{className:"page-offer",children:Object(i.jsx)("div",{className:"item-results",children:a.map((function(e,t){return Object(i.jsx)(I,{item:e},t)}))})})},U=n(165),F=n(161),M=(n(101),{status:"new",orderId:"",message:"",clientCallbackUrl:""}),R="placeOrderRequest",$="placeOrderSuccess",W="placeOrderFailure",D="processOrderRequest",B="processOrderSuccess",J="processOrderFailure",L=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:M,t=arguments.length>1?arguments[1]:void 0,n=t.type,c=t.payload;switch(n){case $:e=Object(a.a)(Object(a.a)({},e),{},{status:c.status?c.status:"placed",clientCallbackUrl:c.clientCallbackUrl,orderId:c.orderId});break;case W:e=Object(a.a)(Object(a.a)({},e),{},{status:c.status?c.status:"error",message:c.message,clientCallbackUrl:void 0});break;case B:e=Object(a.a)(Object(a.a)({},e),{},{status:c.status?c.status:"success",orderId:c.orderId,amountPaid:c.amountPaid});break;case J:e=Object(a.a)(Object(a.a)({},e),{},{status:c.status?c.status:"failed",orderId:c.orderId,message:c.message,clientCallbackUrl:void 0})}return e},Y=(n(102),function(e){var t=e.basketItem;return Object(i.jsxs)("li",{className:"line-item",children:[Object(i.jsx)("span",{className:"item-title",children:t.title}),Object(i.jsxs)("span",{className:"item-quantity",children:[" x",t.quantity]}),Object(i.jsxs)("span",{className:"subtotal",children:["$",t.subtotal]})]})}),G=function(e){var t=e.basket,n=e.total;return Object(i.jsxs)("ul",{children:[t.map((function(e,t){return Object(i.jsx)(Y,{basketItem:e},t)})),Object(i.jsxs)("li",{className:"line-item total",children:[Object(i.jsx)("span",{className:"total-label",children:"Total"}),Object(i.jsxs)("span",{className:"total-value",children:["$",n]})]},"total")]})},H=n(154),V=n(163),K=n(153),Q=function(e){return(e=e.replaceAll("-","")).length<17},X=function(){var e=Object(o.useContext)(xe).endpoints,t=Object(y.b)(),n=Object(O.g)(),a=Object(o.useState)("123 Some Street"),c=Object(b.a)(a,2),r=c[0],s=c[1],l=Object(o.useState)("Seoul"),u=Object(b.a)(l,2),d=u[0],j=u[1],m=Object(o.useState)("2880"),f=Object(b.a)(m,2),p=f[0],x=f[1],v=Object(o.useState)(""),g=Object(b.a)(v,2),N=g[0],C=g[1],k=Object(o.useState)(""),S=Object(b.a)(k,2),w=S[0],q=S[1],I=Object(o.useState)(""),P=Object(b.a)(I,2),A=P[0],E=P[1],z=Object(o.useState)(""),M=Object(b.a)(z,2),L=M[0],Y=M[1],X=Object(y.c)((function(e){return e.cart.basket})),Z=Object(y.c)((function(e){return e.cart.total})),_=Object(y.c)((function(e){return e.cart.itemCount})),ee=Object(y.c)((function(e){return e.order.status})),te=Object(y.c)((function(e){return e.order.message})),ne=Object(y.c)((function(e){return e.order.clientCallbackUrl})),ae=Object(y.c)((function(e){return e.order.orderId})),ce=Object(y.c)((function(e){return e.status.loading})),re=ce.indexOf("placeOrder")>-1||ce.indexOf("processOrder")>-1;Object(o.useEffect)((function(){0===_&&n.push("/")}),[]),Object(o.useEffect)((function(){"success"!==ee&&"processed"!==ee||n.push("/confirmation")}),[ee]),Object(o.useEffect)((function(){var e;ne&&(t({type:D}),(e=ne,new Promise((function(t,n){var a=new WebSocket(e);a.onopen=function(){console.log("Listening to order status update at ",e),setTimeout((function(){a.readyState===WebSocket.OPEN&&(console.log("Refreshing request for orderId:",ae),a.send(JSON.stringify({orderId:ae})))}),5e3),setTimeout((function(){a.readyState===WebSocket.OPEN&&(a.close(),n(new Error("Websocket timeout")))}),9e4)},a.onmessage=function(e){try{var c=JSON.parse(e.data);console.log("Receive message: ",c),"success"===c.status?(a.close(),t(c)):"failed"===c.status&&(a.close(),n(c))}catch(r){a.close(),n(r)}},a.onerror=function(){n(new Error("Websocket error"))}}))).then((function(e){t({type:B,payload:e})})).catch((function(e){t({type:J,payload:e})})))}),[ne]);var se=function(){t(function(){var n={basket:X.map((function(e){return{id:e.id,title:e.title,quantity:e.quantity}})),shippingAddress:{address:r,city:d,postCode:p},paymentDetail:{cardNumber:N,cardholderName:w,expiry:A,ccv:L}};return t({type:R}),function(t){T(e.placeOrder,{body:n},"POST").then((function(e){t({type:$,payload:{clientCallbackUrl:e.clientCallbackUrl,orderId:e.orderId}})})).catch((function(e){t({type:W,payload:{message:e.message}})}))}}())};return Object(i.jsxs)("div",{className:"page-payment",children:[Object(i.jsx)("div",{className:"side-bar",children:Object(i.jsx)(G,{basket:X,total:Z})}),Object(i.jsx)("div",{className:"main-content",children:Object(i.jsxs)("form",{onSubmit:function(e){return e.preventDefault(),se(),!1},onReset:function(e){window.location.href="/",e.preventDefault()},children:[Object(i.jsx)("h3",{children:"Shipping Address"}),Object(i.jsx)(U.a,{className:"address",fullWidth:!0,margin:"normal",children:Object(i.jsx)(F.a,{name:"address",label:"Address",variant:"outlined",value:r,onChange:function(e){s(e.target.value)}})}),Object(i.jsx)(U.a,{className:"city",margin:"normal",children:Object(i.jsx)(F.a,{name:"city",label:"City",variant:"outlined",value:d,onChange:function(e){j(e.target.value)}})}),Object(i.jsx)(U.a,{className:"postCode",margin:"normal",children:Object(i.jsx)(F.a,{name:"postCode",label:"Post Code",variant:"outlined",value:p,onChange:function(e){x(e.target.value)}})}),Object(i.jsx)("h3",{children:"Payment Details"}),Object(i.jsx)(U.a,{className:"cardNumber",fullWidth:!0,margin:"normal",children:Object(i.jsx)(F.a,{name:"cardNumber",label:"Card Number",variant:"outlined",error:!Q(N),helperText:Q(N)?null:"Credit card number too long",value:N,onChange:function(e){(function(e){return 0===(e=e.replaceAll("-","")).length||/^\d+$/.test(e)})(e.target.value)&&C(function(e){var t=(e=e.replaceAll("-","")).match(/.{1,4}/g);return t?t.join("-"):""}(e.target.value))}})}),Object(i.jsx)(U.a,{className:"cardholderName",margin:"normal",children:Object(i.jsx)(F.a,{name:"cardholderName",label:"Cardholder Name",variant:"outlined",value:w,onChange:function(e){q(e.target.value)}})}),Object(i.jsx)(U.a,{className:"expiry",margin:"normal",children:Object(i.jsx)(F.a,{name:"expiry",label:"Expiry Date",variant:"outlined",value:A,onChange:function(e){(function(e){return 0===(e=e.replaceAll("/","")).length||/^\d+$/.test(e)})(e.target.value)&&E(function(e){return(e=e.replaceAll("/","").slice(0,4)).length>2?[e.slice(0,2),"/",e.slice(2)].join(""):e}(e.target.value))}})}),Object(i.jsx)(U.a,{className:"ccv",margin:"normal",children:Object(i.jsx)(F.a,{name:"ccv",label:"CCV",variant:"outlined",value:L,onChange:function(e){(function(e){return 0===e.length||/^\d+$/.test(e)})(e.target.value)&&Y(e.target.value.slice(0,3))}})}),"error"===ee||"failed"===ee?Object(i.jsx)(V.a,{severity:"error",className:"error",children:Object(i.jsx)(K.a,{children:te})}):null,"placed"===ee?Object(i.jsxs)(V.a,{severity:"success",children:[Object(i.jsx)(K.a,{children:"Your order has been submitted"}),"Awaiting order processing status update for order reference:",Object(i.jsx)("br",{}),Object(i.jsx)("b",{children:ae})]}):null,Object(i.jsxs)("div",{className:"buttons",children:[Object(i.jsxs)("span",{style:{display:"flex",alignItems:"center"},children:[Object(i.jsx)(h.a,{type:"submit",color:"primary",size:"large",variant:"contained",disabled:re,children:"Confirm Payment"}),Object(i.jsx)(H.a,{size:24,className:"progress ".concat(re?"submitting":null)})]}),Object(i.jsx)(h.a,{type:"reset",size:"large",variant:"contained",disabled:re,children:"Cancel"})]})]})})]})},Z=(n(104),[{path:"/",label:"offer",pageContent:z},{path:"/payment",label:"payment",pageContent:X,props:{hideCart:!0}},{path:"/confirmation",label:"confirmation",pageContent:function(){Object(O.g)();var e=Object(y.c)((function(e){return e.order.orderId})),t=Object(y.c)((function(e){return e.order.amountPaid})),n=Object(y.b)();return Object(o.useEffect)((function(){n({type:w})}),[]),Object(i.jsxs)("div",{className:"confirmation",children:[Object(i.jsxs)("p",{children:["Thank you for shopping at Octank Awsome Pets. You have paid an amount of $",t]}),Object(i.jsxs)("p",{children:["Your order reference is ",Object(i.jsx)("b",{children:e}),"."]}),Object(i.jsx)("div",{className:"buttons",children:Object(i.jsx)(h.a,{color:"primary",size:"medium",variant:"contained",onClick:function(){window.location.href="/"},children:"Back to shopping"})})]})},props:{hideCart:!0}}]),_=n(155),ee=n(156);var te=function(e){var t=Object(O.g)(),n=e.toggleNavMenu,a=e.hideCart,c=(Object(j.a)(e,["toggleNavMenu","hideCart"]),Object(y.c)((function(e){return e.cart.itemCount})));return Object(i.jsx)("header",{children:Object(i.jsxs)("div",{className:"header-content",children:[Object(i.jsx)("div",{className:"header-section",children:Object(i.jsxs)("a",{className:"logo",href:"#",onClick:function(){return t.push("/"),!1},children:[Object(i.jsx)("span",{className:"narrow",children:"Awsome"}),Object(i.jsx)("span",{className:"bold",children:"Pets"})]})}),Object(i.jsx)("div",{className:"header-section",children:a?null:Object(i.jsxs)(h.a,{onClick:n,children:[Object(i.jsx)(_.a,{style:{fontSize:30}}),Object(i.jsx)(ee.a,{style:{marginTop:16},badgeContent:c,color:"secondary",vertical:"bottom"})]})})]})})};var ne=function(e){return Object(i.jsx)("footer",{})},ae=(n(105),n(106),n(107),n(159)),ce=n(157),re=n(158),se=n(152),ie=function(e){var t=e.basketItem,n=Object(y.b)();return Object(i.jsxs)("div",{className:"cart-item",children:[Object(i.jsx)(p.a,{className:"item-image",image:t.imageUrl,title:t.title}),Object(i.jsxs)("div",{style:{padding:8,borderBottom:"1px solid #ccc",flex:"1 1 auto",margin:8},children:[Object(i.jsxs)("div",{className:"item-detail",children:[Object(i.jsx)("h4",{children:t.title}),Object(i.jsxs)("span",{className:"subtotal",children:["$",t.subtotal]})]}),Object(i.jsxs)("div",{className:"item-quantity",children:[Object(i.jsxs)("span",{children:[Object(i.jsx)(se.a,{size:"small",onClick:function(){n({type:k,payload:t})},children:Object(i.jsx)(ce.a,{})}),Object(i.jsx)("span",{children:t.quantity}),Object(i.jsx)(se.a,{size:"small",onClick:function(){n({type:C,payload:t})},children:Object(i.jsx)(re.a,{})})]}),Object(i.jsx)(se.a,{size:"small",onClick:function(){n({type:S,payload:t})},children:Object(i.jsx)(ae.a,{})})]})]})]})},oe=n(160),le=function(e){var t=e.close,n=Object(O.g)(),a=Object(y.c)((function(e){return e.cart.basket})),c=Object(y.c)((function(e){return e.cart.total})),r=Object(y.c)((function(e){return e.cart.itemCount}));return Object(i.jsxs)("div",{className:"shopping-cart",children:[Object(i.jsx)("div",{className:"header",children:Object(i.jsx)(se.a,{onClick:t,children:Object(i.jsx)(oe.a,{})})}),a.length>0?Object(i.jsxs)("div",{children:[Object(i.jsx)("div",{className:"basket",children:a.map((function(e,t){return Object(i.jsx)(ie,{basketItem:e},t)}))}),Object(i.jsxs)("div",{className:"total-row",children:[Object(i.jsx)("span",{children:"Total"}),Object(i.jsxs)("span",{className:"total",children:["$",c]})]})]}):Object(i.jsx)("div",{className:"empty-basket",children:"Your shopping cart is empty"}),Object(i.jsx)("div",{className:"actions",children:Object(i.jsx)(h.a,{className:"checkout-button",disabled:r<1,variant:"contained",color:"primary",size:"medium",onClick:function(){t(),n.push("payment")},children:"Checkout"})})]})};function ue(e){var t=e.content,n=e.hideCart,a=e.navGroup,c=e.toggleNavMenu,r=Object(j.a)(e,["content","hideCart","navGroup","toggleNavMenu"]);return Object(i.jsxs)(i.Fragment,{children:[Object(i.jsx)(te,{routes:Z,selected:a,toggleNavMenu:c,hideCart:n}),Object(i.jsx)("div",{className:"workspace-content",children:l.a.createElement(t,r)})]})}var de=function(){var e=Object(o.useState)(!1),t=Object(b.a)(e,2),n=t[0],c=t[1],r=function(e){void 0===e&&(e=!n),c(e)};return Object(i.jsxs)("div",{children:[Object(i.jsxs)(O.d,{children:[Z.map((function(e,t){return Object(i.jsx)(O.b,{path:e.path,exact:void 0!==e.exact?e.exact:!(e.props&&e.props.routes),render:function(){return l.a.createElement(ue,Object(a.a)(Object(a.a)({},e.props),{},{content:e.pageContent,toggleNavMenu:r}))}},t)})),Object(i.jsx)(O.b,{exact:!0,path:"/",children:Object(i.jsx)(O.a,{to:"/"})})]}),Object(i.jsx)(ne,{}),Object(i.jsx)(m.a,{anchor:"right",open:n,onClose:function(){r(!1)},children:Object(i.jsx)(le,{close:function(){r(!1)}})})]})},je=n(76),be=n(34),Oe=n(77),me=n(65),he=new RegExp("(.*)(Request|Success|Failure)"),fe=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{loading:[],errors:{}},t=arguments.length>1?arguments[1]:void 0,n=t.type,c=t.payload,r=he.exec(n);if(!r)return e;var s=Object(b.a)(r,3),i=s[1],o=s[2],l=e.loading.indexOf(i);if("Request"===o)return-1===l?Object(a.a)(Object(a.a)({},e),{},{loading:[].concat(Object(me.a)(e.loading),[i])}):e;l>-1&&e.loading.splice(l,1);var u=Object(a.a)({},e.errors);return"Success"===o?delete u[i]:"Failure"===o&&(u[i]=c),Object(a.a)(Object(a.a)({},e),{},{loading:Object(me.a)(e.loading),errors:u})},pe=n(31),xe=l.a.createContext({});function ve(){var e=Object(Oe.composeWithDevTools)({});return Object(be.createStore)(Object(be.combineReducers)({status:fe,cart:q,order:L}),e(Object(be.applyMiddleware)(je.a)))}var ge=function(e){return Object(i.jsx)(xe.Provider,{value:e,children:Object(i.jsx)(y.a,{store:ve(),children:Object(i.jsx)(pe.a,{children:Object(i.jsx)(de,{})})})})},ye=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,167)).then((function(t){var n=t.getCLS,a=t.getFID,c=t.getFCP,r=t.getLCP,s=t.getTTFB;n(e),a(e),c(e),r(e),s(e)}))},Ne=document.getElementById("root"),Ce=Ne.querySelector('[rel="configuration"]');(Ce?function(){var e=Object(s.a)(r.a.mark((function e(t){var n,a,c;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!(n=t.getAttribute("src"))){e.next=11;break}return e.next=4,fetch(n);case 4:return a=e.sent,e.next=7,a.json();case 7:return c=e.sent,e.abrupt("return",c);case 11:return e.abrupt("return",JSON.parse(t.innerHTML));case 12:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()(Ce):Promise.resolve({})).then((function(e){d.a.render(Object(i.jsx)(l.a.StrictMode,{children:Object(i.jsx)(ge,Object(a.a)({},e))}),Ne)})),ye()},94:function(e,t,n){},95:function(e,t,n){}},[[108,1,2]]]);
//# sourceMappingURL=main.304e704c.chunk.js.map
