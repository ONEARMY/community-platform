const Wt=["top","right","bottom","left"],j=Math.min,R=Math.max,it=Math.round,nt=Math.floor,k=t=>({x:t,y:t}),Ht={left:"right",right:"left",bottom:"top",top:"bottom"},Bt={start:"end",end:"start"};function at(t,e,n){return R(t,j(e,n))}function N(t,e){return"function"==typeof t?t(e):t}function V(t){return t.split("-")[0]}function J(t){return t.split("-")[1]}function mt(t){return"x"===t?"y":"x"}function ht(t){return"y"===t?"height":"width"}function Y(t){return["top","bottom"].includes(V(t))?"y":"x"}function gt(t){return mt(Y(t))}function Nt(t,e,n){void 0===n&&(n=!1);const o=J(t),i=gt(t),r=ht(i);let l="x"===i?o===(n?"end":"start")?"right":"left":"start"===o?"bottom":"top";return e.reference[r]>e.floating[r]&&(l=ot(l)),[l,ot(l)]}function Vt(t){const e=ot(t);return[ut(t),e,ut(e)]}function ut(t){return t.replace(/start|end/g,(t=>Bt[t]))}function $t(t,e,n){const o=["left","right"],i=["right","left"],r=["top","bottom"],l=["bottom","top"];switch(t){case"top":case"bottom":return n?e?i:o:e?o:i;case"left":case"right":return e?r:l;default:return[]}}function zt(t,e,n,o){const i=J(t);let r=$t(V(t),"start"===n,o);return i&&(r=r.map((t=>t+"-"+i)),e&&(r=r.concat(r.map(ut)))),r}function ot(t){return t.replace(/left|right|bottom|top/g,(t=>Ht[t]))}function _t(t){return{top:0,right:0,bottom:0,left:0,...t}}function Tt(t){return"number"!=typeof t?_t(t):{top:t,right:t,bottom:t,left:t}}function st(t){const{x:e,y:n,width:o,height:i}=t;return{width:o,height:i,top:n,left:e,right:e+o,bottom:n+i,x:e,y:n}}function vt(t,e,n){let{reference:o,floating:i}=t;const r=Y(e),l=gt(e),c=ht(l),s=V(e),a="y"===r,f=o.x+o.width/2-i.width/2,u=o.y+o.height/2-i.height/2,d=o[c]/2-i[c]/2;let h;switch(s){case"top":h={x:f,y:o.y-i.height};break;case"bottom":h={x:f,y:o.y+o.height};break;case"right":h={x:o.x+o.width,y:u};break;case"left":h={x:o.x-i.width,y:u};break;default:h={x:o.x,y:o.y}}switch(J(e)){case"start":h[l]-=d*(n&&a?-1:1);break;case"end":h[l]+=d*(n&&a?-1:1)}return h}const It=async(t,e,n)=>{const{placement:o="bottom",strategy:i="absolute",middleware:r=[],platform:l}=n,c=r.filter(Boolean),s=await(null==l.isRTL?void 0:l.isRTL(e));let a=await l.getElementRects({reference:t,floating:e,strategy:i}),{x:f,y:u}=vt(a,o,s),d=o,h={},m=0;for(let p=0;p<c.length;p++){const{name:n,fn:r}=c[p],{x:g,y:y,data:w,reset:x}=await r({x:f,y:u,initialPlacement:o,placement:d,strategy:i,middlewareData:h,rects:a,platform:l,elements:{reference:t,floating:e}});f=g??f,u=y??u,h={...h,[n]:{...h[n],...w}},x&&m<=50&&(m++,"object"==typeof x&&(x.placement&&(d=x.placement),x.rects&&(a=!0===x.rects?await l.getElementRects({reference:t,floating:e,strategy:i}):x.rects),({x:f,y:u}=vt(a,d,s))),p=-1)}return{x:f,y:u,placement:d,strategy:i,middlewareData:h}};async function Z(t,e){var n;void 0===e&&(e={});const{x:o,y:i,platform:r,rects:l,elements:c,strategy:s}=t,{boundary:a="clippingAncestors",rootBoundary:f="viewport",elementContext:u="floating",altBoundary:d=!1,padding:h=0}=N(e,t),m=Tt(h),p=c[d?"floating"===u?"reference":"floating":u],g=st(await r.getClippingRect({element:null==(n=await(null==r.isElement?void 0:r.isElement(p)))||n?p:p.contextElement||await(null==r.getDocumentElement?void 0:r.getDocumentElement(c.floating)),boundary:a,rootBoundary:f,strategy:s})),y="floating"===u?{x:o,y:i,width:l.floating.width,height:l.floating.height}:l.reference,w=await(null==r.getOffsetParent?void 0:r.getOffsetParent(c.floating)),x=await(null==r.isElement?void 0:r.isElement(w))&&await(null==r.getScale?void 0:r.getScale(w))||{x:1,y:1},v=st(r.convertOffsetParentRelativeRectToViewportRelativeRect?await r.convertOffsetParentRelativeRectToViewportRelativeRect({elements:c,rect:y,offsetParent:w,strategy:s}):y);return{top:(g.top-v.top+m.top)/x.y,bottom:(v.bottom-g.bottom+m.bottom)/x.y,left:(g.left-v.left+m.left)/x.x,right:(v.right-g.right+m.right)/x.x}}const jt=t=>({name:"arrow",options:t,async fn(e){const{x:n,y:o,placement:i,rects:r,platform:l,elements:c,middlewareData:s}=e,{element:a,padding:f=0}=N(t,e)||{};if(null==a)return{};const u=Tt(f),d={x:n,y:o},h=gt(i),m=ht(h),p=await l.getDimensions(a),g="y"===h,y=g?"top":"left",w=g?"bottom":"right",x=g?"clientHeight":"clientWidth",v=r.reference[m]+r.reference[h]-d[h]-r.floating[m],b=d[h]-r.reference[h],R=await(null==l.getOffsetParent?void 0:l.getOffsetParent(a));let L=R?R[x]:0;(!L||!await(null==l.isElement?void 0:l.isElement(R)))&&(L=c.floating[x]||r.floating[m]);const A=v/2-b/2,T=L/2-p[m]/2-1,C=j(u[y],T),S=j(u[w],T),E=C,D=L-p[m]-S,k=L/2-p[m]/2+A,O=at(E,k,D),F=!s.arrow&&null!=J(i)&&k!==O&&r.reference[m]/2-(k<E?C:S)-p[m]/2<0,W=F?k<E?k-E:k-D:0;return{[h]:d[h]+W,data:{[h]:O,centerOffset:k-O-W,...F&&{alignmentOffset:W}},reset:F}}}),Yt=function(t){return void 0===t&&(t={}),{name:"flip",options:t,async fn(e){var n,o;const{placement:i,middlewareData:r,rects:l,initialPlacement:c,platform:s,elements:a}=e,{mainAxis:f=!0,crossAxis:u=!0,fallbackPlacements:d,fallbackStrategy:h="bestFit",fallbackAxisSideDirection:m="none",flipAlignment:p=!0,...g}=N(t,e);if(null!=(n=r.arrow)&&n.alignmentOffset)return{};const y=V(i),w=Y(c),x=V(c)===c,v=await(null==s.isRTL?void 0:s.isRTL(a.floating)),b=d||(x||!p?[ot(c)]:Vt(c)),R="none"!==m;!d&&R&&b.push(...zt(c,p,m,v));const L=[c,...b],A=await Z(e,g),T=[];let C=(null==(o=r.flip)?void 0:o.overflows)||[];if(f&&T.push(A[y]),u){const t=Nt(i,l,v);T.push(A[t[0]],A[t[1]])}if(C=[...C,{placement:i,overflows:T}],!T.every((t=>t<=0))){var S,E;const t=((null==(S=r.flip)?void 0:S.index)||0)+1,e=L[t];if(e)return{data:{index:t,overflows:C},reset:{placement:e}};let n=null==(E=C.filter((t=>t.overflows[0]<=0)).sort(((t,e)=>t.overflows[1]-e.overflows[1]))[0])?void 0:E.placement;if(!n)switch(h){case"bestFit":{var D;const t=null==(D=C.filter((t=>{if(R){const e=Y(t.placement);return e===w||"y"===e}return!0})).map((t=>[t.placement,t.overflows.filter((t=>t>0)).reduce(((t,e)=>t+e),0)])).sort(((t,e)=>t[1]-e[1]))[0])?void 0:D[0];t&&(n=t);break}case"initialPlacement":n=c}if(i!==n)return{reset:{placement:n}}}return{}}}};function bt(t,e){return{top:t.top-e.height,right:t.right-e.width,bottom:t.bottom-e.height,left:t.left-e.width}}function At(t){return Wt.some((e=>t[e]>=0))}const Xt=function(t){return void 0===t&&(t={}),{name:"hide",options:t,async fn(e){const{rects:n}=e,{strategy:o="referenceHidden",...i}=N(t,e);switch(o){case"referenceHidden":{const t=bt(await Z(e,{...i,elementContext:"reference"}),n.reference);return{data:{referenceHiddenOffsets:t,referenceHidden:At(t)}}}case"escaped":{const t=bt(await Z(e,{...i,altBoundary:!0}),n.floating);return{data:{escapedOffsets:t,escaped:At(t)}}}default:return{}}}}};async function qt(t,e){const{placement:n,platform:o,elements:i}=t,r=await(null==o.isRTL?void 0:o.isRTL(i.floating)),l=V(n),c=J(n),s="y"===Y(n),a=["left","top"].includes(l)?-1:1,f=r&&s?-1:1,u=N(e,t);let{mainAxis:d,crossAxis:h,alignmentAxis:m}="number"==typeof u?{mainAxis:u,crossAxis:0,alignmentAxis:null}:{mainAxis:u.mainAxis||0,crossAxis:u.crossAxis||0,alignmentAxis:u.alignmentAxis};return c&&"number"==typeof m&&(h="end"===c?-1*m:m),s?{x:h*f,y:d*a}:{x:d*a,y:h*f}}const Ut=function(t){return void 0===t&&(t=0),{name:"offset",options:t,async fn(e){var n,o;const{x:i,y:r,placement:l,middlewareData:c}=e,s=await qt(e,t);return l===(null==(n=c.offset)?void 0:n.placement)&&null!=(o=c.arrow)&&o.alignmentOffset?{}:{x:i+s.x,y:r+s.y,data:{...s,placement:l}}}}},Kt=function(t){return void 0===t&&(t={}),{name:"shift",options:t,async fn(e){const{x:n,y:o,placement:i}=e,{mainAxis:r=!0,crossAxis:l=!1,limiter:c={fn:t=>{let{x:e,y:n}=t;return{x:e,y:n}}},...s}=N(t,e),a={x:n,y:o},f=await Z(e,s),u=Y(V(i)),d=mt(u);let h=a[d],m=a[u];if(r){const t="y"===d?"bottom":"right";h=at(h+f["y"===d?"top":"left"],h,h-f[t])}if(l){const t="y"===u?"bottom":"right";m=at(m+f["y"===u?"top":"left"],m,m-f[t])}const p=c.fn({...e,[d]:h,[u]:m});return{...p,data:{x:p.x-n,y:p.y-o,enabled:{[d]:r,[u]:l}}}}}},Gt=function(t){return void 0===t&&(t={}),{options:t,fn(e){const{x:n,y:o,placement:i,rects:r,middlewareData:l}=e,{offset:c=0,mainAxis:s=!0,crossAxis:a=!0}=N(t,e),f={x:n,y:o},u=Y(i),d=mt(u);let h=f[d],m=f[u];const p=N(c,e),g="number"==typeof p?{mainAxis:p,crossAxis:0}:{mainAxis:0,crossAxis:0,...p};if(s){const t="y"===d?"height":"width",e=r.reference[d]-r.floating[t]+g.mainAxis,n=r.reference[d]+r.reference[t]-g.mainAxis;h<e?h=e:h>n&&(h=n)}if(a){var y,w;const t="y"===d?"width":"height",e=["top","left"].includes(V(i)),n=r.reference[u]-r.floating[t]+(e&&(null==(y=l.offset)?void 0:y[u])||0)+(e?0:g.crossAxis),o=r.reference[u]+r.reference[t]+(e?0:(null==(w=l.offset)?void 0:w[u])||0)-(e?g.crossAxis:0);m<n?m=n:m>o&&(m=o)}return{[d]:h,[u]:m}}}},Jt=function(t){return void 0===t&&(t={}),{name:"size",options:t,async fn(e){var n,o;const{placement:i,rects:r,platform:l,elements:c}=e,{apply:s=()=>{},...a}=N(t,e),f=await Z(e,a),u=V(i),d=J(i),h="y"===Y(i),{width:m,height:p}=r.floating;let g,y;"top"===u||"bottom"===u?(g=u,y=d===(await(null==l.isRTL?void 0:l.isRTL(c.floating))?"start":"end")?"left":"right"):(y=u,g="end"===d?"top":"bottom");const w=p-f.top-f.bottom,x=m-f.left-f.right,v=j(p-f[g],w),b=j(m-f[y],x),L=!e.middlewareData.shift;let A=v,T=b;if(null!=(n=e.middlewareData.shift)&&n.enabled.x&&(T=x),null!=(o=e.middlewareData.shift)&&o.enabled.y&&(A=w),L&&!d){const t=R(f.left,0),e=R(f.right,0),n=R(f.top,0),o=R(f.bottom,0);h?T=m-2*(0!==t||0!==e?t+e:R(f.left,f.right)):A=p-2*(0!==n||0!==o?n+o:R(f.top,f.bottom))}await s({...e,availableWidth:T,availableHeight:A});const C=await l.getDimensions(c.floating);return m!==C.width||p!==C.height?{reset:{rects:!0}}:{}}}};function rt(){return typeof window<"u"}function Q(t){return Et(t)?(t.nodeName||"").toLowerCase():"#document"}function C(t){var e;return(null==t||null==(e=t.ownerDocument)?void 0:e.defaultView)||window}function W(t){var e;return null==(e=(Et(t)?t.ownerDocument:t.document)||window.document)?void 0:e.documentElement}function Et(t){return!!rt()&&(t instanceof Node||t instanceof C(t).Node)}function L(t){return!!rt()&&(t instanceof Element||t instanceof C(t).Element)}function F(t){return!!rt()&&(t instanceof HTMLElement||t instanceof C(t).HTMLElement)}function Ot(t){return!(!rt()||typeof ShadowRoot>"u")&&(t instanceof ShadowRoot||t instanceof C(t).ShadowRoot)}function et(t){const{overflow:e,overflowX:n,overflowY:o,display:i}=S(t);return/auto|scroll|overlay|hidden|clip/.test(e+o+n)&&!["inline","contents"].includes(i)}function Qt(t){return["table","td","th"].includes(Q(t))}function ct(t){return[":popover-open",":modal"].some((e=>{try{return t.matches(e)}catch{return!1}}))}function pt(t){const e=xt(),n=L(t)?S(t):t;return"none"!==n.transform||"none"!==n.perspective||!!n.containerType&&"normal"!==n.containerType||!e&&!!n.backdropFilter&&"none"!==n.backdropFilter||!e&&!!n.filter&&"none"!==n.filter||["transform","perspective","filter"].some((t=>(n.willChange||"").includes(t)))||["paint","layout","strict","content"].some((t=>(n.contain||"").includes(t)))}function Zt(t){let e=X(t);for(;F(e)&&!G(e);){if(pt(e))return e;if(ct(e))return null;e=X(e)}return null}function xt(){return!(typeof CSS>"u"||!CSS.supports)&&CSS.supports("-webkit-backdrop-filter","none")}function G(t){return["html","body","#document"].includes(Q(t))}function S(t){return C(t).getComputedStyle(t)}function lt(t){return L(t)?{scrollLeft:t.scrollLeft,scrollTop:t.scrollTop}:{scrollLeft:t.scrollX,scrollTop:t.scrollY}}function X(t){if("html"===Q(t))return t;const e=t.assignedSlot||t.parentNode||Ot(t)&&t.host||W(t);return Ot(e)?e.host:e}function Lt(t){const e=X(t);return G(e)?t.ownerDocument?t.ownerDocument.body:t.body:F(e)&&et(e)?e:Lt(e)}function tt(t,e,n){var o;void 0===e&&(e=[]),void 0===n&&(n=!0);const i=Lt(t),r=i===(null==(o=t.ownerDocument)?void 0:o.body),l=C(i);if(r){const t=dt(l);return e.concat(l,l.visualViewport||[],et(i)?i:[],t&&n?tt(t):[])}return e.concat(i,tt(i,[],n))}function dt(t){return t.parent&&Object.getPrototypeOf(t.parent)?t.frameElement:null}function St(t){const e=S(t);let n=parseFloat(e.width)||0,o=parseFloat(e.height)||0;const i=F(t),r=i?t.offsetWidth:n,l=i?t.offsetHeight:o,c=it(n)!==r||it(o)!==l;return c&&(n=r,o=l),{width:n,height:o,$:c}}function wt(t){return L(t)?t:t.contextElement}function K(t){const e=wt(t);if(!F(e))return k(1);const n=e.getBoundingClientRect(),{width:o,height:i,$:r}=St(e);let l=(r?it(n.width):n.width)/o,c=(r?it(n.height):n.height)/i;return(!l||!Number.isFinite(l))&&(l=1),(!c||!Number.isFinite(c))&&(c=1),{x:l,y:c}}const te=k(0);function Dt(t){const e=C(t);return xt()&&e.visualViewport?{x:e.visualViewport.offsetLeft,y:e.visualViewport.offsetTop}:te}function ee(t,e,n){return void 0===e&&(e=!1),!(!n||e&&n!==C(t))&&e}function q(t,e,n,o){void 0===e&&(e=!1),void 0===n&&(n=!1);const i=t.getBoundingClientRect(),r=wt(t);let l=k(1);e&&(o?L(o)&&(l=K(o)):l=K(t));const c=ee(r,n,o)?Dt(r):k(0);let s=(i.left+c.x)/l.x,a=(i.top+c.y)/l.y,f=i.width/l.x,u=i.height/l.y;if(r){const t=C(r),e=o&&L(o)?C(o):o;let n=t,i=dt(n);for(;i&&o&&e!==n;){const t=K(i),e=i.getBoundingClientRect(),o=S(i),r=e.left+(i.clientLeft+parseFloat(o.paddingLeft))*t.x,l=e.top+(i.clientTop+parseFloat(o.paddingTop))*t.y;s*=t.x,a*=t.y,f*=t.x,u*=t.y,s+=r,a+=l,n=C(i),i=dt(n)}}return st({width:f,height:u,x:s,y:a})}function yt(t,e){const n=lt(t).scrollLeft;return e?e.left+n:q(W(t)).left+n}function Pt(t,e,n){void 0===n&&(n=!1);const o=t.getBoundingClientRect();return{x:o.left+e.scrollLeft-(n?0:yt(t,o)),y:o.top+e.scrollTop}}function ne(t){let{elements:e,rect:n,offsetParent:o,strategy:i}=t;const r="fixed"===i,l=W(o),c=!!e&&ct(e.floating);if(o===l||c&&r)return n;let s={scrollLeft:0,scrollTop:0},a=k(1);const f=k(0),u=F(o);if((u||!u&&!r)&&(("body"!==Q(o)||et(l))&&(s=lt(o)),F(o))){const t=q(o);a=K(o),f.x=t.x+o.clientLeft,f.y=t.y+o.clientTop}const d=!l||u||r?k(0):Pt(l,s,!0);return{width:n.width*a.x,height:n.height*a.y,x:n.x*a.x-s.scrollLeft*a.x+f.x+d.x,y:n.y*a.y-s.scrollTop*a.y+f.y+d.y}}function ie(t){return Array.from(t.getClientRects())}function oe(t){const e=W(t),n=lt(t),o=t.ownerDocument.body,i=R(e.scrollWidth,e.clientWidth,o.scrollWidth,o.clientWidth),r=R(e.scrollHeight,e.clientHeight,o.scrollHeight,o.clientHeight);let l=-n.scrollLeft+yt(t);const c=-n.scrollTop;return"rtl"===S(o).direction&&(l+=R(e.clientWidth,o.clientWidth)-i),{width:i,height:r,x:l,y:c}}function se(t,e){const n=C(t),o=W(t),i=n.visualViewport;let r=o.clientWidth,l=o.clientHeight,c=0,s=0;if(i){r=i.width,l=i.height;const t=xt();(!t||t&&"fixed"===e)&&(c=i.offsetLeft,s=i.offsetTop)}return{width:r,height:l,x:c,y:s}}function re(t,e){const n=q(t,!0,"fixed"===e),o=n.top+t.clientTop,i=n.left+t.clientLeft,r=F(t)?K(t):k(1);return{width:t.clientWidth*r.x,height:t.clientHeight*r.y,x:i*r.x,y:o*r.y}}function Rt(t,e,n){let o;if("viewport"===e)o=se(t,n);else if("document"===e)o=oe(W(t));else if(L(e))o=re(e,n);else{const n=Dt(t);o={x:e.x-n.x,y:e.y-n.y,width:e.width,height:e.height}}return st(o)}function Mt(t,e){const n=X(t);return!(n===e||!L(n)||G(n))&&("fixed"===S(n).position||Mt(n,e))}function ce(t,e){const n=e.get(t);if(n)return n;let o=tt(t,[],!1).filter((t=>L(t)&&"body"!==Q(t))),i=null;const r="fixed"===S(t).position;let l=r?X(t):t;for(;L(l)&&!G(l);){const e=S(l),n=pt(l);!n&&"fixed"===e.position&&(i=null),(r?!n&&!i:!n&&"static"===e.position&&i&&["absolute","fixed"].includes(i.position)||et(l)&&!n&&Mt(t,l))?o=o.filter((t=>t!==l)):i=e,l=X(l)}return e.set(t,o),o}function le(t){let{element:e,boundary:n,rootBoundary:o,strategy:i}=t;const r=[..."clippingAncestors"===n?ct(e)?[]:ce(e,this._c):[].concat(n),o],l=r[0],c=r.reduce(((t,n)=>{const o=Rt(e,n,i);return t.top=R(o.top,t.top),t.right=j(o.right,t.right),t.bottom=j(o.bottom,t.bottom),t.left=R(o.left,t.left),t}),Rt(e,l,i));return{width:c.right-c.left,height:c.bottom-c.top,x:c.left,y:c.top}}function fe(t){const{width:e,height:n}=St(t);return{width:e,height:n}}function ae(t,e,n){const o=F(e),i=W(e),r="fixed"===n,l=q(t,!0,r,e);let c={scrollLeft:0,scrollTop:0};const s=k(0);if(o||!o&&!r)if(("body"!==Q(e)||et(i))&&(c=lt(e)),o){const t=q(e,!0,r,e);s.x=t.x+e.clientLeft,s.y=t.y+e.clientTop}else i&&(s.x=yt(i));const a=!i||o||r?k(0):Pt(i,c);return{x:l.left+c.scrollLeft-s.x-a.x,y:l.top+c.scrollTop-s.y-a.y,width:l.width,height:l.height}}function ft(t){return"static"===S(t).position}function Ct(t,e){if(!F(t)||"fixed"===S(t).position)return null;if(e)return e(t);let n=t.offsetParent;return W(t)===n&&(n=n.ownerDocument.body),n}function kt(t,e){const n=C(t);if(ct(t))return n;if(!F(t)){let e=X(t);for(;e&&!G(e);){if(L(e)&&!ft(e))return e;e=X(e)}return n}let o=Ct(t,e);for(;o&&Qt(o)&&ft(o);)o=Ct(o,e);return o&&G(o)&&ft(o)&&!pt(o)?n:o||Zt(t)||n}const ue=async function(t){const e=this.getOffsetParent||kt,n=this.getDimensions,o=await n(t.floating);return{reference:ae(t.reference,await e(t.floating),t.strategy),floating:{x:0,y:0,width:o.width,height:o.height}}};function de(t){return"rtl"===S(t).direction}const me={convertOffsetParentRelativeRectToViewportRelativeRect:ne,getDocumentElement:W,getClippingRect:le,getOffsetParent:kt,getElementRects:ue,getClientRects:ie,getDimensions:fe,getScale:K,isElement:L,isRTL:de};function he(t,e){let n,o=null;const i=W(t);function r(){var t;clearTimeout(n),null==(t=o)||t.disconnect(),o=null}return function l(c,s){void 0===c&&(c=!1),void 0===s&&(s=1),r();const{left:a,top:f,width:u,height:d}=t.getBoundingClientRect();if(c||e(),!u||!d)return;const h={rootMargin:-nt(f)+"px "+-nt(i.clientWidth-(a+u))+"px "+-nt(i.clientHeight-(f+d))+"px "+-nt(a)+"px",threshold:R(0,j(1,s))||1};let m=!0;function p(t){const e=t[0].intersectionRatio;if(e!==s){if(!m)return l();e?l(!1,e):n=setTimeout((()=>{l(!1,1e-7)}),1e3)}m=!1}try{o=new IntersectionObserver(p,{...h,root:i.ownerDocument})}catch{o=new IntersectionObserver(p,h)}o.observe(t)}(!0),r}function ge(t,e,n,o){void 0===o&&(o={});const{ancestorScroll:i=!0,ancestorResize:r=!0,elementResize:l="function"==typeof ResizeObserver,layoutShift:c="function"==typeof IntersectionObserver,animationFrame:s=!1}=o,a=wt(t),f=i||r?[...a?tt(a):[],...tt(e)]:[];f.forEach((t=>{i&&t.addEventListener("scroll",n,{passive:!0}),r&&t.addEventListener("resize",n)}));const u=a&&c?he(a,n):null;let d=-1,h=null;l&&(h=new ResizeObserver((t=>{let[o]=t;o&&o.target===a&&h&&(h.unobserve(e),cancelAnimationFrame(d),d=requestAnimationFrame((()=>{var t;null==(t=h)||t.observe(e)}))),n()})),a&&!s&&h.observe(a),h.observe(e));let m,p=s?q(t):null;return s&&function e(){const o=q(t);p&&(o.x!==p.x||o.y!==p.y||o.width!==p.width||o.height!==p.height)&&n(),p=o,m=requestAnimationFrame(e)}(),n(),()=>{var t;f.forEach((t=>{i&&t.removeEventListener("scroll",n),r&&t.removeEventListener("resize",n)})),null==u||u(),null==(t=h)||t.disconnect(),h=null,s&&cancelAnimationFrame(m)}}const pe=Ut,xe=Kt,we=Yt,ye=Jt,ve=Xt,be=jt,Ae=Gt,Oe=(t,e,n)=>{const o=new Map,i={platform:me,...n},r={...i.platform,_c:o};return It(t,e,{...i,platform:r})};export{ge as a,be as b,Oe as c,ye as d,we as f,ve as h,Ae as l,pe as o,xe as s};