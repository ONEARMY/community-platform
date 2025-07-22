import{t as s,k as a,j as e}from"./iframe-C-taf7kA.js";import{n as r}from"./emotion-styled.browser.esm-CDeeIFSs.js";import{I as i,F as d,T as m}from"./theme-ui-components.esm-Ms1ojwSG.js";const l=s`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`,c=r(i)`
  animation: ${l} 2s cubic-bezier(0.445, 0.05, 0.55, 0.95) infinite;
  padding: 1rem;
`,p=({label:t,sx:s})=>{const r=a().theme.logo||null;return e.jsxs(d,{sx:{flexWrap:"wrap",justifyContent:"center",...s},children:[r&&e.jsx(c,{loading:"lazy","data-cy":"loader","data-testid":"loader",src:r,sx:{width:[75,75,100]}}),e.jsx(m,{sx:{width:"100%",textAlign:"center"},children:t||"Loading..."})]})};p.__docgenInfo={description:"",methods:[],displayName:"Loader",props:{label:{required:!1,tsType:{name:"string"},description:""},sx:{required:!1,tsType:{name:"union",raw:"ThemeUIStyleObject | undefined",elements:[{name:"ThemeUIStyleObject"},{name:"undefined"}]},description:""}}};export{p as L};