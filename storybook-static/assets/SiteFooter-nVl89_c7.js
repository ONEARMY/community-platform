import{j as t}from"./jsx-runtime-CexXSJP5.js";import{n}from"./emotion-styled.browser.esm-Dz2BNYeh.js";import{E as p}from"./ExternalLink-CHmx7fZ7.js";import{I as m}from"./Icon-Djd0eHWm.js";import{F as l,T as i}from"./theme-ui-components.esm-DCiJ1mMX.js";const a=({siteName:e})=>{const r=n(p)`
    color: #fff;
    text-decoration: underline;
  `,a=n(l)`
    color: #fff;
    display: flex;
    flex-direction: column;
    margin-top: 45px;
    line-heigh: 1.5;
    padding: 45px ${e=>e.theme.space[4]}px;
    position: relative;
    text-align: center;

    @media only screen and (min-width: ${e=>e.theme.breakpoints[1]}) and (max-width: ${e=>e.theme.breakpoints[2]}) {
      align-items: flex-start;
      padding-top: 35px;
      padding-bottom: 35px;
      padding-left: 65px;
      padding-right: ${310}px;
      text-align: left;
    }

    @media only screen and (min-width: ${e=>e.theme.breakpoints[2]}) {
      flex-direction: row;
      padding-right: ${310}px;
      text-align: left;
    }
  `,o=n(m)`
    @media only screen and (min-width: ${e=>e.theme.breakpoints[1]}) and (max-width: ${e=>e.theme.breakpoints[2]}) {
      position: absolute;
      top: 45px;
      left: 30px;
    }
  `;return t.jsxs(a,{bg:"#27272c",sx:{alignItems:"center"},style:{marginTop:"45px"},children:[t.jsx(o,{glyph:"star-active",mb:[3,3,0]}),t.jsxs(i,{ml:[0,0,0,3],mr:1,children:[e," is a project by"," ",t.jsx(r,{href:"https://onearmy.earth/",children:"One Army"}),"."]}),t.jsxs(i,{mt:[2,2,0],children:["Please"," ",t.jsx(r,{href:"https://www.patreon.com/one_army",children:"sponsor the work"})," ","or"," ",t.jsx(r,{href:"https://platform.onearmy.earth/",children:"help\xa0us\xa0build\xa0the\xa0software"}),"."]})]})};try{a.displayName="SiteFooter",a.__docgenInfo={description:"",displayName:"SiteFooter",props:{siteName:{defaultValue:null,description:"",name:"siteName",required:!0,type:{name:"string"}}}}}catch{}export{a as S};