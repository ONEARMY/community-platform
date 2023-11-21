import{a as n,j as m}from"./jsx-runtime-913be41c.js";import{g as _,a as w,u as j,_ as C,C as $,T as N,b as F,c as L,d as M,e as U,f as z,h as E,i as D,j as O,k as G,l as x}from"./TabbedContent-0252112c.js";import{y as R}from"./index-a7768622.js";import{r as l}from"./index-2506bfc3.js";import"./emotion-styled.browser.esm-935c8bd8.js";import"./emotion-use-insertion-effect-with-fallbacks.browser.esm-11801e73.js";import"./emotion-element-6a883da9.browser.esm-becb4ad2.js";function W({controlled:a,default:e,name:d,state:t="value"}){const{current:r}=l.useRef(a!==void 0),[b,p]=l.useState(e),o=r?a:b,s=l.useCallback(c=>{r||p(c)},[]);return[o,s]}function q(a){return _("MuiTabs",a)}w("MuiTabs",["root","horizontal","vertical"]);function A(a){const{value:e,defaultValue:d,onChange:t,orientation:r,direction:b,selectionFollowsFocus:p}=a,[o,s]=W({controlled:e,default:d,name:"Tabs",state:"value"}),c=l.useCallback((h,v)=>{s(v),t==null||t(h,v)},[t,s]),{subitems:T,contextValue:i}=j(),u=l.useRef(()=>{}),P=l.useCallback(h=>{var v;return(v=T.get(h))==null?void 0:v.id},[T]),f=l.useCallback(h=>u.current(h),[]),g=l.useCallback(h=>{u.current=h},[]);return{contextValue:C({direction:b,getTabId:f,getTabPanelId:P,onSelected:c,orientation:r,registerTabIdLookup:g,selectionFollowsFocus:p,value:o},i)}}function B(a){const{value:e,children:d}=a,{direction:t,getItemIndex:r,onSelected:b,orientation:p,registerItem:o,registerTabIdLookup:s,selectionFollowsFocus:c,totalSubitemCount:T,value:i,getTabId:u,getTabPanelId:P}=e,f=l.useMemo(()=>({getItemIndex:r,registerItem:o,totalSubitemCount:T}),[o,r,T]),g=l.useMemo(()=>({direction:t,getTabId:u,getTabPanelId:P,onSelected:b,orientation:p,registerTabIdLookup:s,selectionFollowsFocus:c,value:i}),[t,u,P,b,p,s,c,i]);return n($.Provider,{value:f,children:n(N.Provider,{value:g,children:d})})}const H=["children","value","defaultValue","orientation","direction","onChange","selectionFollowsFocus","slotProps","slots"],J=a=>{const{orientation:e}=a;return M({root:["root",e]},U(q))},K=l.forwardRef(function(e,d){var t;const{children:r,orientation:b="horizontal",direction:p="ltr",slotProps:o={},slots:s={}}=e,c=F(e,H),{contextValue:T}=A(e),i=C({},e,{orientation:b,direction:p}),u=J(i),P=(t=s.root)!=null?t:"div",f=L({elementType:P,externalSlotProps:o.root,externalForwardedProps:c,additionalProps:{ref:d},ownerState:i,className:u.root});return n(P,C({},f,{children:n(B,{value:T,children:r})}))});function Q(a){return _("MuiTabPanel",a)}w("MuiTabPanel",["root","hidden"]);function X(a){return a.size}function Y(a){const{value:e,id:d,rootRef:t}=a,r=z();if(r===null)throw new Error("No TabContext provided");const{value:b,getTabId:p}=r,o=E(d),s=l.useRef(null),c=D(s,t),T=l.useMemo(()=>({id:o,ref:s}),[o]),{id:i}=O(e??X,T),u=i!==b,P=i!==void 0?p(i):void 0;return{hidden:u,getRootProps:(g={})=>C({"aria-labelledby":P??void 0,hidden:u,id:o??void 0},g,{ref:c}),rootRef:c}}const Z=["children","value","slotProps","slots"],ee=a=>{const{hidden:e}=a;return M({root:["root",e&&"hidden"]},U(Q))},k=l.forwardRef(function(e,d){var t;const{children:r,slotProps:b={},slots:p={}}=e,o=F(e,Z),{hidden:s,getRootProps:c}=Y(e),T=C({},e,{hidden:s}),i=ee(T),u=(t=p.root)!=null?t:"div",P=L({elementType:u,getSlotProps:c,externalSlotProps:b.root,externalForwardedProps:o,additionalProps:{role:"tabpanel",ref:d},ownerState:T,className:i.root});return n(u,C({},P,{children:!s&&r}))}),ce={title:"Components/TabbedContent"},I=()=>m(K,{defaultValue:0,children:[m(G,{children:[n(x,{children:"Tab #1"}),n(x,{children:"Tab #2"}),n(x,{children:"Tab #3"}),n(x,{children:"Tab #4"}),n(x,{children:"Tab #5"})]}),m(k,{children:[n("p",{children:"Tab Panel #1"}),n("p",{children:R.lorem.paragraphs(3)})]}),m(k,{children:[n("p",{children:"Tab Panel #2"}),n("p",{children:R.lorem.paragraphs(3)})]}),m(k,{children:[n("p",{children:"Tab Panel #3"}),n("p",{children:R.lorem.paragraphs(3)})]}),m(k,{children:[n("p",{children:"Tab Panel #4"}),n("p",{children:R.lorem.paragraphs(3)})]}),m(k,{children:[n("p",{children:"Tab Panel #5"}),n("p",{children:R.lorem.paragraphs(3)})]})]});var V,S,y;I.parameters={...I.parameters,docs:{...(V=I.parameters)==null?void 0:V.docs,source:{originalSource:`() => {
  return <Tabs defaultValue={0}>
      <TabsList>
        <Tab>Tab #1</Tab>
        <Tab>Tab #2</Tab>
        <Tab>Tab #3</Tab>
        <Tab>Tab #4</Tab>
        <Tab>Tab #5</Tab>
      </TabsList>

      <TabPanel>
        <p>Tab Panel #1</p>
        <p>{faker.lorem.paragraphs(3)}</p>
      </TabPanel>
      <TabPanel>
        <p>Tab Panel #2</p>
        <p>{faker.lorem.paragraphs(3)}</p>
      </TabPanel>
      <TabPanel>
        <p>Tab Panel #3</p>
        <p>{faker.lorem.paragraphs(3)}</p>
      </TabPanel>
      <TabPanel>
        <p>Tab Panel #4</p>
        <p>{faker.lorem.paragraphs(3)}</p>
      </TabPanel>
      <TabPanel>
        <p>Tab Panel #5</p>
        <p>{faker.lorem.paragraphs(3)}</p>
      </TabPanel>
    </Tabs>;
}`,...(y=(S=I.parameters)==null?void 0:S.docs)==null?void 0:y.source}}};const ie=["Default"];export{I as Default,ie as __namedExportsOrder,ce as default};
//# sourceMappingURL=TabbedContent.stories-06097169.js.map
