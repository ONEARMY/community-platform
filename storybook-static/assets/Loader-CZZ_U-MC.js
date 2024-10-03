import{j as e}from"./jsx-runtime-CexXSJP5.js";import{k as s}from"./emotion-react.browser.esm-PjqPg9b4.js";import{n}from"./emotion-styled.browser.esm-mtFmFg5E.js";import{u as i}from"./emotion-element-43c6fea0.browser.esm-B3fc_abn.js";import{I as l,F as d,T as m}from"./theme-ui-components.esm-D5Q63Fx1.js";const c=s`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`,p=n(l)`
  animation: ${c} 2s cubic-bezier(0.445, 0.05, 0.55, 0.95) infinite;
  padding: 1rem;
`,a=({label:t,sx:r})=>{const a=i().logo||null;return e.jsx(e.Fragment,{children:e.jsxs(d,{sx:{flexWrap:"wrap",justifyContent:"center",...r},children:[a&&e.jsx(p,{loading:"lazy","data-cy":"loader","data-testid":"loader",src:a,sx:{width:[75,75,100]}}),e.jsx(m,{sx:{width:"100%",textAlign:"center"},children:t||"loading..."})]})})};try{a.displayName="Loader",a.__docgenInfo={description:"",displayName:"Loader",props:{label:{defaultValue:null,description:"",name:"label",required:!1,type:{name:"string"}},sx:{defaultValue:null,description:"",name:"sx",required:!1,type:{name:"ThemeUIStyleObject"}}}}}catch{}export{a as L};