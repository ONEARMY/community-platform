import{a as r}from"./jsx-runtime-913be41c.js";import{r as x}from"./index-2506bfc3.js";import{T as e}from"./TextNotification-1d8fbdfb.js";import"./emotion-react.browser.esm-aba50b66.js";import"./theme-ui-css.esm-b19fe7ec.js";import"./emotion-use-insertion-effect-with-fallbacks.browser.esm-11801e73.js";import"./theme-ui-components.esm-23584dac.js";const A={title:"Components/TextNotification",component:e},i=()=>r(e,{variant:"success",isVisible:!0,children:"A short snappy notification"}),s=()=>{const[d,b]=x.useState(!0);return r(e,{variant:"success",isVisible:d,onDismiss:b,children:"A short snappy notification"})},t=()=>r(e,{variant:"failure",isVisible:!0,children:"A short snappy notification"});var o,a,n;i.parameters={...i.parameters,docs:{...(o=i.parameters)==null?void 0:o.docs,source:{originalSource:`() => <TextNotification variant="success" isVisible={true}>
    A short snappy notification
  </TextNotification>`,...(n=(a=i.parameters)==null?void 0:a.docs)==null?void 0:n.source}}};var c,p,u;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`() => {
  const [visible, setVisibility] = useState(true);
  return <TextNotification variant="success" isVisible={visible} onDismiss={setVisibility}>
      A short snappy notification
    </TextNotification>;
}`,...(u=(p=s.parameters)==null?void 0:p.docs)==null?void 0:u.source}}};var m,l,f;t.parameters={...t.parameters,docs:{...(m=t.parameters)==null?void 0:m.docs,source:{originalSource:`() => <TextNotification variant="failure" isVisible={true}>
    A short snappy notification
  </TextNotification>`,...(f=(l=t.parameters)==null?void 0:l.docs)==null?void 0:f.source}}};const D=["Success","SuccessDismissable","Error"];export{t as Error,i as Success,s as SuccessDismissable,D as __namedExportsOrder,A as default};
//# sourceMappingURL=TextNotification.stories-1b20fd4d.js.map
