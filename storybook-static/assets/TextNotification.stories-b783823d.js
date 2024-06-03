import{a as r}from"./jsx-runtime-913be41c.js";import{r as x}from"./index-2506bfc3.js";import{T as e}from"./TextNotification-ccc447ec.js";import"./emotion-react.browser.esm-ac7fc07b.js";import"./emotion-element-6a883da9.browser.esm-becb4ad2.js";import"./emotion-use-insertion-effect-with-fallbacks.browser.esm-11801e73.js";import"./hoist-non-react-statics.cjs-dd442a32.js";import"./theme-ui-components.esm-29c4d01e.js";import"./theme-ui-css.esm-a1197288.js";const E={title:"Components/TextNotification",component:e},i=()=>r(e,{variant:"success",isVisible:!0,children:"A short snappy notification"}),s=()=>{const[d,b]=x.useState(!0);return r(e,{variant:"success",isVisible:d,onDismiss:b,children:"A short snappy notification"})},t=()=>r(e,{variant:"failure",isVisible:!0,children:"A short snappy notification"});var o,a,n;i.parameters={...i.parameters,docs:{...(o=i.parameters)==null?void 0:o.docs,source:{originalSource:`() => <TextNotification variant="success" isVisible={true}>
    A short snappy notification
  </TextNotification>`,...(n=(a=i.parameters)==null?void 0:a.docs)==null?void 0:n.source}}};var c,p,m;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`() => {
  const [visible, setVisibility] = useState(true);
  return <TextNotification variant="success" isVisible={visible} onDismiss={setVisibility}>
      A short snappy notification
    </TextNotification>;
}`,...(m=(p=s.parameters)==null?void 0:p.docs)==null?void 0:m.source}}};var u,l,f;t.parameters={...t.parameters,docs:{...(u=t.parameters)==null?void 0:u.docs,source:{originalSource:`() => <TextNotification variant="failure" isVisible={true}>
    A short snappy notification
  </TextNotification>`,...(f=(l=t.parameters)==null?void 0:l.docs)==null?void 0:f.source}}};const g=["Success","SuccessDismissable","Error"];export{t as Error,i as Success,s as SuccessDismissable,g as __namedExportsOrder,E as default};
//# sourceMappingURL=TextNotification.stories-b783823d.js.map
