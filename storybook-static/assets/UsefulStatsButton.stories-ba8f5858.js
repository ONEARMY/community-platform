import{a as l}from"./jsx-runtime-913be41c.js";import{r as n}from"./index-2506bfc3.js";import{U as u}from"./UsefulStatsButton-418c1d48.js";import"./Button-ed8e0074.js";import"./Icon-a3188c61.js";import"./theme-ui-core-jsx-runtime.esm-9bc3c749.js";import"./emotion-element-6a883da9.browser.esm-becb4ad2.js";import"./emotion-use-insertion-effect-with-fallbacks.browser.esm-11801e73.js";import"./hoist-non-react-statics.cjs-dd442a32.js";import"./theme-ui-css.esm-a1197288.js";import"./emotion-styled.browser.esm-935c8bd8.js";import"./supporter-29075ee8.js";import"./icon-arrow-down-33f070d5.js";import"./icon-star-active-309631d9.js";import"./theme-ui-components.esm-29c4d01e.js";import"./emotion-react.browser.esm-ac7fc07b.js";import"./Tooltip-60f84766.js";import"./index-4d501b15.js";import"./index-150eb7c2.js";const A={title:"Components/UsefulStatsButton",component:u},o=()=>l(u,{isLoggedIn:!1,hasUserVotedUseful:!1,votedUsefulCount:99,onUsefulClick:()=>Promise.resolve()}),s=()=>{const[a,c]=n.useState(99),[t,i]=n.useState(!1);return l(u,{votedUsefulCount:a,hasUserVotedUseful:t,isLoggedIn:!0,onUsefulClick:async()=>{await new Promise(e=>setTimeout(()=>e(),2e3)),c(e=>t?e-1:e+1),i(e=>!e)}})},r=()=>{const[a,c]=n.useState(100),[t,i]=n.useState(!0);return l(u,{votedUsefulCount:a,hasUserVotedUseful:t,isLoggedIn:!0,onUsefulClick:async()=>{await new Promise(e=>setTimeout(()=>e(),2e3)),c(e=>t?e-1:e+1),i(e=>!e)}})};var d,m,p;o.parameters={...o.parameters,docs:{...(d=o.parameters)==null?void 0:d.docs,source:{originalSource:"() => <UsefulStatsButton isLoggedIn={false} hasUserVotedUseful={false} votedUsefulCount={99} onUsefulClick={() => Promise.resolve()} />",...(p=(m=o.parameters)==null?void 0:m.docs)==null?void 0:p.source}}};var f,U,v;s.parameters={...s.parameters,docs:{...(f=s.parameters)==null?void 0:f.docs,source:{originalSource:`() => {
  const [count, setCount] = useState<number>(99);
  const [voted, setVoted] = useState(false);
  const clickVote = async () => {
    await new Promise<void>(resolve => setTimeout(() => resolve(), 2000));
    setCount(val => voted ? val - 1 : val + 1);
    setVoted(val => !val);
  };
  return <UsefulStatsButton votedUsefulCount={count} hasUserVotedUseful={voted} isLoggedIn={true} onUsefulClick={clickVote} />;
}`,...(v=(U=s.parameters)==null?void 0:U.docs)==null?void 0:v.source}}};var C,g,V;r.parameters={...r.parameters,docs:{...(C=r.parameters)==null?void 0:C.docs,source:{originalSource:`() => {
  const [count, setCount] = useState<number>(100);
  const [voted, setVoted] = useState(true);
  const clickVote = async () => {
    await new Promise<void>(resolve => setTimeout(() => resolve(), 2000));
    setCount(val => voted ? val - 1 : val + 1);
    setVoted(val => !val);
  };
  return <UsefulStatsButton votedUsefulCount={count} hasUserVotedUseful={voted} isLoggedIn={true} onUsefulClick={clickVote} />;
}`,...(V=(g=r.parameters)==null?void 0:g.docs)==null?void 0:V.source}}};const D=["LoggedOutWithCount","LoggedInWithCount","CurrentUserHasVoted"];export{r as CurrentUserHasVoted,s as LoggedInWithCount,o as LoggedOutWithCount,D as __namedExportsOrder,A as default};
//# sourceMappingURL=UsefulStatsButton.stories-ba8f5858.js.map
