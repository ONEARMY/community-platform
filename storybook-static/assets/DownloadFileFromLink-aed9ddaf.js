import{a as n,F as l,j as i}from"./jsx-runtime-913be41c.js";import{E as a}from"./ExternalLink-299075d0.js";import{I as t}from"./Icon-5a6c8159.js";import{T as d}from"./Tooltip-60f84766.js";import{F as c,b as s}from"./theme-ui-components.esm-784287e5.js";const r=e=>i(l,{children:[i(c,{p:2,mb:1,sx:{background:"accent.base",border:"2px solid black",justifyContent:"space-between",alignItems:"center",flexDirection:"row",maxWidth:"300px",borderRadius:1},onClick:()=>e.redirectToSignIn&&e.redirectToSignIn(),"data-tip":e.redirectToSignIn?"Login to download":"",children:[n(t,{size:24,glyph:"external-url",mr:3}),n(s,{sx:{flex:1,fontSize:1,color:"black"},mr:3,children:"Download files"})]}),n(d,{})]}),o=e=>n(l,{children:e.redirectToSignIn?n(r,{redirectToSignIn:e.redirectToSignIn}):n(a,{href:e.link,onClick:()=>e.handleClick&&e.handleClick(),children:n(r,{})})});try{o.displayName="DownloadFileFromLink",o.__docgenInfo={description:"",displayName:"DownloadFileFromLink",props:{link:{defaultValue:null,description:"",name:"link",required:!0,type:{name:"string"}},handleClick:{defaultValue:null,description:"",name:"handleClick",required:!1,type:{name:"(() => Promise<void>)"}},redirectToSignIn:{defaultValue:null,description:"",name:"redirectToSignIn",required:!1,type:{name:"(() => Promise<void>)"}}}}}catch{}export{o as D};
//# sourceMappingURL=DownloadFileFromLink-aed9ddaf.js.map