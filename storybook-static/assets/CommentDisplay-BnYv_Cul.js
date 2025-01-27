import{j as t}from"./jsx-runtime-CexXSJP5.js";import{r as s}from"./index-BP8_t0zE.js";import{B as y}from"./Button-DXWS-dX0.js";import{d as E}from"./default_member-D4npYF8S.js";import{b as S,a as g,T as l,F as o}from"./theme-ui-components.esm-Cq1N8tMa.js";import{r as M,t as b,D as B}from"./DisplayDate-0CQG0G5T.js";import{L as k}from"./LinkifyText-DxSi-NTn.js";import{U as V}from"./Username-BJKOWR4K.js";function q(e,t){M(2,arguments);var a=b(e),o=b(t),n=a.getTime()-o.getTime();return n>0?-1:n<0?1:n}const m=({name:e,photoUrl:a})=>t.jsx(S,{"data-cy":"commentAvatarImage",src:a??E,sx:{objectFit:"cover",width:["30px","50px"],height:["30px","50px"]},alt:e?`Avatar of ${e}`:"Avatar of comment author",loading:"lazy"});try{m.displayName="CommentAvatar",m.__docgenInfo={description:"",displayName:"CommentAvatar",props:{name:{defaultValue:null,description:"",name:"name",required:!1,type:{name:"string"}},photoUrl:{defaultValue:null,description:"",name:"photoUrl",required:!1,type:{name:"string"}}}}}catch{}const I="The original comment got deleted",N=129,j=e=>{var a,n,r,i,d;const{comment:c,isEditable:p,itemType:u,setShowDeleteModal:x,setShowEditModal:h}=e,f=s.createRef(),[j,b]=s.useState(0),[v,w]=s.useState(!1),S=v?"max-content":"128px";return s.useEffect((()=>{f.current&&b(f.current.scrollHeight)}),[f]),c.deleted?t.jsx(g,{sx:{marginBottom:2,border:""+(c.highlighted?"2px dashed black":"none")},"data-cy":"deletedComment",children:t.jsxs(l,{sx:{color:"grey"},children:["[",I,"]"]})}):c.deleted?void 0:t.jsxs(o,{sx:{gap:2,flexGrow:1,border:""+(c.highlighted?"2px dashed black":"none")},children:[t.jsx(g,{"data-cy":"commentAvatar","data-testid":"commentAvatar",children:t.jsx(m,{name:null==(a=c.createdBy)?void 0:a.name,photoUrl:null==(n=c.createdBy)?void 0:n.photoUrl})}),t.jsxs(o,{sx:{flexDirection:"column",flex:1},children:[t.jsxs(o,{sx:{flexWrap:"wrap",justifyContent:"space-between",flexDirection:["column","row"],gap:2},children:[t.jsxs(o,{sx:{alignItems:"baseline",gap:2,flexDirection:"row"},children:[t.jsx(V,{user:{userName:(null==(r=c.createdBy)?void 0:r.username)||"",countryCode:null==(i=c.createdBy)?void 0:i.country,isVerified:null==(d=c.createdBy)?void 0:d.isVerified}}),t.jsxs(l,{sx:{fontSize:1,color:"darkGrey"},children:[c.modifiedAt&&q(c.createdAt,c.modifiedAt)>0&&"Edited ",t.jsx(B,{date:c.modifiedAt||c.createdAt})]})]}),p&&t.jsxs(o,{sx:{alignItems:"flex-end",gap:2,paddingBottom:2},children:[t.jsx(y,{type:"button","data-cy":`${u}: edit button`,variant:"subtle",small:!0,icon:"edit",onClick:()=>h(!0),children:"edit"}),t.jsx(y,{type:"button","data-cy":`${u}: delete button`,variant:"subtle",small:!0,icon:"delete",onClick:()=>x(!0),children:"delete"})]})]}),t.jsx(l,{"data-cy":"comment-text","data-testid":"commentText",sx:{fontFamily:"body",lineHeight:1.3,maxHeight:S,overflow:"hidden",whiteSpace:"pre-wrap",wordBreak:"break-word",marginTop:1,marginBottom:2},ref:f,children:t.jsx(k,{children:c.comment})}),j>N&&t.jsx("a",{onClick:()=>{w((e=>!e))},style:{color:"gray",cursor:"pointer"},children:v?"Show less":"Show more"})]})]})};try{j.displayName="CommentDisplay",j.__docgenInfo={description:"",displayName:"CommentDisplay",props:{comment:{defaultValue:null,description:"",name:"comment",required:!0,type:{name:"Comment"}},isEditable:{defaultValue:null,description:"",name:"isEditable",required:!0,type:{name:"boolean | undefined"}},itemType:{defaultValue:null,description:"",name:"itemType",required:!0,type:{name:"enum",value:[{value:'"ReplyItem"'},{value:'"CommentItem"'}]}},setShowDeleteModal:{defaultValue:null,description:"",name:"setShowDeleteModal",required:!0,type:{name:"(arg: boolean) => void"}},setShowEditModal:{defaultValue:null,description:"",name:"setShowEditModal",required:!0,type:{name:"(arg: boolean) => void"}}}}}catch{}export{j as C};