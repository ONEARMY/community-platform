import{a as e,F as y}from"./jsx-runtime-913be41c.js";import{F as r}from"./FieldTextarea-c63346af.js";import"./index-2506bfc3.js";import"./CharacterCount-07f29cce.js";import"./theme-ui-components.esm-29c4d01e.js";import"./emotion-react.browser.esm-ac7fc07b.js";import"./emotion-element-6a883da9.browser.esm-becb4ad2.js";import"./emotion-use-insertion-effect-with-fallbacks.browser.esm-11801e73.js";import"./hoist-non-react-statics.cjs-dd442a32.js";import"./theme-ui-css.esm-a1197288.js";const j={title:"Components/FieldTextarea",component:r},a=()=>e(r,{input:{},placeholder:"Text area input",meta:{}}),t=()=>e(r,{input:{},placeholder:"Text area input is not resizable",sx:{resize:"none"},meta:{error:"What an error",touched:!0}}),o=()=>e(r,{input:{},placeholder:"Text area input",meta:{error:"What an error",touched:!0}}),H=[{currentSize:5,minSize:0,maxSize:200,error:null},{currentSize:25,minSize:50,maxSize:200,error:"Character count must be a greater than 50 characters"},{currentSize:500,minSize:0,maxSize:100,error:"Character count must be a less than 100 characters"}],s=()=>e(y,{children:H.map((n,w)=>e(r,{input:{value:"Hello ".repeat(Math.round(n.currentSize/6))},placeholder:"Text area input",meta:{touched:!0},minLength:n.minSize,maxLength:n.maxSize,showCharacterCount:!0},w))}),i=()=>e(r,{input:{},placeholder:"Text area input",meta:{},rows:10});var u,c,p;a.parameters={...a.parameters,docs:{...(u=a.parameters)==null?void 0:u.docs,source:{originalSource:'() => <FieldTextarea input={({} as any)} placeholder="Text area input" meta={{}} />',...(p=(c=a.parameters)==null?void 0:c.docs)==null?void 0:p.source}}};var m,l,d;t.parameters={...t.parameters,docs:{...(m=t.parameters)==null?void 0:m.docs,source:{originalSource:`() => <FieldTextarea input={({} as any)} placeholder="Text area input is not resizable" sx={{
  resize: 'none'
}} meta={{
  error: 'What an error',
  touched: true
}} />`,...(d=(l=t.parameters)==null?void 0:l.docs)==null?void 0:d.source}}};var h,x,z;o.parameters={...o.parameters,docs:{...(h=o.parameters)==null?void 0:h.docs,source:{originalSource:`() => <FieldTextarea input={({} as any)} placeholder="Text area input" meta={{
  error: 'What an error',
  touched: true
}} />`,...(z=(x=o.parameters)==null?void 0:x.docs)==null?void 0:z.source}}};var S,T,C;s.parameters={...s.parameters,docs:{...(S=s.parameters)==null?void 0:S.docs,source:{originalSource:`() => <>
    {characterCountValues.map((state, index) => {
    return <FieldTextarea key={index} input={({
      value: 'Hello '.repeat(Math.round(state.currentSize / 6))
    } as any)} placeholder="Text area input" meta={{
      touched: true
    }} minLength={state.minSize} maxLength={state.maxSize} showCharacterCount />;
  })}
  </>`,...(C=(T=s.parameters)==null?void 0:T.docs)==null?void 0:C.source}}};var g,F,W;i.parameters={...i.parameters,docs:{...(g=i.parameters)==null?void 0:g.docs,source:{originalSource:'() => <FieldTextarea input={({} as any)} placeholder="Text area input" meta={{}} rows={10} />',...(W=(F=i.parameters)==null?void 0:F.docs)==null?void 0:W.source}}};const k=["Default","WithoutResizeHandle","WithError","WithCharacterCounts","CustomRowHeight"];export{i as CustomRowHeight,a as Default,s as WithCharacterCounts,o as WithError,t as WithoutResizeHandle,k as __namedExportsOrder,j as default};
//# sourceMappingURL=FieldTextarea.stories-7e8f41b1.js.map
