import{a as e,j as o,F as n}from"./jsx-runtime-913be41c.js";import{g as $}from"./Icon-3a0ef890.js";import{B as t}from"./Button-e73a9226.js";import"./index-2506bfc3.js";import"./theme-ui-core-jsx-runtime.esm-9e16d62c.js";import"./theme-ui-css.esm-b19fe7ec.js";import"./emotion-use-insertion-effect-with-fallbacks.browser.esm-11801e73.js";import"./parseProps-376f43a7.esm-45b791e5.js";import"./emotion-styled.browser.esm-09c6e9f5.js";import"./icon-verified-badge-7d7bdb14.js";import"./icon-star-active-9fadbee7.js";import"./theme-ui-components.esm-23584dac.js";import"./emotion-react.browser.esm-aba50b66.js";const pe={title:"Components/Button",component:t},i=[{small:!0,label:"Small"},{label:"Default"},{large:!0,label:"Large"}],c=()=>e(t,{children:"Button Text"}),s=()=>o(n,{children:[e(t,{disabled:!0,children:"Disabled"}),e(t,{icon:"delete",disabled:!0,children:"Disabled"})]}),l=()=>o(n,{children:[e(t,{variant:"primary",children:"Primary"}),e(t,{icon:"delete",variant:"primary",children:"Primary"}),i.map((r,a)=>e(t,{variant:"primary",...r,children:r.label},a))]}),u=()=>o(n,{children:[e(t,{variant:"secondary",children:"Secondary"}),e(t,{icon:"delete",variant:"secondary",children:"Secondary"}),i.map((r,a)=>e(t,{variant:"secondary",...r,children:r.label},a))]}),d=()=>o(n,{children:[e(t,{variant:"destructive",children:"Destructive"}),e(t,{icon:"delete",variant:"destructive",children:"Destructive"}),i.map((r,a)=>e(t,{variant:"destructive",...r,children:r.label},a))]}),m=()=>o(n,{children:[e(t,{variant:"subtle",children:"Subtle"}),e(t,{variant:"subtle",icon:"account-circle",children:"Subtle"}),i.map((r,a)=>e(t,{variant:"subtle",...r,children:r.label},a))]}),p=()=>o(n,{children:[e(t,{variant:"outline",children:"Outline"}),e(t,{variant:"outline",icon:"account-circle",children:"Outline"}),i.map((r,a)=>e(t,{variant:"outline",...r,children:r.label},a))]}),B=()=>o(n,{children:[e(t,{small:!0,children:"Small Button"}),e(t,{small:!0,icon:"delete",children:"Small Button with Icon"})]}),v=()=>o(n,{children:[e(t,{large:!0,children:"Large Button"}),e(t,{large:!0,icon:"delete",children:"Large Button with Icon"})]}),h=()=>e(n,{children:e(t,{large:!0,icon:"delete",showIconOnly:!0,children:"Icon Button with hidden text"})}),y=()=>e(n,{children:i.map(r=>["primary","secondary","outline"].map(a=>Object.keys($).map((Y,Z)=>o(t,{icon:Y,...r,variant:a,children:[r.label," with Icon"]},Z))))});var b,g,S;c.parameters={...c.parameters,docs:{...(b=c.parameters)==null?void 0:b.docs,source:{originalSource:"() => <Button>Button Text</Button>",...(S=(g=c.parameters)==null?void 0:g.docs)==null?void 0:S.source}}};var k,O,I;s.parameters={...s.parameters,docs:{...(k=s.parameters)==null?void 0:k.docs,source:{originalSource:`() => <>
    <Button disabled>Disabled</Button>
    <Button icon="delete" disabled>
      Disabled
    </Button>
  </>`,...(I=(O=s.parameters)==null?void 0:O.docs)==null?void 0:I.source}}};var D,w,z;l.parameters={...l.parameters,docs:{...(D=l.parameters)==null?void 0:D.docs,source:{originalSource:`() => <>
    <Button variant={'primary'}>Primary</Button>
    <Button icon="delete" variant={'primary'}>
      Primary
    </Button>
    {sizeOptions.map((v, k) => <Button key={k} variant={'primary'} {...v}>
        {v.label}
      </Button>)}
  </>`,...(z=(w=l.parameters)==null?void 0:w.docs)==null?void 0:z.source}}};var x,L,P;u.parameters={...u.parameters,docs:{...(x=u.parameters)==null?void 0:x.docs,source:{originalSource:`() => <>
    <Button variant={'secondary'}>Secondary</Button>
    <Button icon="delete" variant={'secondary'}>
      Secondary
    </Button>
    {sizeOptions.map((v, k) => <Button key={k} variant={'secondary'} {...v}>
        {v.label}
      </Button>)}
  </>`,...(P=(L=u.parameters)==null?void 0:L.docs)==null?void 0:P.source}}};var f,j,_;d.parameters={...d.parameters,docs:{...(f=d.parameters)==null?void 0:f.docs,source:{originalSource:`() => <>
    <Button variant={'destructive'}>Destructive</Button>
    <Button icon="delete" variant={'destructive'}>
      Destructive
    </Button>
    {sizeOptions.map((v, k) => <Button key={k} variant={'destructive'} {...v}>
        {v.label}
      </Button>)}
  </>`,...(_=(j=d.parameters)==null?void 0:j.docs)==null?void 0:_.source}}};var F,T,C;m.parameters={...m.parameters,docs:{...(F=m.parameters)==null?void 0:F.docs,source:{originalSource:`() => <>
    <Button variant={'subtle'}>Subtle</Button>
    <Button variant={'subtle'} icon="account-circle">
      Subtle
    </Button>
    {sizeOptions.map((v, k) => <Button key={k} variant={'subtle'} {...v}>
        {v.label}
      </Button>)}
  </>`,...(C=(T=m.parameters)==null?void 0:T.docs)==null?void 0:C.source}}};var E,q,A;p.parameters={...p.parameters,docs:{...(E=p.parameters)==null?void 0:E.docs,source:{originalSource:`() => <>
    <Button variant={'outline'}>Outline</Button>
    <Button variant={'outline'} icon="account-circle">
      Outline
    </Button>
    {sizeOptions.map((v, k) => <Button key={k} variant={'outline'} {...v}>
        {v.label}
      </Button>)}
  </>`,...(A=(q=p.parameters)==null?void 0:q.docs)==null?void 0:A.source}}};var G,H,J;B.parameters={...B.parameters,docs:{...(G=B.parameters)==null?void 0:G.docs,source:{originalSource:`() => <>
    <Button small={true}>Small Button</Button>
    <Button small={true} icon="delete">
      Small Button with Icon
    </Button>
  </>`,...(J=(H=B.parameters)==null?void 0:H.docs)==null?void 0:J.source}}};var K,M,N;v.parameters={...v.parameters,docs:{...(K=v.parameters)==null?void 0:K.docs,source:{originalSource:`() => <>
    <Button large={true}>Large Button</Button>
    <Button large={true} icon="delete">
      Large Button with Icon
    </Button>
  </>`,...(N=(M=v.parameters)==null?void 0:M.docs)==null?void 0:N.source}}};var Q,R,U;h.parameters={...h.parameters,docs:{...(Q=h.parameters)==null?void 0:Q.docs,source:{originalSource:`() => <>
    <Button large={true} icon="delete" showIconOnly={true}>
      Icon Button with hidden text
    </Button>
  </>`,...(U=(R=h.parameters)==null?void 0:R.docs)==null?void 0:U.source}}};var V,W,X;y.parameters={...y.parameters,docs:{...(V=y.parameters)==null?void 0:V.docs,source:{originalSource:`() => <>
    {sizeOptions.map(size => ['primary', 'secondary', 'outline'].map(variant => Object.keys(glyphs).map((glyph: any, key) => <Button icon={glyph} key={key} {...size} variant={variant}>
            {size.label} with Icon
          </Button>)))}
  </>`,...(X=(W=y.parameters)==null?void 0:W.docs)==null?void 0:X.source}}};const Be=["Basic","Disabled","Primary","Secondary","Destructive","Subtle","Outline","Small","Large","IconOnly","Icons"];export{c as Basic,d as Destructive,s as Disabled,h as IconOnly,y as Icons,v as Large,p as Outline,l as Primary,u as Secondary,B as Small,m as Subtle,Be as __namedExportsOrder,pe as default};
//# sourceMappingURL=Button.stories-7a8046c0.js.map
