import{a as t,j as c,F as d}from"./jsx-runtime-913be41c.js";import{r as f}from"./index-2506bfc3.js";import{n as m}from"./emotion-styled.browser.esm-935c8bd8.js";import{B as p}from"./Button-9ac859c2.js";import{N as x}from"./NotificationItem-e7bfab26.js";import{B as u,C as y,b as N}from"./theme-ui-components.esm-784287e5.js";const g=m(u)`
  display: flex;
  flex-direction: column;
  color: #000;
  padding: 10px 30px 10px 30px;
  text-align: center;
  width: 100%;
  }
`,o=i=>{const{notifications:e,markAllRead:n,markAllNotified:a}=i,r=i.sx||{};return f.useEffect(()=>{e.length&&a&&a()},[e,a]),t(y,{sx:{padding:2,maxHeight:310,overflowY:"auto",...r},children:e.length?c(d,{children:[t(g,{style:{textAlign:"center"},children:"Notifications"}),e.map((l,s)=>t(x,{...l},s)),t(p,{style:{width:"100%",textAlign:"center",display:"flex",justifyContent:"center"},variant:"secondary","data-cy":"clear-notifications",onClick:()=>n&&n(),children:"Clear notifications"})]}):t(N,{sx:{display:"block",textAlign:"center"},"data-cy":"NotificationList: empty state",children:"Nada, no new notifications"})})};try{o.displayName="NotificationList",o.__docgenInfo={description:"",displayName:"NotificationList",props:{notifications:{defaultValue:null,description:"",name:"notifications",required:!0,type:{name:"UserNotificationList"}},sx:{defaultValue:null,description:"",name:"sx",required:!1,type:{name:"any"}},markAllRead:{defaultValue:null,description:"",name:"markAllRead",required:!1,type:{name:"(() => void)"}},markAllNotified:{defaultValue:null,description:"",name:"markAllNotified",required:!1,type:{name:"(() => void)"}}}}}catch{}export{o as N};
//# sourceMappingURL=NotificationList-2d3d7c1f.js.map
