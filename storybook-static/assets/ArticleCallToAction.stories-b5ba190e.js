import{j as y,a as e}from"./jsx-runtime-913be41c.js";import{y as o}from"./index-a7768622.js";import{B as l}from"./Button-f228a39f.js";import{LoggedOutWithCount as T}from"./UsefulStatsButton.stories-a0d71f02.js";import{A as r}from"./ArticleCallToAction-fe7dd7d7.js";import"./index-2506bfc3.js";import"./Icon-5a6c8159.js";import"./theme-ui-core-jsx-runtime.esm-9bc3c749.js";import"./emotion-element-6a883da9.browser.esm-becb4ad2.js";import"./emotion-use-insertion-effect-with-fallbacks.browser.esm-11801e73.js";import"./hoist-non-react-statics.cjs-dd442a32.js";import"./theme-ui-css.esm-a1197288.js";import"./emotion-styled.browser.esm-935c8bd8.js";import"./supporter-29075ee8.js";import"./icon-arrow-down-33f070d5.js";import"./icon-star-active-309631d9.js";import"./theme-ui-components.esm-600c41e5.js";import"./emotion-react.browser.esm-ac7fc07b.js";import"./UsefulStatsButton-36b2057d.js";import"./Tooltip-60f84766.js";import"./index-4d501b15.js";import"./index-150eb7c2.js";import"./Username-d4b4b02e.js";import"./InternalLink-949536b4.js";import"./index-54304c9c.js";import"./index-0dfb046a.js";const R={title:"Components/ArticleCallToAction",component:r},n=()=>y(r,{author:t(),children:[e(l,{sx:{fontSize:2},children:"Leave a comment"}),e(T,{isLoggedIn:!1,hasUserVotedUseful:!1,votedUsefulCount:0,onUsefulClick:function(){throw new Error("Function not implemented.")}})]}),i=()=>e(r,{author:t(),children:e(T,{isLoggedIn:!1,hasUserVotedUseful:!1,votedUsefulCount:0,onUsefulClick:function(){throw new Error("Function not implemented.")}})}),a=()=>e(r,{author:t(),contributors:[{countryCode:o.address.countryCode(),userName:o.internet.userName(),isVerified:o.datatype.boolean(),isSupporter:o.datatype.boolean()}],children:e(l,{children:"Action"})}),t=()=>({countryCode:o.address.countryCode(),userName:o.internet.userName(),isVerified:o.datatype.boolean(),isSupporter:o.datatype.boolean()}),s=()=>e(r,{author:t(),contributors:o.helpers.uniqueArray(t,Math.floor(Math.random()*10)),children:e(l,{children:"Action"})});var c,u,m;n.parameters={...n.parameters,docs:{...(c=n.parameters)==null?void 0:c.docs,source:{originalSource:`() => <ArticleCallToAction author={makeFakeUser()}>
    <Button sx={{
    fontSize: 2
  }}>Leave a comment</Button>
    <LoggedOutWithCount isLoggedIn={false} hasUserVotedUseful={false} votedUsefulCount={0} onUsefulClick={function (): Promise<void> {
    throw new Error('Function not implemented.');
  }} />
  </ArticleCallToAction>`,...(m=(u=n.parameters)==null?void 0:u.docs)==null?void 0:m.source}}};var d,p,A;i.parameters={...i.parameters,docs:{...(d=i.parameters)==null?void 0:d.docs,source:{originalSource:`() => <ArticleCallToAction author={makeFakeUser()}>
    <LoggedOutWithCount isLoggedIn={false} hasUserVotedUseful={false} votedUsefulCount={0} onUsefulClick={function (): Promise<void> {
    throw new Error('Function not implemented.');
  }} />
  </ArticleCallToAction>`,...(A=(p=i.parameters)==null?void 0:p.docs)==null?void 0:A.source}}};var f,C,h;a.parameters={...a.parameters,docs:{...(f=a.parameters)==null?void 0:f.docs,source:{originalSource:`() => <ArticleCallToAction author={makeFakeUser()} contributors={[{
  countryCode: faker.address.countryCode(),
  userName: faker.internet.userName(),
  isVerified: faker.datatype.boolean(),
  isSupporter: faker.datatype.boolean()
}]}>
    <Button>Action</Button>
  </ArticleCallToAction>`,...(h=(C=a.parameters)==null?void 0:C.docs)==null?void 0:h.source}}};var U,k,g;s.parameters={...s.parameters,docs:{...(U=s.parameters)==null?void 0:U.docs,source:{originalSource:`() => <ArticleCallToAction author={makeFakeUser()} contributors={faker.helpers.uniqueArray(makeFakeUser, Math.floor(Math.random() * 10))}>
    <Button>Action</Button>
  </ArticleCallToAction>`,...(g=(k=s.parameters)==null?void 0:k.docs)==null?void 0:g.source}}};const X=["ArticleCallToActionCommentAndUseful","ArticleCallToActionUseful","ArticleCallToActionSingleContributor","ArticleCallToActionMultipleContributors"];export{n as ArticleCallToActionCommentAndUseful,s as ArticleCallToActionMultipleContributors,a as ArticleCallToActionSingleContributor,i as ArticleCallToActionUseful,X as __namedExportsOrder,R as default};
//# sourceMappingURL=ArticleCallToAction.stories-b5ba190e.js.map
