import{a as e,j as o,F as n}from"./jsx-runtime-93f93352.js";import{g as W}from"./Icon-75dd0742.js";import{B as t}from"./Button-0f6a0906.js";import"./index-ba39e096.js";import"./_commonjsHelpers-042e6b4d.js";import"./emotion-styled.browser.esm-d2a4c519.js";import"./emotion-use-insertion-effect-with-fallbacks.browser.esm-789fca20.js";import"./emotion-element-6a883da9.browser.esm-7636857e.js";import"./icon-verified-badge-7d7bdb14.js";import"./icon-star-active-309631d9.js";import"./theme-ui-components.esm-f3994bb3.js";import"./theme-ui-css.esm-b1576555.js";const se={title:"Components/Button",component:t},i=[{small:!0,label:"Small"},{label:"Default"},{large:!0,label:"Large"}],c=()=>e(t,{children:"Button Text"}),s=()=>o(n,{children:[e(t,{disabled:!0,children:"Disabled"}),e(t,{icon:"delete",disabled:!0,children:"Disabled"})]}),l=()=>o(n,{children:[e(t,{variant:"primary",children:"Primary"}),e(t,{icon:"delete",variant:"primary",children:"Primary"}),i.map((r,a)=>e(t,{variant:"primary",...r,children:r.label},a))]}),u=()=>o(n,{children:[e(t,{variant:"secondary",children:"Secondary"}),e(t,{icon:"delete",variant:"secondary",children:"Secondary"}),i.map((r,a)=>e(t,{variant:"secondary",...r,children:r.label},a))]}),d=()=>o(n,{children:[e(t,{variant:"subtle",children:"Subtle"}),e(t,{variant:"subtle",icon:"account-circle",children:"Subtle"}),i.map((r,a)=>e(t,{variant:"subtle",...r,children:r.label},a))]}),m=()=>o(n,{children:[e(t,{variant:"outline",children:"Outline"}),e(t,{variant:"outline",icon:"account-circle",children:"Outline"}),i.map((r,a)=>e(t,{variant:"outline",...r,children:r.label},a))]}),p=()=>o(n,{children:[e(t,{small:!0,children:"Small Button"}),e(t,{small:!0,icon:"delete",children:"Small Button with Icon"})]}),B=()=>o(n,{children:[e(t,{large:!0,children:"Large Button"}),e(t,{large:!0,icon:"delete",children:"Large Button with Icon"})]}),h=()=>e(n,{children:e(t,{large:!0,icon:"delete",showIconOnly:!0,children:"Icon Button with hidden text"})}),y=()=>e(n,{children:i.map(r=>["primary","secondary","outline"].map(a=>Object.keys(W).map((U,V)=>o(t,{icon:U,...r,variant:a,children:[r.label," with Icon"]},V))))});var b,v,g;c.parameters={...c.parameters,docs:{...(b=c.parameters)==null?void 0:b.docs,source:{originalSource:"() => <Button>Button Text</Button>",...(g=(v=c.parameters)==null?void 0:v.docs)==null?void 0:g.source}}};var S,O,k;s.parameters={...s.parameters,docs:{...(S=s.parameters)==null?void 0:S.docs,source:{originalSource:`() => <>
    <Button disabled>Disabled</Button>
    <Button icon="delete" disabled>
      Disabled
    </Button>
  </>`,...(k=(O=s.parameters)==null?void 0:O.docs)==null?void 0:k.source}}};var I,w,x;l.parameters={...l.parameters,docs:{...(I=l.parameters)==null?void 0:I.docs,source:{originalSource:`() => <>
    <Button variant={'primary'}>Primary</Button>
    <Button icon="delete" variant={'primary'}>
      Primary
    </Button>
    {sizeOptions.map((v, k) => <Button key={k} variant={'primary'} {...v}>
        {v.label}
      </Button>)}
  </>`,...(x=(w=l.parameters)==null?void 0:w.docs)==null?void 0:x.source}}};var z,D,L;u.parameters={...u.parameters,docs:{...(z=u.parameters)==null?void 0:z.docs,source:{originalSource:`() => <>
    <Button variant={'secondary'}>Secondary</Button>
    <Button icon="delete" variant={'secondary'}>
      Secondary
    </Button>
    {sizeOptions.map((v, k) => <Button key={k} variant={'secondary'} {...v}>
        {v.label}
      </Button>)}
  </>`,...(L=(D=u.parameters)==null?void 0:D.docs)==null?void 0:L.source}}};var P,f,j;d.parameters={...d.parameters,docs:{...(P=d.parameters)==null?void 0:P.docs,source:{originalSource:`() => <>
    <Button variant={'subtle'}>Subtle</Button>
    <Button variant={'subtle'} icon="account-circle">
      Subtle
    </Button>
    {sizeOptions.map((v, k) => <Button key={k} variant={'subtle'} {...v}>
        {v.label}
      </Button>)}
  </>`,...(j=(f=d.parameters)==null?void 0:f.docs)==null?void 0:j.source}}};var _,F,T;m.parameters={...m.parameters,docs:{...(_=m.parameters)==null?void 0:_.docs,source:{originalSource:`() => <>
    <Button variant={'outline'}>Outline</Button>
    <Button variant={'outline'} icon="account-circle">
      Outline
    </Button>
    {sizeOptions.map((v, k) => <Button key={k} variant={'outline'} {...v}>
        {v.label}
      </Button>)}
  </>`,...(T=(F=m.parameters)==null?void 0:F.docs)==null?void 0:T.source}}};var C,E,q;p.parameters={...p.parameters,docs:{...(C=p.parameters)==null?void 0:C.docs,source:{originalSource:`() => <>
    <Button small={true}>Small Button</Button>
    <Button small={true} icon="delete">
      Small Button with Icon
    </Button>
  </>`,...(q=(E=p.parameters)==null?void 0:E.docs)==null?void 0:q.source}}};var A,G,H;B.parameters={...B.parameters,docs:{...(A=B.parameters)==null?void 0:A.docs,source:{originalSource:`() => <>
    <Button large={true}>Large Button</Button>
    <Button large={true} icon="delete">
      Large Button with Icon
    </Button>
  </>`,...(H=(G=B.parameters)==null?void 0:G.docs)==null?void 0:H.source}}};var J,K,M;h.parameters={...h.parameters,docs:{...(J=h.parameters)==null?void 0:J.docs,source:{originalSource:`() => <>
    <Button large={true} icon="delete" showIconOnly={true}>
      Icon Button with hidden text
    </Button>
  </>`,...(M=(K=h.parameters)==null?void 0:K.docs)==null?void 0:M.source}}};var N,Q,R;y.parameters={...y.parameters,docs:{...(N=y.parameters)==null?void 0:N.docs,source:{originalSource:`() => <>
    {sizeOptions.map(size => ['primary', 'secondary', 'outline'].map(variant => Object.keys(glyphs).map((glyph: any, key) => <Button icon={glyph} key={key} {...size} variant={variant}>
            {size.label} with Icon
          </Button>)))}
  </>`,...(R=(Q=y.parameters)==null?void 0:Q.docs)==null?void 0:R.source}}};const le=["Basic","Disabled","Primary","Secondary","Subtle","Outline","Small","Large","IconOnly","Icons"];export{c as Basic,s as Disabled,h as IconOnly,y as Icons,B as Large,m as Outline,l as Primary,u as Secondary,p as Small,d as Subtle,le as __namedExportsOrder,se as default};
//# sourceMappingURL=Button.stories-16c6cb1e.js.map
