import{t as o,k as r,j as e}from"./iframe-hKNIfn5j.js";import{n as a}from"./emotion-styled.browser.esm-B4xmMbW3.js";import{I as i,F as d,T as m}from"./theme-ui-components.esm-DKTvS5i7.js";const l=o`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`,c=a(i)`
  animation: ${l} 2s cubic-bezier(0.445, 0.05, 0.55, 0.95) infinite;
  padding: 1rem;
`,p=({label:t,sx:n})=>{const s=r().theme.logo||null;return e.jsx(e.Fragment,{children:e.jsxs(d,{sx:{flexWrap:"wrap",justifyContent:"center",...n},children:[s&&e.jsx(c,{loading:"lazy","data-cy":"loader","data-testid":"loader",src:s,sx:{width:[75,75,100]}}),e.jsx(m,{sx:{width:"100%",textAlign:"center"},children:t||"Loading..."})]})})};p.__docgenInfo={description:"",methods:[],displayName:"Loader",props:{label:{required:!1,tsType:{name:"string"},description:""},sx:{required:!1,tsType:{name:"union",raw:"ThemeUIStyleObject | undefined",elements:[{name:"ThemeUIStyleObject"},{name:"undefined"}]},description:""}}};export{p as L};