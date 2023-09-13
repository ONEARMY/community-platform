import{a as e,F as g}from"./jsx-runtime-913be41c.js";import{F as r}from"./FieldTextarea-f3be2014.js";import"./index-2506bfc3.js";import"./CharacterCount-053a6dd0.js";import"./theme-ui-components.esm-23584dac.js";import"./emotion-react.browser.esm-aba50b66.js";import"./theme-ui-css.esm-b19fe7ec.js";import"./emotion-use-insertion-effect-with-fallbacks.browser.esm-11801e73.js";const v={title:"Components/FieldTextarea",component:r},a=()=>e(r,{input:{},placeholder:"Text area input",meta:{}}),t=()=>e(r,{input:{},placeholder:"Text area input is not resizable",sx:{resize:"none"},meta:{error:"What an error",touched:!0}}),o=()=>e(r,{input:{},placeholder:"Text area input",meta:{error:"What an error",touched:!0}}),F=[{currentSize:5,minSize:0,maxSize:200,error:null},{currentSize:25,minSize:50,maxSize:200,error:"Character count must be a greater than 50 characters"},{currentSize:500,minSize:0,maxSize:100,error:"Character count must be a less than 100 characters"}],n=()=>e(g,{children:F.map((i,C)=>e(r,{input:{value:"Hello ".repeat(Math.round(i.currentSize/6))},placeholder:"Text area input",meta:{touched:!0},minLength:i.minSize,maxLength:i.maxSize,showCharacterCount:!0},C))});var s,u,c;a.parameters={...a.parameters,docs:{...(s=a.parameters)==null?void 0:s.docs,source:{originalSource:'() => <FieldTextarea input={({} as any)} placeholder="Text area input" meta={{}} />',...(c=(u=a.parameters)==null?void 0:u.docs)==null?void 0:c.source}}};var m,p,l;t.parameters={...t.parameters,docs:{...(m=t.parameters)==null?void 0:m.docs,source:{originalSource:`() => <FieldTextarea input={({} as any)} placeholder="Text area input is not resizable" sx={{
  resize: 'none'
}} meta={{
  error: 'What an error',
  touched: true
}} />`,...(l=(p=t.parameters)==null?void 0:p.docs)==null?void 0:l.source}}};var h,d,x;o.parameters={...o.parameters,docs:{...(h=o.parameters)==null?void 0:h.docs,source:{originalSource:`() => <FieldTextarea input={({} as any)} placeholder="Text area input" meta={{
  error: 'What an error',
  touched: true
}} />`,...(x=(d=o.parameters)==null?void 0:d.docs)==null?void 0:x.source}}};var z,S,T;n.parameters={...n.parameters,docs:{...(z=n.parameters)==null?void 0:z.docs,source:{originalSource:`() => <>
    {characterCountValues.map((state, index) => {
    return <FieldTextarea key={index} input={({
      value: 'Hello '.repeat(Math.round(state.currentSize / 6))
    } as any)} placeholder="Text area input" meta={{
      touched: true
    }} minLength={state.minSize} maxLength={state.maxSize} showCharacterCount />;
  })}
  </>`,...(T=(S=n.parameters)==null?void 0:S.docs)==null?void 0:T.source}}};const w=["Default","WithoutResizeHandle","WithError","WithCharacterCounts"];export{a as Default,n as WithCharacterCounts,o as WithError,t as WithoutResizeHandle,w as __namedExportsOrder,v as default};
//# sourceMappingURL=FieldTextarea.stories-8b0e40a5.js.map
