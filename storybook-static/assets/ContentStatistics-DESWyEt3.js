import{j as t}from"./jsx-runtime-CexXSJP5.js";import{r as m}from"./index-BP8_t0zE.js";import{B as d}from"./Button-BDXaB1Ju.js";import{I as h}from"./Icon-K4Df0KMW.js";import{F as n,T as i}from"./theme-ui-components.esm-Cq1N8tMa.js";const r=e=>{const{alwaysShow:s,statistics:o}=e,[a,r]=m.useState(!1);return t.jsxs(n,{"data-cy":"ContentStatistics",py:1,sx:{alignItems:["flex-start","center","center"],justifyContent:"center",gap:2,flexDirection:s?"row":["column","row","row"],pl:s?0:[2,0,0]},children:[t.jsxs(n,{sx:{flexDirection:"row",alignItems:"center",justifyContent:"space-between",display:s?"none":["flex","none","none"],width:"100%"},onClick:()=>{r(!a)},children:[t.jsx(i,{sx:{fontSize:"13px"},children:a?"":"More Information"}),t.jsx(d,{type:"button",variant:"subtle",showIconOnly:!0,icon:a?"chevron-up":"chevron-down",small:!0,sx:{borderWidth:"0px","&:hover":{bg:"white"},"&:active":{bg:"white"}}})]}),o.map(((e,o)=>t.jsxs(n,{px:2,py:1,mb:1,sx:{alignItems:"center",fontSize:"1",display:[a||s?"flex":"none","flex","flex"]},children:[t.jsx(h,{glyph:e.icon,mr:1,size:"sm",opacity:"0.5"}),t.jsx(i,{children:e.label})]},o)))]})};try{r.displayName="ContentStatistics",r.__docgenInfo={description:"",displayName:"ContentStatistics",props:{statistics:{defaultValue:null,description:"",name:"statistics",required:!0,type:{name:"{ icon: availableGlyphs; label: string; }[]"}},alwaysShow:{defaultValue:null,description:"",name:"alwaysShow",required:!1,type:{name:"boolean"}}}}}catch{}export{r as C};