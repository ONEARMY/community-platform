import{a as e,F as o,j as n}from"./jsx-runtime-913be41c.js";import{k as s}from"./emotion-react.browser.esm-ac7fc07b.js";import{n as i}from"./emotion-styled.browser.esm-935c8bd8.js";import{u as l}from"./emotion-element-6a883da9.browser.esm-becb4ad2.js";import{I as m,F as d,b as c}from"./theme-ui-components.esm-784287e5.js";const p=s`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`,f=i(m)`
  animation: ${p} 2s cubic-bezier(0.445, 0.05, 0.55, 0.95) infinite;
  padding: 1rem;
`,a=({label:r})=>{const t=l().logo||null;return e(o,{children:n(d,{sx:{flexWrap:"wrap",justifyContent:"center"},children:[t&&e(f,{loading:"lazy",src:t,sx:{width:[75,75,100]}}),e(c,{sx:{width:"100%",textAlign:"center"},children:r||"loading..."})]})})};try{a.displayName="Loader",a.__docgenInfo={description:"",displayName:"Loader",props:{label:{defaultValue:null,description:"",name:"label",required:!1,type:{name:"string"}}}}}catch{}export{a as L};
//# sourceMappingURL=Loader-c7b129e8.js.map
