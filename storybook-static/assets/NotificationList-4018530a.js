import{a as t,j as c,F as d}from"./jsx-runtime-913be41c.js";import{r as m}from"./index-2506bfc3.js";import{n as f}from"./emotion-styled.browser.esm-935c8bd8.js";import{B as p}from"./Button-ed8e0074.js";import{N as u}from"./NotificationItem-3073619e.js";import{B as x,C as y,b as N}from"./theme-ui-components.esm-29c4d01e.js";const g=f(x)`
  display: flex;
  flex-direction: column;
  color: #000;
  padding: 10px 30px 10px 30px;
  text-align: center;
  width: 100%;
  }
`,n=e=>{const{notifications:i,markAllRead:a,markAllNotified:o}=e,r=e.sx||{};return m.useEffect(()=>{i.length&&o()},[]),t(y,{sx:{padding:2,maxHeight:310,overflowY:"auto",...r},children:i.length?c(d,{children:[t(g,{style:{textAlign:"center"},children:"Notifications"}),i.map((l,s)=>t(u,{...l},s)),t(p,{style:{width:"100%",textAlign:"center",display:"flex",justifyContent:"center"},variant:"secondary","data-cy":"clear-notifications",onClick:()=>a&&a(),children:"Clear notifications"})]}):t(N,{sx:{display:"block",textAlign:"center"},"data-cy":"NotificationList: empty state",children:"Nada, no new notifications"})})};try{n.displayName="NotificationList",n.__docgenInfo={description:"",displayName:"NotificationList",props:{notifications:{defaultValue:null,description:"",name:"notifications",required:!0,type:{name:"UserNotificationItem[]"}},markAllRead:{defaultValue:null,description:"",name:"markAllRead",required:!0,type:{name:"() => void"}},markAllNotified:{defaultValue:null,description:"",name:"markAllNotified",required:!0,type:{name:"() => void"}},sx:{defaultValue:null,description:"",name:"sx",required:!1,type:{name:"ThemeUIStyleObject"}}}}}catch{}export{n as N};
//# sourceMappingURL=NotificationList-4018530a.js.map
