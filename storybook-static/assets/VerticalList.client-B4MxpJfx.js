import{j as st}from"./jsx-runtime-CexXSJP5.js";import{a as i,r as St}from"./index-BP8_t0zE.js";import{n as Wt}from"./emotion-styled.browser.esm-Dz2BNYeh.js";import{A as Nt}from"./ArrowIcon-DGi346k6.js";import{a as Ot}from"./theme-ui-components.esm-Cq1N8tMa.js";const _="react-horizontal-scrolling-menu",Ht=`${_}--item`,Ut=`${_}--scroll-container`,Ft=`${_}--wrapper`,Pt=`${_}--inner-wrapper`,_t=`${_}--header`,Dt=`${_}--arrow-left`,Yt=`${_}--arrow-right`,Xt=`${_}--footer`,zt="itemId",jt="data-key",Tt="data-index",$={first:"first",last:"last",onInit:"onInit",onUpdate:"onUpdate"},T="",qt={current:null};class Jt{constructor(){this.subscribe=(t,e)=>{this.observers.set(t,(this.observers.get(t)||[]).concat(e))},this.unsubscribe=(t,e)=>{const n=(this.observers.get(t)||[]).filter((t=>t!==e));n.length?this.observers.set(t,n):this.observers.delete(t)},this.emitUpdates=(t,e)=>{const n=this.observers.get(t)||[];null==n||n.forEach((t=>t(e)))},this.updateBatch=(t,e=!0)=>{t.length&&(t.forEach((([t,e])=>this.emitUpdates(t,e))),e&&this.emitUpdates($.onUpdate))},this.update=(t,e)=>{this.emitUpdates(t,e),this.emitUpdates($.onUpdate)},this.observers=new Map}}class Kt extends Map{constructor(){super(),this.subscribe=(t,e)=>this.observer.subscribe(t,e),this.unsubscribe=(t,e)=>this.observer.unsubscribe(t,e),this.isEdgeItem=({key:t,value:e,first:n=this.first(),last:o=this.last()})=>{const r=[];return t===(null==n?void 0:n.key)?r.push([$.first,e]):t===(null==o?void 0:o.key)&&r.push([$.last,e]),r},this.edgeItemsCheck=t=>{const e=this.first(),n=this.last(),o=t.find((([t])=>t===(null==e?void 0:e.key))),r=[];o&&r.push([$.first,o[1]]);const i=t.find((([t])=>t===(null==n?void 0:n.key)));return i&&r.push([$.last,i[1]]),r},this.toArr=()=>this.sort([...this]),this.toItems=()=>this.toArr().map((([t])=>t)),this.sort=t=>t.sort((([,t],[,e])=>+t.index-+e.index)),this.set=(t,e)=>{const n=String(t),o=[[n,e]];return super.set(n,e),o.push(...this.isEdgeItem({key:n,value:e,first:this.first(),last:this.last()})),this.observer.updateBatch(o),this},this.setBatch=t=>{this.firstRun&&this.observer.update($.onInit);const e=[...t];return this.sort(e).forEach((([t,e])=>{super.set(String(t),e)})),e.push(...this.edgeItemsCheck(e)),this.observer.updateBatch(e,!this.firstRun),this.firstRun=!1,this},this.first=()=>{var t;return null===(t=this.toArr()[0])||void 0===t?void 0:t[1]},this.last=()=>{var t,e;return null===(e=null===(t=this.toArr().slice(-1))||void 0===t?void 0:t[0])||void 0===e?void 0:e[1]},this.filter=t=>this.toArr().filter(t),this.find=t=>this.toArr().find(t),this.findIndex=t=>this.toArr().findIndex(t),this.getCurrentPos=t=>{const e=this.toArr(),n=e.findIndex((([e,n])=>e===t||n===t));return[e,n]},this.prev=t=>{var e;const[n,o]=this.getCurrentPos(t);return-1!==o?null===(e=n[o-1])||void 0===e?void 0:e[1]:void 0},this.next=t=>{var e;const[n,o]=this.getCurrentPos(t);return-1!==o?null===(e=n[o+1])||void 0===e?void 0:e[1]:void 0},this.getVisible=()=>this.filter((t=>t[1].visible)),this.observer=new Jt,this.firstRun=!0}}const Et=t=>"object"==typeof t&&null!=t&&1===t.nodeType,Mt=(t,e)=>(!e||"hidden"!==t)&&"visible"!==t&&"clip"!==t,mt=(t,e)=>{if(t.clientHeight<t.scrollHeight||t.clientWidth<t.scrollWidth){const n=getComputedStyle(t,null);return Mt(n.overflowY,e)||Mt(n.overflowX,e)||(t=>{const e=(t=>{if(!t.ownerDocument||!t.ownerDocument.defaultView)return null;try{return t.ownerDocument.defaultView.frameElement}catch{return null}})(t);return!!e&&(e.clientHeight<t.scrollHeight||e.clientWidth<t.scrollWidth)})(t)}return!1},ut=(t,e,n,o,r,i,s,l)=>i<t&&s>e||i>t&&s<e?0:i<=t&&l<=n||s>=e&&l>=n?i-t-o:s>e&&l<n||i<t&&l>n?s-e+r:0,Qt=t=>t.parentElement??(t.getRootNode().host||null),It=(t,e)=>{var n,o,r,i;if(typeof document>"u")return[];const{scrollMode:s,block:l,inline:a,boundary:c,skipOverflowHiddenElements:u}=e,d="function"==typeof c?c:t=>t!==c;if(!Et(t))throw new TypeError("Invalid target");const h=document.scrollingElement||document.documentElement,f=[];let m=t;for(;Et(m)&&d(m);){if(m=Qt(m),m===h){f.push(m);break}null!=m&&m===document.body&&mt(m)&&!mt(document.documentElement)||null!=m&&mt(m,u)&&f.push(m)}const v=null!=(o=null==(n=window.visualViewport)?void 0:n.width)?o:innerWidth,p=null!=(i=null==(r=window.visualViewport)?void 0:r.height)?i:innerHeight,{scrollX:b,scrollY:g}=window,{height:y,width:w,top:E,right:M,bottom:x,left:I}=t.getBoundingClientRect(),{top:C,right:k,bottom:T,left:$}=(t=>{const e=window.getComputedStyle(t);return{top:parseFloat(e.scrollMarginTop)||0,right:parseFloat(e.scrollMarginRight)||0,bottom:parseFloat(e.scrollMarginBottom)||0,left:parseFloat(e.scrollMarginLeft)||0}})(t);let S="start"===l||"nearest"===l?E-C:"end"===l?x+T:E+y/2-C+T,N="center"===a?I+w/2-$+k:"end"===a?M+k:I-$;const R=[];for(let j=0;j<f.length;j++){const t=f[j],{height:e,width:n,top:o,right:r,bottom:i,left:c}=t.getBoundingClientRect();if("if-needed"===s&&E>=0&&I>=0&&x<=p&&M<=v&&E>=o&&x<=i&&I>=c&&M<=r)return R;const u=getComputedStyle(t),d=parseInt(u.borderLeftWidth,10),m=parseInt(u.borderTopWidth,10),C=parseInt(u.borderRightWidth,10),k=parseInt(u.borderBottomWidth,10);let T=0,$=0;const V="offsetWidth"in t?t.offsetWidth-t.clientWidth-d-C:0,A="offsetHeight"in t?t.offsetHeight-t.clientHeight-m-k:0,L="offsetWidth"in t?0===t.offsetWidth?0:n/t.offsetWidth:0,W="offsetHeight"in t?0===t.offsetHeight?0:e/t.offsetHeight:0;if(h===t)T="start"===l?S:"end"===l?S-p:"nearest"===l?ut(g,g+p,p,m,k,g+S,g+S+y,y):S-p/2,$="start"===a?N:"center"===a?N-v/2:"end"===a?N-v:ut(b,b+v,v,d,C,b+N,b+N+w,w),T=Math.max(0,T+g),$=Math.max(0,$+b);else{T="start"===l?S-o-m:"end"===l?S-i+k+A:"nearest"===l?ut(o,i,e,m,k+A,S,S+y,y):S-(o+e/2)+A/2,$="start"===a?N-c-d:"center"===a?N-(c+n/2)+V/2:"end"===a?N-r+C+V:ut(c,r,n,d,C+V,N,N+w,w);const{scrollLeft:s,scrollTop:u}=t;T=0===W?0:Math.max(0,Math.min(u+T/W,t.scrollHeight-e/W+A)),$=0===L?0:Math.max(0,Math.min(s+$/L,t.scrollWidth-n/L+V)),S+=u-T,N+=s-$}R.push({el:t,top:T,left:$})}return R};function Ct(t,e){if(!t.isConnected||!(t=>{let e=t;for(;e&&e.parentNode;){if(e.parentNode===document)return!0;e=e.parentNode instanceof ShadowRoot?e.parentNode.host:e.parentNode}return!1})(t))return;const n=(t=>{const e=window.getComputedStyle(t);return{top:parseFloat(e.scrollMarginTop)||0,right:parseFloat(e.scrollMarginRight)||0,bottom:parseFloat(e.scrollMarginBottom)||0,left:parseFloat(e.scrollMarginLeft)||0}})(t);if("object"==typeof(o=e)&&"function"==typeof o.behavior)return e.behavior(It(t,e));var o;const r="boolean"==typeof e||null==e?void 0:e.behavior;for(const{el:l,top:a,left:c}of It(t,(s=void 0,!1===(i=e)?{block:"end",inline:"nearest"}:(s=i)===Object(s)&&0!==Object.keys(s).length?i:{block:"start",inline:"nearest"}))){const t=a-n.top+n.bottom,e=c-n.left+n.right;l.scroll({top:t,left:e,behavior:r})}var i,s}let vt;const Lt=()=>(vt||(vt="performance"in window?performance.now.bind(performance):Date.now),vt());function Vt(t){const e=Lt(),n=Math.min((e-t.startTime)/t.duration,1),o=t.ease(n),r=t.startX+(t.x-t.startX)*o,i=t.startY+(t.y-t.startY)*o;t.method(r,i,n,o),r!==t.x||i!==t.y?requestAnimationFrame((()=>Vt(t))):t.cb()}function Zt(t,e,n){let o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:600,r=arguments.length>4&&void 0!==arguments[4]?arguments[4]:t=>1+--t*t*t*t*t,i=arguments.length>5?arguments[5]:void 0,s=arguments.length>6?arguments[6]:void 0;const l=t,a=t.scrollLeft,c=t.scrollTop;Vt({scrollable:l,method:(e,n,o,r)=>{const i=Math.ceil(e),l=Math.ceil(n);t.scrollLeft=i,t.scrollTop=l,null==s||s({target:t,elapsed:o,value:r,left:i,top:l})},startTime:Lt(),startX:a,startY:c,x:e,y:n,duration:o,ease:r,cb:i})}const Gt=function(t,e){const n=e||{};return(o=n)&&!o.behavior||"smooth"===o.behavior?Ct(t,{block:n.block,inline:n.inline,scrollMode:n.scrollMode,boundary:n.boundary,skipOverflowHiddenElements:n.skipOverflowHiddenElements,behavior:t=>Promise.all(t.reduce(((t,e)=>{let{el:o,left:r,top:i}=e;const s=o.scrollLeft,l=o.scrollTop;return s===r&&l===i?t:[...t,new Promise((t=>Zt(o,r,i,n.duration,n.ease,(()=>t({el:o,left:[s,r],top:[l,i]})),n.onScrollChange)))]}),[]))}):Promise.resolve(Ct(t,e));var o},te=t=>Object.values(t).map((t=>t.current)).filter(Boolean);function pt(t,e,n,o,r,i){var s;const l=(null===(s=null==t?void 0:t.entry)||void 0===s?void 0:s.target)||t;if(!l)return;const a={behavior:e||"smooth",inline:n||"end",block:o||"nearest"};return i?l.scrollIntoView(a):Gt(l,Object.assign(Object.assign({},r),a))}const ee=t=>document.querySelector(`[${jt}='${t}']`),ne=t=>document.querySelector(`[${Tt}='${t}']`);function dt(t){return i.isValidElement(t)&&t||"function"==typeof t&&i.createElement(t,null)||!!t&&"object"==typeof t&&i.createElement(t,null)||null}const $t=t=>{var e;return String((null===(e=null==t?void 0:t.props)||void 0===e?void 0:e[zt])||((null==t?void 0:t.key)||T).replace(/^\.\$/,T))};function bt(t){return!!t&&Object.prototype.hasOwnProperty.call(t,"current")}var re=i.memo((function({children:t,className:e,id:n,index:o,refs:r}){const s=i.useRef(null);return r[String(o)]=s,i.createElement("div",{className:e,[jt]:n,[Tt]:o,ref:s},t)}));function oe({children:t,itemClassName:e=T,refs:n}){const o=i.Children.toArray(t).filter(Boolean),r=i.useMemo((()=>`${Ht} ${e}`),[e]);return o.map(((t,e)=>{const o=$t(t);return i.createElement(re,{className:r,id:o,key:o,refs:n,index:e},t)}))}function se({className:t=T,children:e,onScroll:n=()=>{},scrollRef:o,containerRef:r}){const s=i.useMemo((()=>`${Ut} ${t}`),[t]),l=i.useCallback((t=>{bt(o)?o.current=t:o(t),bt(r)?r.current=t:r(t)}),[o,r]);return i.createElement("div",{className:s,onScroll:n,ref:l},e)}const gt=i.createContext({}),At=typeof window<"u"?i.useLayoutEffect:i.useEffect;function ie({items:t,itemsChanged:e,refs:n,options:o}){const r=i.useRef(),s=i.useCallback((e=>{var n,r;t.setBatch((n=e,r=o,[...n].map((t=>{var e,n,o,i;const s=t.target,l=String(null!==(n=null===(e=null==s?void 0:s.dataset)||void 0===e?void 0:e.key)&&void 0!==n?n:T);return[l,{index:String(null!==(i=null===(o=null==s?void 0:s.dataset)||void 0===o?void 0:o.index)&&void 0!==i?i:T),key:l,entry:t,visible:t.intersectionRatio>=r.ratio}]}))))}),[t,o]);At((()=>{const t=te(n),e=r.current||new IntersectionObserver(s,o);return r.current=e,t.forEach((t=>e.observe(t))),()=>{e.disconnect(),r.current=void 0}}),[s,e,o,n])}const le=t=>i.Children.toArray(t).map($t).filter(Boolean),kt={ratio:.9,rootMargin:"5px",threshold:[.05,.5,.75,.95]},ae={current:{}},ht=()=>{};function ce({LeftArrow:t,RightArrow:e,children:n,Header:o,Footer:r,transitionDuration:s=500,transitionBehavior:l,onInit:a=ht,onUpdate:c=ht,onMouseDown:u,onMouseLeave:d,onMouseUp:h,onMouseMove:f,onScroll:m=ht,onTouchMove:v,onTouchStart:p,onTouchEnd:b,onWheel:g=ht,options:y=kt,scrollContainerClassName:w=T,containerRef:E=qt,itemClassName:M=T,wrapperClassName:x=T,apiRef:I=ae,RTL:C,noPolyfill:k=!0}){const S=dt(t),N=dt(e),R=dt(o),j=dt(r),V=i.useRef(null),[A]=i.useState({}),L=i.useMemo((()=>Object.assign(Object.assign(Object.assign({},kt),y),{root:V.current})),[y]),W=i.useRef(new Kt).current,B=function(t,e){const[n,o]=i.useState(T),r=i.useMemo((()=>le(t)),[t]);return i.useEffect((()=>{const t=r.filter(Boolean).join(T);e.toItems().filter((t=>!r.includes(t))).forEach((t=>{e.delete(t)})),o(t)}),[r,e]),n}(n,W),O=((t,e)=>{const n=i.useRef(!0),o=i.useMemo((()=>[e-.05,e-.01,e,e+.01,e+.05]),[e]),r=i.useCallback((t=>{var o;n.current=(null===(o=null==t?void 0:t[0])||void 0===o?void 0:o.intersectionRatio)>=e}),[e]);return At((()=>{const e=new IntersectionObserver(r,{threshold:o,rootMargin:"0px"});return t.current&&e.observe(t.current),()=>e.disconnect()}),[n,t,r,o]),n})(V,L.ratio+.05<1?L.ratio+.05:.95);ie(i.useMemo((()=>({items:W,itemsChanged:B,options:L,refs:A})),[W,B,A,L]));const H=i.useMemo((()=>function(t,e,n,o){var r,s,l;const a=(e,n=!1)=>{const[o,r]=i.useState(n),s=i.useCallback((t=>{r(!(null==t||!t.visible))}),[]);return i.useEffect((()=>(t.subscribe(e,s),()=>{t.unsubscribe(e,s)})),[e,s]),o},c=!(null===(r=t.first())||void 0===r||!r.visible),u=!(null===(s=t.last())||void 0===s||!s.visible),d=e=>{var n;return null===(n=t.find((t=>t[1].key===String(e))))||void 0===n?void 0:n[1]},h=()=>{var e,n;const o=null===(n=null===(e=t.getVisible())||void 0===e?void 0:e[0])||void 0===n?void 0:n[1];return o?t.prev(o):void 0},f=()=>{var e;const n=null===(e=t.getVisible().findLast((()=>!0)))||void 0===e?void 0:e[1];return n?t.next(n):void 0},m=null===(l=null==n?void 0:n.boundary)||void 0===l?void 0:l.current;return{getItemById:d,getItemElementById:ee,getItemByIndex:e=>{var n;return null===(n=t.find((t=>String(t[1].index)===String(e))))||void 0===n?void 0:n[1]},getItemElementByIndex:ne,getNextElement:f,getPrevElement:h,isFirstItemVisible:c,isItemVisible:e=>t.getVisible().map((t=>t[0])).includes(String(e)),isLastItem:e=>t.last()===d(e),isLastItemVisible:u,scrollNext:(t,e,r,{duration:i,boundary:s=m}={})=>{const l=t??(null==n?void 0:n.behavior);return pt(f(),l,e||"start",r||"nearest",{boundary:s,duration:i??(null==n?void 0:n.duration)},o)},scrollPrev:(t,e,r,{duration:i,boundary:s=m}={})=>{const l=t??(null==n?void 0:n.behavior);return pt(h(),l,e||"end",r||"nearest",{boundary:s,duration:i??(null==n?void 0:n.duration)},o)},useIsVisible:a,useLeftArrowVisible:()=>{const t=a("first",!0),[n,o]=i.useState(t);return i.useEffect((()=>{e.current&&o(t)}),[t]),n},useRightArrowVisible:()=>{const t=a("last",!1),[n,o]=i.useState(t);return i.useEffect((()=>{e.current&&o(t)}),[t]),n},scrollToItem:(t,e,r,i,s)=>{var l;return pt(t,e??(null==n?void 0:n.behavior),r,i,Object.assign(Object.assign({boundary:m},s),{duration:null!==(l=null==s?void 0:s.duration)&&void 0!==l?l:null==n?void 0:n.duration}),o)}}}(W,O,{duration:s,behavior:l,boundary:V},k)),[W,s,l,k,O]),P=i.useCallback((()=>Object.assign(Object.assign({},H),{items:W,scrollContainer:V,menuVisible:O})),[H,W,V,O]),[U,_]=i.useState((()=>P()));(({context:t,onInit:e,onUpdate:n})=>{const o=i.useCallback((()=>e(t)),[e,t]),r=i.useCallback((()=>n(t)),[n,t]),{items:s}=t;i.useEffect((()=>(s.subscribe($.onInit,o),s.subscribe($.onUpdate,r),()=>{s.unsubscribe($.onInit,o),s.unsubscribe($.onUpdate,r)})),[s,o,r])})({context:U,onInit:a,onUpdate:c}),i.useEffect((()=>_(P())),[P]),i.useEffect((()=>{bt(I)?I.current=U:I(U)}),[U,I]);const F=i.useCallback((t=>m(U,t)),[m,U]),D=i.useCallback((t=>g(U,t)),[g,U]),Y=i.useMemo((()=>`${Ft} ${x}`),[x]),X=i.useMemo((()=>`${w}${C?" rtl":T}`),[C,w]);return i.createElement("div",{className:Y,onWheel:D,onMouseDown:null==u?void 0:u(U),onMouseLeave:null==d?void 0:d(U),onMouseUp:null==h?void 0:h(U),onMouseMove:null==f?void 0:f(U),onTouchStart:null==p?void 0:p(U),onTouchMove:null==v?void 0:v(U),onTouchEnd:null==b?void 0:b(U)},i.createElement(gt.Provider,{value:U},i.createElement("div",{className:_t},R),i.createElement("div",{className:Pt},i.createElement("div",{className:Dt},S),i.createElement(se,{className:X,onScroll:F,scrollRef:V,containerRef:E},i.createElement(oe,{refs:A,itemClassName:M},n)),i.createElement("div",{className:Yt},N)),i.createElement("div",{className:Xt},j)))}const ue=()=>{const t=St.useContext(gt),e=t.useLeftArrowVisible();return st.jsx(Nt,{disabled:e,direction:"left",sx:{marginLeft:"10px"},onClick:()=>t.scrollToItem(t.getPrevElement(),"smooth","start")})},de=()=>{const t=St.useContext(gt),e=t.useRightArrowVisible();return st.jsx(Nt,{disabled:e,direction:"right",sx:{marginRight:"10px"},onClick:()=>t.scrollToItem(t.getNextElement(),"smooth","end")})},Rt=({children:t,dataCy:e})=>st.jsx(Ot,{"data-cy":e,sx:{alignSelf:"center",maxWidth:"100%"},children:st.jsx(he,{children:st.jsx(ce,{LeftArrow:ue,RightArrow:de,onWheel:fe,children:t})})}),he=Wt("div")({"& .react-horizontal-scrolling-menu--scroll-container::-webkit-scrollbar":{display:"none"},"& .react-horizontal-scrolling-menu--scroll-container":{scrollbarWidth:"none","-ms-overflow-style":"none"}});function fe(t,e){0!==Math.abs(e.deltaX)||Math.abs(e.deltaY)<15?e.stopPropagation():e.deltaY<0?t.scrollNext():t.scrollPrev()}try{Rt.displayName="VerticalList",Rt.__docgenInfo={description:"",displayName:"VerticalList",props:{dataCy:{defaultValue:null,description:"",name:"dataCy",required:!1,type:{name:"string"}}}}}catch{}export{Rt as V};