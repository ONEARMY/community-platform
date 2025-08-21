import{r as m,j as e,l as T,y as j,z as S}from"./iframe-DjDkPjnD.js";import{C as x,a as v,F as u}from"./theme-ui-components.esm-CmvYgbc6.js";import{T as w,a as C,t as f,b as I,c as F}from"./TabsList-DysXHJhZ.js";import{n as b}from"./emotion-styled.browser.esm-D4U6xvSk.js";import{I as L}from"./Icon-c__Q-DQ1.js";import{I as R}from"./InternalLink-Bk57RqK-.js";import{S as $}from"./Select-BvOC6ald.js";function q(e){return m.forwardRef((function(t,r){const{ownerState:s,...n}=t;return m.createElement(e,{...n,ref:r})}))}const g=t=>{const{tab:r,value:s}=t,{body:n,header:a,notifications:o}=r,i={borderRadius:3,marginBottom:4,padding:[2,4],overflow:"visible"};return e.jsxs(w,{value:s,style:{display:"flex",flexDirection:"column",alignSelf:"stretch"},children:[a&&e.jsx(x,{sx:{...i,backgroundColor:"softblue",padding:[3,5]},children:a}),o&&e.jsx(v,{sx:{...i,padding:0},children:o}),e.jsx(x,{sx:i,children:n})]})};g.__docgenInfo={description:"",methods:[],displayName:"SettingsFormTab",props:{tab:{required:!0,tsType:{name:"ITab"},description:""},value:{required:!0,tsType:{name:"string"},description:""}}};const d=e=>`/settings/${e.toLowerCase()}`,h=t=>{var r;const{currentTab:s,tabs:n}=t,a=T(),o=b(C)`
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

    &.${f.disabled} {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &.${f.selected} {
      color: #1b1b1b;
      border: 2px solid #1b1b1b;
      background-color: #e2edf7;
    }
  `,i=b(I)`
    width: 100%;
    display: flex;
    gap: 12px;
    flex-direction: column;
    justify-content: flex-start;
    align-content: flex-start;
  `;if(1===n.length)return;const l={label:(null==(r=n.find((({title:e})=>d(e)===s)))?void 0:r.title)||"",value:s};return e.jsxs(e.Fragment,{children:[e.jsx(u,{sx:{display:["none","flex"]},children:e.jsx(i,{children:n.map((({glyph:t,title:r},s)=>e.jsxs(o,{to:d(r),value:d(r),"data-cy":`tab-${r}`,slots:{root:q(R)},children:[e.jsx(L,{glyph:t,size:20})," ",r]},s)))})}),e.jsx(u,{sx:{display:["flex","none"]},children:e.jsx(i,{children:e.jsx($,{defaultValue:l,onChange:e=>a(e.value),variant:"tabs",options:n.map((({title:e})=>({label:e,value:d(e)})))})})})]})};h.__docgenInfo={description:"",methods:[],displayName:"SettingsFormTabList",props:{currentTab:{required:!0,tsType:{name:"string"},description:""},tabs:{required:!0,tsType:{name:"Array",elements:[{name:"ITab"}],raw:"ITab[]"},description:""}}};const P=e=>{const{pathname:t}=j();for(const r of e){const e=S(r,t);if(null!==e)return e}return null},_=t=>{var r;const{style:s,tabs:n}=t,a=n.map((({title:e})=>d(e))),o=P(a),i=(null==(r=null==o?void 0:o.pattern)?void 0:r.path)||a[0];return e.jsx(F,{value:i,style:s,children:e.jsxs(u,{sx:{alignContent:"stretch",alignSelf:"stretch",justifyContent:"stretch",flexDirection:["column","row"],gap:4},children:[e.jsx(h,{tabs:n,currentTab:i}),e.jsx(u,{sx:{alignContent:"stretch",justifyContent:"stretch",flexDirection:"column",flex:1},children:n.map(((t,r)=>e.jsx(g,{value:d(t.title),tab:t},r)))})]})})};_.__docgenInfo={description:"",methods:[],displayName:"SettingsFormWrapper",props:{tabs:{required:!0,tsType:{name:"Array",elements:[{name:"ITab"}],raw:"ITab[]"},description:""},style:{required:!1,tsType:{name:"union",raw:"React.CSSProperties | undefined",elements:[{name:"ReactCSSProperties",raw:"React.CSSProperties"},{name:"undefined"}]},description:""}}};export{_ as S};