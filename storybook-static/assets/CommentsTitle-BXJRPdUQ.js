import{j as n}from"./jsx-runtime-CexXSJP5.js";import{r as i}from"./index-BP8_t0zE.js";import{H as m}from"./theme-ui-components.esm-Cq1N8tMa.js";const a="Start the discussion",l="1 Comment",c="Comments",s=({comments:e})=>{const t=i.useMemo((()=>e.filter((e=>!e.deleted)).length+e.flatMap((e=>e.replies)).filter((e=>!!e)).length),[e]),s=0===t?a:1===t?l:`${t} ${c}`;return n.jsx(m,{as:"h3","data-cy":"DiscussionTitle",children:s})};try{s.displayName="CommentsTitle",s.__docgenInfo={description:"",displayName:"CommentsTitle",props:{comments:{defaultValue:null,description:"",name:"comments",required:!0,type:{name:"Comment[]"}}}}}catch{}export{s as C};