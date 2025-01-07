import{j as e}from"./jsx-runtime-CexXSJP5.js";import{r as o}from"./index-BP8_t0zE.js";import{d as O}from"./default_member-D4npYF8S.js";import{B as w}from"./Button-DXWS-dX0.js";import{C as $}from"./ConfirmModal-r7UwDjCQ.js";import{D as F}from"./DisplayDate-0CQG0G5T.js";import{E as U}from"./EditComment-BXJP__sY.js";import{L}from"./LinkifyText-DxSi-NTn.js";import{M as P}from"./Modal-BKeaaREi.js";import{U as G}from"./Username-B69u0-Y3.js";import{F as t,a as C,T as c,b as z}from"./theme-ui-components.esm-Cq1N8tMa.js";const W=129,J="The original comment got deleted",E=a=>{const n=o.createRef(),[r,i]=o.useState(!1),[s,m]=o.useState(!1),[d,l]=o.useState(0),[p,u]=o.useState(!1),{comment:x,handleDelete:h,handleEditRequest:f,handleEdit:j,isReply:y}=a,{text:g,creatorName:E,creatorCountry:b,creatorImage:D,isUserVerified:S,isUserSupporter:I,isEditable:v,_created:B,_edited:R,_id:_,_deleted:q}=x,T={userName:E,countryCode:b,isVerified:!!S,isSupporter:!!I},k=p?"max-content":"128px",V=y?"ReplyItem":"CommentItem";o.useEffect((()=>{n.current&&l(n.current.scrollHeight)}),[n]);return e.jsxs(t,{id:`comment:${_}`,"data-cy":v?`Own${V}`:V,sx:{flexDirection:"column"},children:[e.jsxs(t,{sx:{gap:2},children:[q&&e.jsx(C,{sx:{marginBottom:2},"data-cy":"deletedComment",children:e.jsxs(c,{sx:{color:"grey"},children:["[",J,"]"]})}),!q&&e.jsxs(t,{sx:{gap:2,flexGrow:1},children:[e.jsx(C,{"data-cy":"commentAvatar","data-testid":"commentAvatar",children:e.jsx(z,{"data-cy":"commentAvatarImage",src:D??O,sx:{objectFit:"cover",width:["30px","50px"],height:["30px","50px"]},alt:E?`Avatar of ${E}`:"Avatar of comment author"})}),e.jsxs(t,{sx:{flexDirection:"column",flex:1},children:[e.jsxs(t,{sx:{flexWrap:"wrap",justifyContent:"space-between",flexDirection:["column","row"],gap:2},children:[e.jsxs(t,{sx:{alignItems:"baseline",gap:2,flexDirection:"row"},children:[e.jsx(G,{user:T}),e.jsxs(c,{sx:{fontSize:1,color:"darkGrey"},children:[R&&"Edited ",e.jsx(F,{date:R||B})]})]}),v&&e.jsxs(t,{sx:{alignItems:"flex-end",gap:2,paddingBottom:2},children:[e.jsx(w,{type:"button","data-cy":`${V}: edit button`,variant:"subtle",small:!0,icon:"edit",onClick:()=>(e=>{if(f)return f(e),i(!0)})(_),children:"edit"}),e.jsx(w,{type:"button","data-cy":`${V}: delete button`,variant:"subtle",small:!0,icon:"delete",onClick:()=>m(!0),children:"delete"})]})]}),e.jsx(c,{"data-cy":"comment-text","data-testid":"commentText",sx:{fontFamily:"body",lineHeight:1.3,maxHeight:k,overflow:"hidden",whiteSpace:"pre-wrap",wordBreak:"break-word",marginTop:1,marginBottom:2},ref:n,children:e.jsx(L,{children:g})}),d>W&&e.jsx("a",{onClick:()=>{u(!p)},style:{color:"gray",cursor:"pointer"},children:p?"Show less":"Show more"})]})]})]}),e.jsx(P,{width:600,isOpen:r,children:e.jsx(U,{comment:g,handleSubmit:async e=>{await j(_,e),i(!1)},handleCancel:()=>i(!1),isReply:y})}),e.jsx($,{isOpen:s,message:"Are you sure you want to delete this comment?",confirmButtonText:"Delete",handleCancel:()=>m(!1),handleConfirm:async()=>{h&&await h(_),m(!1)}})]})};try{E.displayName="CommentItem",E.__docgenInfo={description:"",displayName:"CommentItem",props:{comment:{defaultValue:null,description:"",name:"comment",required:!0,type:{name:"IComment"}},handleDelete:{defaultValue:null,description:"",name:"handleDelete",required:!1,type:{name:"((commentId: string) => Promise<void>)"}},handleEdit:{defaultValue:null,description:"",name:"handleEdit",required:!0,type:{name:"(commentId: string, newCommentText: string) => void"}},handleEditRequest:{defaultValue:null,description:"",name:"handleEditRequest",required:!1,type:{name:"((commentId: string) => Promise<void>)"}},isReply:{defaultValue:null,description:"",name:"isReply",required:!0,type:{name:"boolean"}}}}}catch{}export{E as C};