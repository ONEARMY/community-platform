import{j as e}from"./jsx-runtime-CexXSJP5.js";import{C as b,a as j,F as u}from"./theme-ui-components.esm-DCiJ1mMX.js";import{a as S,T,t as x,c as v,b as F}from"./TabsList-DhTEw6FA.js";import{n as g}from"./emotion-styled.browser.esm-Dz2BNYeh.js";import{I as C}from"./Icon-CpKwKOZA.js";import{I}from"./InternalLink-CtyTe3gy.js";import{S as w}from"./Select-vDnhT3MJ.js";import{u as L,a as N,m as V}from"./index-BXxqJQdV.js";import{r as y}from"./index-BP8_t0zE.js";function $(e){return y.forwardRef((function(t,r){const{ownerState:n,...a}=t;return y.createElement(e,{...a,ref:r})}))}const m=t=>{const{tab:r,value:n}=t,{body:a,header:s,notifications:o}=r,l={borderRadius:3,marginBottom:4,padding:[2,4],overflow:"visible"};return e.jsxs(S,{value:n,style:{display:"flex",flexDirection:"column",alignSelf:"stretch"},children:[s&&e.jsx(b,{sx:{...l,backgroundColor:"softblue",padding:[3,5]},children:s}),o&&e.jsx(j,{sx:{...l,padding:0},children:o}),e.jsx(b,{sx:l,children:a})]})};try{m.displayName="SettingsFormTab",m.__docgenInfo={description:"",displayName:"SettingsFormTab",props:{tab:{defaultValue:null,description:"",name:"tab",required:!0,type:{name:"ITab"}},value:{defaultValue:null,description:"",name:"value",required:!0,type:{name:"string"}}}}}catch{}const d=e=>`/settings/${e.toLowerCase()}`,f=t=>{var r;const{currentTab:n,tabs:a}=t,s=L(),o=g(T)`
    color: grey;
    cursor: pointer;
    background-color: transparent;
    padding: 12px 18px;
    border: none;
    border-radius: 12px;
    display: flex;
    gap: 8px;
    justify-content: flex-start;
    font-size: 18px;
    font-family: Varela round;
    align-items: center;

    &:hover {
      background-color: white;
    }

    &:focus {
      border: 2px solid #666;
    }

    &.${x.disabled} {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &.${x.selected} {
      color: #1b1b1b;
      border: 2px solid #1b1b1b;
      background-color: #e2edf7;
    }
  `,l=g(v)`
    width: 100%;
    display: flex;
    gap: 12px;
    flex-direction: column;
    justify-content: flex-start;
    align-content: flex-start;
  `;if(1===a.length)return;const i={label:(null==(r=a.find((({title:e})=>d(e)===n)))?void 0:r.title)||"",value:n};return e.jsxs(e.Fragment,{children:[e.jsx(u,{sx:{display:["none","flex"]},children:e.jsx(l,{children:a.map((({glyph:t,title:r},n)=>e.jsxs(o,{to:d(r),value:d(r),"data-cy":`tab-${r}`,slots:{root:$(I)},children:[e.jsx(C,{glyph:t,size:20})," ",r]},n)))})}),e.jsx(u,{sx:{display:["flex","none"]},children:e.jsx(l,{children:e.jsx(w,{defaultValue:i,onChange:e=>s(e.value),variant:"tabs",options:a.map((({title:e})=>({label:e,value:d(e)})))})})})]})};try{f.displayName="SettingsFormTabList",f.__docgenInfo={description:"",displayName:"SettingsFormTabList",props:{currentTab:{defaultValue:null,description:"",name:"currentTab",required:!0,type:{name:"string"}},tabs:{defaultValue:null,description:"",name:"tabs",required:!0,type:{name:"ITab[]"}}}}}catch{}const q=e=>{const{pathname:t}=N();for(const r of e){const e=V(r,t);if(null!==e)return e}return null},h=t=>{var r;const{style:n,tabs:a}=t,s=a.map((({title:e})=>d(e))),o=q(s),l=(null==(r=null==o?void 0:o.pattern)?void 0:r.path)||s[0];return e.jsx(F,{value:l,style:n,children:e.jsxs(u,{sx:{alignContent:"stretch",alignSelf:"stretch",justifyContent:"stretch",flexDirection:["column","row"],gap:4},children:[e.jsx(f,{tabs:a,currentTab:l}),e.jsx(u,{sx:{alignContent:"stretch",justifyContent:"stretch",flexDirection:"column",flex:1},children:a.map(((t,r)=>e.jsx(m,{value:d(t.title),tab:t},r)))})]})})};try{h.displayName="SettingsFormWrapper",h.__docgenInfo={description:"",displayName:"SettingsFormWrapper",props:{tabs:{defaultValue:null,description:"",name:"tabs",required:!0,type:{name:"ITab[]"}},style:{defaultValue:null,description:"",name:"style",required:!1,type:{name:"CSSProperties"}}}}}catch{}export{h as S};