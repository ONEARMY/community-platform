import{t as s,k as a,j as e}from"./iframe-BUU5vkv7.js";import{n as r}from"./emotion-styled.browser.esm-ChYaQs5p.js";import{I as i,F as d,T as m}from"./theme-ui-components.esm-1lFPX8fs.js";const l=s`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`,c=r(i)`
  animation: ${l} 2s cubic-bezier(0.445, 0.05, 0.55, 0.95) infinite;
  padding: 1rem;
`,p=({label:s,sx:t})=>{const r=a().theme.logo||null;return e.jsxs(d,{sx:{flexWrap:"wrap",justifyContent:"center",...t},children:[r&&e.jsx(c,{loading:"lazy","data-cy":"loader","data-testid":"loader",src:r,sx:{width:[75,75,100]}}),e.jsx(m,{sx:{width:"100%",textAlign:"center"},children:s||"Loading..."})]})};p.__docgenInfo={description:"",methods:[],displayName:"Loader",props:{label:{required:!1,tsType:{name:"string"},description:""},sx:{required:!1,tsType:{name:"union",raw:"ThemeUIStyleObject | undefined",elements:[{name:"ThemeUIStyleObject"},{name:"undefined"}]},description:""}}};export{p as L};