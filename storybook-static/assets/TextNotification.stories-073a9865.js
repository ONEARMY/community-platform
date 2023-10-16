import{a as r}from"./jsx-runtime-913be41c.js";import{r as x}from"./index-2506bfc3.js";import{T as e}from"./TextNotification-5d439cf2.js";import"./emotion-react.browser.esm-8f1ceb56.js";import"./emotion-element-6a883da9.browser.esm-a920ce7a.js";import"./emotion-use-insertion-effect-with-fallbacks.browser.esm-11801e73.js";import"./theme-ui-css.esm-8bf72815.js";import"./theme-ui-components.esm-531cc452.js";const D={title:"Components/TextNotification",component:e},i=()=>r(e,{variant:"success",isVisible:!0,children:"A short snappy notification"}),s=()=>{const[d,b]=x.useState(!0);return r(e,{variant:"success",isVisible:d,onDismiss:b,children:"A short snappy notification"})},t=()=>r(e,{variant:"failure",isVisible:!0,children:"A short snappy notification"});var o,a,n;i.parameters={...i.parameters,docs:{...(o=i.parameters)==null?void 0:o.docs,source:{originalSource:`() => <TextNotification variant="success" isVisible={true}>
    A short snappy notification
  </TextNotification>`,...(n=(a=i.parameters)==null?void 0:a.docs)==null?void 0:n.source}}};var c,p,m;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`() => {
  const [visible, setVisibility] = useState(true);
  return <TextNotification variant="success" isVisible={visible} onDismiss={setVisibility}>
      A short snappy notification
    </TextNotification>;
}`,...(m=(p=s.parameters)==null?void 0:p.docs)==null?void 0:m.source}}};var u,l,f;t.parameters={...t.parameters,docs:{...(u=t.parameters)==null?void 0:u.docs,source:{originalSource:`() => <TextNotification variant="failure" isVisible={true}>
    A short snappy notification
  </TextNotification>`,...(f=(l=t.parameters)==null?void 0:l.docs)==null?void 0:f.source}}};const E=["Success","SuccessDismissable","Error"];export{t as Error,i as Success,s as SuccessDismissable,E as __namedExportsOrder,D as default};
//# sourceMappingURL=TextNotification.stories-073a9865.js.map
