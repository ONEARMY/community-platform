import{j as y,a as s}from"./jsx-runtime-913be41c.js";import{r as t}from"./index-2506bfc3.js";import{C as f}from"./CreateComment-ddd005ff.js";import{B as b,A as h}from"./theme-ui-components.esm-784287e5.js";const i=a=>{const[r,n]=t.useState(""),[l,e]=t.useState(!1),[m,u]=t.useState(!1),{commentId:d,isLoggedIn:c,maxLength:p,onSubmit:g}=a;return y(b,{sx:{background:"softblue",borderRadius:2,marginBottom:3,padding:3},children:[s(f,{maxLength:p,comment:r,onChange:o=>n(o),onSubmit:async()=>{e(!0);try{await g(d,r),n(""),e(!1)}catch{e(!1),u(!0)}},isLoggedIn:c,isLoading:l,buttonLabel:"Leave a reply"}),m?s(h,{variant:"failure",sx:{mt:3},children:"Unable to leave a comment at this time. Please try again later."}):null]})};try{i.displayName="CreateReply",i.__docgenInfo={description:"",displayName:"CreateReply",props:{commentId:{defaultValue:null,description:"",name:"commentId",required:!0,type:{name:"string"}},isLoggedIn:{defaultValue:null,description:"",name:"isLoggedIn",required:!0,type:{name:"boolean"}},maxLength:{defaultValue:null,description:"",name:"maxLength",required:!0,type:{name:"number"}},onSubmit:{defaultValue:null,description:"",name:"onSubmit",required:!0,type:{name:"(_id: string, reply: string) => Promise<void>"}}}}}catch{}export{i as C};
//# sourceMappingURL=CreateReply-fc26531f.js.map