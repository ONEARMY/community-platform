import{j as t}from"./iframe-COd5Vz8v.js";import{n as o}from"./emotion-styled.browser.esm-C0ON9tHb.js";import{E as d}from"./ExternalLink-BnVKY0u3.js";import{I as p}from"./Icon-BCSCvWcm.js";import{F as m,T as i}from"./theme-ui-components.esm-BLpgKNMo.js";const l=({siteName:e})=>{const n=o(d)`
    color: #fff;
    text-decoration: underline;
  `,r=o(m)`
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
  `,s=o(p)`
    @media only screen and (min-width: ${e=>e.theme.breakpoints[1]}) and (max-width: ${e=>e.theme.breakpoints[2]}) {
      position: absolute;
      top: 45px;
      left: 30px;
    }
  `;return t.jsxs(r,{bg:"#27272c",sx:{alignItems:"center"},style:{marginTop:"45px"},children:[t.jsx(s,{glyph:"star-active",mb:[3,3,0]}),t.jsxs(i,{ml:[0,0,0,3],mr:1,children:[e," is a project by"," ",t.jsx(n,{href:"https://onearmy.earth/",children:"One Army"}),"."]}),t.jsxs(i,{mt:[2,2,0],children:["Please"," ",t.jsx(n,{href:"https://www.patreon.com/one_army",children:"sponsor the work"})," ","or"," ",t.jsx(n,{href:"https://platform.onearmy.earth/",children:"help\xa0us\xa0build\xa0the\xa0software"}),"."]})]})};l.__docgenInfo={description:"",methods:[],displayName:"SiteFooter",props:{siteName:{required:!0,tsType:{name:"string"},description:""}}};export{l as S};