import{r as n,j as t}from"./iframe-C-taf7kA.js";import{n as a}from"./emotion-styled.browser.esm-CDeeIFSs.js";import{L as s}from"./Loader-DoPHvbI2.js";import{a as o,I as d}from"./theme-ui-components.esm-Ms1ojwSG.js";const m=a(o)`
  cursor: pointer;
  padding: 5px;
  overflow: hidden;
  transition: 0.2s ease-in-out;
  &:hover {
    transform: translateY(-5px);
  }
`,u=e=>{const[r,i]=n.useState(!1);return t.jsxs(t.Fragment,{children:[!r&&t.jsx(s,{sx:{mb:3,mt:4,width:100,height:67}}),t.jsx(m,{"data-cy":"thumbnail","data-testid":"thumbnail",mb:3,mt:4,opacity:e.index===e.activeImageIndex?1:.5,onClick:()=>e.setActiveIndex(e.index),children:t.jsx(d,{loading:"lazy",src:e.thumbnailUrl,alt:e.alt??e.name,onLoad:()=>i(!0),onError:()=>i(!0),sx:{width:r?100:0,height:67,objectFit:e.allowPortrait?"contain":"cover",borderRadius:1,border:"1px solid offWhite"},crossOrigin:""})})]})};u.__docgenInfo={description:"",methods:[],displayName:"ImageGalleryThumbnail",props:{setActiveIndex:{required:!0,tsType:{name:"signature",type:"function",raw:"(index: number) => void",signature:{arguments:[{type:{name:"number"},name:"index"}],return:{name:"void"}}},description:""},allowPortrait:{required:!0,tsType:{name:"boolean"},description:""},activeImageIndex:{required:!0,tsType:{name:"number"},description:""},thumbnailUrl:{required:!0,tsType:{name:"string"},description:""},index:{required:!0,tsType:{name:"number"},description:""},alt:{required:!1,tsType:{name:"string"},description:""},name:{required:!1,tsType:{name:"string"},description:""}}};export{u as I};