"use strict";(self.webpackChunkoa_docs=self.webpackChunkoa_docs||[]).push([[545],{3905:(e,t,r)=>{r.d(t,{Zo:()=>p,kt:()=>d});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function i(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var s=n.createContext({}),c=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):l(l({},t),e)),r},p=function(e){var t=c(e.components);return n.createElement(s.Provider,{value:t},e.children)},u="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},f=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,s=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),u=c(r),f=a,d=u["".concat(s,".").concat(f)]||u[f]||m[f]||o;return r?n.createElement(d,l(l({ref:t},p),{},{components:r})):n.createElement(d,l({ref:t},p))}));function d(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,l=new Array(o);l[0]=f;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i[u]="string"==typeof e?e:a,l[1]=i;for(var c=2;c<o;c++)l[c]=r[c];return n.createElement.apply(null,l)}return n.createElement.apply(null,r)}f.displayName="MDXCreateElement"},1767:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>s,contentTitle:()=>l,default:()=>m,frontMatter:()=>o,metadata:()=>i,toc:()=>c});var n=r(7462),a=(r(7294),r(3905));const o={id:"rollback",title:"Rollback a Release"},l=void 0,i={unversionedId:"Maintainers/rollback",id:"Maintainers/rollback",title:"Rollback a Release",description:"As a maintainer, you may need to rollback a release if a deployment has gone wrong or if there are issues with the site. This document outlines the steps to rollback a release.",source:"@site/docs/Maintainers/Rollback.md",sourceDirName:"Maintainers",slug:"/Maintainers/rollback",permalink:"/Maintainers/rollback",draft:!1,editUrl:"https://github.com/ONEARMY/community-platform/edit/master/packages/documentation/docs/Maintainers/Rollback.md",tags:[],version:"current",frontMatter:{id:"rollback",title:"Rollback a Release"}},s={},c=[],p={toc:c},u="wrapper";function m(e){let{components:t,...r}=e;return(0,a.kt)(u,(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"As a maintainer, you may need to rollback a release if a deployment has gone wrong or if there are issues with the site. This document outlines the steps to rollback a release."),(0,a.kt)("p",null,"Note: Do not use the Firebase UI to do this for hosting, as it will not rollback our serverless functions."),(0,a.kt)("p",null,"Use the CircleCI to perform the rollback deployment so that we go through the same steps as a normal deployment."),(0,a.kt)("ol",null,(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("p",{parentName:"li"},"Access CircleCI Build Pipelines:"),(0,a.kt)("ul",{parentName:"li"},(0,a.kt)("li",{parentName:"ul"},"Navigate to the CircleCI build pipelines interface."))),(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("p",{parentName:"li"},"Locate the Desired Release:"),(0,a.kt)("ul",{parentName:"li"},(0,a.kt)("li",{parentName:"ul"},"Use the search function to find the specific release you want to rollback to."),(0,a.kt)("li",{parentName:"ul"},"Click on the corresponding build number to view its details."))),(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("p",{parentName:"li"},"Access Workflow View:"),(0,a.kt)("ul",{parentName:"li"},(0,a.kt)("li",{parentName:"ul"},"Once on the build details page, switch to the workflow view."))),(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("p",{parentName:"li"},"Initiate Rerun:"),(0,a.kt)("ul",{parentName:"li"},(0,a.kt)("li",{parentName:"ul"},"Identify the workflow corresponding to the release you wish to rollback to."),(0,a.kt)("li",{parentName:"ul"},'Click on the "Rerun" button associated with this workflow.'),(0,a.kt)("li",{parentName:"ul"},'From the options presented, select "Rerun workflow from start".'))),(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("p",{parentName:"li"},"Optional: Selective Deployment:"),(0,a.kt)("ul",{parentName:"li"},(0,a.kt)("li",{parentName:"ul"},"If you don't intend to deploy to all production environments, you have the option to cancel specific jobs after they've started.")))),(0,a.kt)("p",null,"By following these steps, you can effectively rollback a release in your deployment pipeline using CircleCI."))}m.isMDXComponent=!0}}]);