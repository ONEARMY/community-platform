import{j as e}from"./jsx-runtime-CexXSJP5.js";import{k as s}from"./emotion-react.browser.esm-BYoRxRk_.js";import{n}from"./emotion-styled.browser.esm-Dz2BNYeh.js";import{u as i}from"./theme-ui-core.browser.esm-CvTdiiil.js";import{I as l,F as d,T as m}from"./theme-ui-components.esm-Cq1N8tMa.js";const c=s`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`,p=n(l)`
  animation: ${c} 2s cubic-bezier(0.445, 0.05, 0.55, 0.95) infinite;
  padding: 1rem;
`,a=({label:r,sx:t})=>{const a=i().theme.logo||null;return e.jsx(e.Fragment,{children:e.jsxs(d,{sx:{flexWrap:"wrap",justifyContent:"center",...t},children:[a&&e.jsx(p,{loading:"lazy","data-cy":"loader","data-testid":"loader",src:a,sx:{width:[75,75,100]}}),e.jsx(m,{sx:{width:"100%",textAlign:"center"},children:r||"Loading..."})]})})};try{a.displayName="Loader",a.__docgenInfo={description:"",displayName:"Loader",props:{label:{defaultValue:null,description:"",name:"label",required:!1,type:{name:"string"}},sx:{defaultValue:null,description:"",name:"sx",required:!1,type:{name:"ThemeUIStyleObject"}}}}}catch{}export{a as L};