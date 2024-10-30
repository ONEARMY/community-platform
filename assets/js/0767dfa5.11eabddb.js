"use strict";(self.webpackChunkoa_docs=self.webpackChunkoa_docs||[]).push([[985],{5862:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>l,contentTitle:()=>r,default:()=>h,frontMatter:()=>o,metadata:()=>c,toc:()=>a});var s=i(4848),t=i(8453);const o={},r="Deployment via CircleCI",c={id:"Deployment/circle-ci",title:"Deployment via CircleCI",description:"We use CircleCI to handle automated build-test-deploy cycles when PRs and releases are created from the GitHub Repository",source:"@site/docs/Deployment/circle-ci.md",sourceDirName:"Deployment",slug:"/Deployment/circle-ci",permalink:"/Deployment/circle-ci",draft:!1,unlisted:!1,editUrl:"https://github.com/ONEARMY/community-platform/edit/master/packages/documentation/docs/Deployment/circle-ci.md",tags:[],version:"current",frontMatter:{},sidebar:"mainSidebar",previous:{title:"E2E Testing",permalink:"/Testing/end-to-end"},next:{title:"Automated Backup and Migration",permalink:"/Server Maintenance/dataMigration"}},l={},a=[{value:"Environment Variables",id:"environment-variables",level:2},{value:"Firebase Deployment",id:"firebase-deployment",level:3},{value:"Slack Notifications",id:"slack-notifications",level:3},{value:"Runtime Variables",id:"runtime-variables",level:3},{value:"Misc Variables",id:"misc-variables",level:3},{value:"Google APIs",id:"google-apis",level:2},{value:"Functions Variables",id:"functions-variables",level:2}];function d(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",ul:"ul",...(0,t.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.header,{children:(0,s.jsx)(n.h1,{id:"deployment-via-circleci",children:"Deployment via CircleCI"})}),"\n",(0,s.jsx)(n.p,{children:"We use CircleCI to handle automated build-test-deploy cycles when PRs and releases are created from the GitHub Repository"}),"\n",(0,s.jsx)(n.h2,{id:"environment-variables",children:"Environment Variables"}),"\n",(0,s.jsxs)(n.p,{children:["The following environment variables should be set within the ",(0,s.jsx)(n.a,{href:"https://circleci.com/docs/2.0/env-vars/",children:"CircleCI Environment"}),", or via ",(0,s.jsx)(n.a,{href:"https://circleci.com/docs/2.0/contexts/",children:"CircleCI Contexts"})]}),"\n",(0,s.jsx)(n.h3,{id:"firebase-deployment",children:"Firebase Deployment"}),"\n",(0,s.jsxs)(n.p,{children:["The most secure way to provide the CI system access to deploy to firebase is by creating a service worker account with relevant permissions\nand storing the credentials as an environment variable (see this ",(0,s.jsx)(n.a,{href:"https://github.com/firebase/firebase-tools/issues/825",children:"Github Issue"})," for more info)"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"GOOGLE_APPLICATION_CREDENTIALS_JSON\n"})}),"\n",(0,s.jsx)(n.p,{children:"If using multiple projects (e.g. staging/production) these can be configured in different contexts."}),"\n",(0,s.jsx)(n.p,{children:"When configuring a service account the following permissions should be assigned:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"Firebase Admin SDK Administrator Service Agent\nCloud Functions Service Agent\nCloud Functions Admin\nFirebase Hosting Admin\nCloud RuntimeConfig Admin\n"})}),"\n",(0,s.jsxs)(n.p,{children:["Alternatively, a ",(0,s.jsx)(n.code,{children:"FIREBASE_TOKEN"})," environment variable can be created and set (See the ",(0,s.jsx)(n.a,{href:"https://firebase.google.com/docs/cli#cli-ci-systems",children:"Firebase Docs"}),"),\nhowever this is less preferable as the token would provide access to all a user's firebase projects"]}),"\n",(0,s.jsx)(n.h3,{id:"slack-notifications",children:"Slack Notifications"}),"\n",(0,s.jsx)(n.p,{children:"Send slack notifications on deploy success/fail/approval-hold:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"SLACK_DEFAULT_CHANNEL\nSLACK_ACCESS_TOKEN\n"})}),"\n",(0,s.jsxs)(n.p,{children:["Currently passed with ",(0,s.jsx)(n.code,{children:"circle-ci-slack-context"})," context\nSee ",(0,s.jsx)(n.a,{href:"https://github.com/CircleCI-Public/slack-orb",children:"circleci slack orb"})," for info)"]}),"\n",(0,s.jsx)(n.h3,{id:"runtime-variables",children:"Runtime Variables"}),"\n",(0,s.jsxs)(n.p,{children:["Any variables prefixed with ",(0,s.jsx)(n.code,{children:"VITE_"})," are automatically included with the runtime build. Currently we require:"]}),"\n",(0,s.jsx)(n.p,{children:"Firebase configuration"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"VITE_FIREBASE_API_KEY\nVITE_FIREBASE_AUTH_DOMAIN\nVITE_FIREBASE_DATABASE_URL\nVITE_FIREBASE_MESSAGING_SENDER_ID\nVITE_FIREBASE_PROJECT_ID\nVITE_FIREBASE_STORAGE_BUCKET\n"})}),"\n",(0,s.jsx)(n.p,{children:"Sentry error tracking"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"VITE_SENTRY_DSN\n"})}),"\n",(0,s.jsx)(n.p,{children:"Google Analytics"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"VITE_GA_TRACKING_ID\n"})}),"\n",(0,s.jsx)(n.h3,{id:"misc-variables",children:"Misc Variables"}),"\n",(0,s.jsx)(n.p,{children:"Proposed (but not currently implemented)"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"LIGHTHOUSE_API_KEY\n"})}),"\n",(0,s.jsx)(n.h2,{id:"google-apis",children:"Google APIs"}),"\n",(0,s.jsx)(n.p,{children:"To deploy from service_account the following APIs will also need to be enabled for the project:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"https://console.cloud.google.com/apis/api/firebasehosting.googleapis.com",children:"Firebase Hosting API"})}),"\n"]}),"\n",(0,s.jsx)(n.h2,{id:"functions-variables",children:"Functions Variables"}),"\n",(0,s.jsxs)(n.p,{children:["Additional configuration variables used in Cloud Functions can be setup with ",(0,s.jsx)(n.code,{children:"firebase functions:config:set"})," (example: ",(0,s.jsx)(n.code,{children:"discord_webhook"}),")"]}),"\n",(0,s.jsx)(n.p,{children:"To change the configuration:"}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsx)(n.li,{children:"You need the firebase-cli setup on your local computer."}),"\n",(0,s.jsx)(n.li,{children:"You need a Google account that has privileges for the deployment you want to change."}),"\n",(0,s.jsx)(n.li,{children:"Be inside of the project."}),"\n",(0,s.jsxs)(n.li,{children:["Run ",(0,s.jsx)(n.code,{children:"firebase use x"})," where x is the deployment you want to modify (found in the ",(0,s.jsx)(n.code,{children:".firebaserc"})," file.)"]}),"\n",(0,s.jsxs)(n.li,{children:["It is recommended to do ",(0,s.jsx)(n.code,{children:"firebase functions:config:get"})," for backup."]}),"\n",(0,s.jsxs)(n.li,{children:["Run ",(0,s.jsx)(n.code,{children:'firebase functions:config:set key="value"'})]}),"\n",(0,s.jsx)(n.li,{children:"You should get a message that the changes will take affect once the functions are deployed again."}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:["External documentation:\n",(0,s.jsx)(n.a,{href:"https://firebase.google.com/docs/functions/config-env?gen=1st#set_environment_configuration_with_the",children:"https://firebase.google.com/docs/functions/config-env?gen=1st#set_environment_configuration_with_the"})]})]})}function h(e={}){const{wrapper:n}={...(0,t.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}},8453:(e,n,i)=>{i.d(n,{R:()=>r,x:()=>c});var s=i(6540);const t={},o=s.createContext(t);function r(e){const n=s.useContext(o);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:r(e.components),s.createElement(o.Provider,{value:n},e.children)}}}]);