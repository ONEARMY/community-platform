import{a as r}from"./jsx-runtime-93f93352.js";import{r as x}from"./index-ba39e096.js";import{T as e}from"./TextNotification-fd5b458d.js";import"./_commonjsHelpers-042e6b4d.js";import"./theme-ui-css.esm-b1576555.js";import"./emotion-element-6a883da9.browser.esm-7636857e.js";import"./emotion-use-insertion-effect-with-fallbacks.browser.esm-789fca20.js";import"./theme-ui-components.esm-f3994bb3.js";const D={title:"Components/TextNotification",component:e},i=()=>r(e,{variant:"success",isVisible:!0,children:"A short snappy notification"}),s=()=>{const[d,b]=x.useState(!0);return r(e,{variant:"success",isVisible:d,onDismiss:b,children:"A short snappy notification"})},t=()=>r(e,{variant:"failure",isVisible:!0,children:"A short snappy notification"});var o,a,n;i.parameters={...i.parameters,docs:{...(o=i.parameters)==null?void 0:o.docs,source:{originalSource:`() => <TextNotification variant="success" isVisible={true}>
    A short snappy notification
  </TextNotification>`,...(n=(a=i.parameters)==null?void 0:a.docs)==null?void 0:n.source}}};var c,p,m;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`() => {
  const [visible, setVisibility] = useState(true);
  return <TextNotification variant="success" isVisible={visible} onDismiss={setVisibility}>
      A short snappy notification
    </TextNotification>;
}`,...(m=(p=s.parameters)==null?void 0:p.docs)==null?void 0:m.source}}};var u,l,f;t.parameters={...t.parameters,docs:{...(u=t.parameters)==null?void 0:u.docs,source:{originalSource:`() => <TextNotification variant="failure" isVisible={true}>
    A short snappy notification
  </TextNotification>`,...(f=(l=t.parameters)==null?void 0:l.docs)==null?void 0:f.source}}};const E=["Success","SuccessDismissable","Error"];export{t as Error,i as Success,s as SuccessDismissable,E as __namedExportsOrder,D as default};
//# sourceMappingURL=TextNotification.stories-bda5705b.js.map
