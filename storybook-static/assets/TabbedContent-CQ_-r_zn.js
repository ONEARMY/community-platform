import{n}from"./emotion-styled.browser.esm-Dz2BNYeh.js";import{T as p,a as d}from"./TabsList-DhTEw6FA.js";const o=n(p)`
  background-color: transparent;
  border: none;
  border-top-left-radius: ${e=>{var r,o;return null==(o=null==(r=e.theme)?void 0:r.space)?void 0:o[2]}}px;
  border-top-right-radius: ${e=>{var r,o;return null==(o=null==(r=e.theme)?void 0:r.space)?void 0:o[2]}}px;
  box-shadow: 0 2px 0px 0px transparent;
  cursor: pointer;
  font-family: ${e=>{var r,o;return null==(o=null==(r=e.theme)?void 0:r.text)?void 0:o.heading.fontFamily}};
  font-size: ${e=>{var r,o;return null==(o=null==(r=e.theme)?void 0:r.fontSizes)?void 0:o[2]}}px;
  padding: ${e=>{var r,o;return null==(o=null==(r=e.theme)?void 0:r.space)?void 0:o[2]}}px
    ${e=>{var r,o;return null==(o=null==(r=e.theme)?void 0:r.space)?void 0:o[3]}}px;
  margin-right: ${e=>{var r,o;return null==(o=null==(r=e.theme)?void 0:r.space)?void 0:o[3]}}px;

  &:hover {
    text-decoration: underline;
  }

  @media (min-width: 52em) {
    &:first-of-type {
      margin-left: 0;
      position: relative;
    }
  }

  @media (max-width: 52em) {
    border: 1px solid ${e=>{var r,o;return null==(o=null==(r=e.theme)?void 0:r.colors)?void 0:o.grey}};
    border-radius: ${e=>{var r,o;return null==(o=null==(r=e.theme)?void 0:r.space)?void 0:o[2]}}px;
    margin-bottom: ${e=>{var r,o;return null==(o=null==(r=e.theme)?void 0:r.space)?void 0:o[2]}}px;
  }

  &.base--selected {
    background-color: ${e=>{var r;return null==(r=e.theme)?void 0:r.colors.background}};
    text-decoration: none;
    border: none;

    &:after {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      top: 100%;
      height: ${e=>{var r,o;return null==(o=null==(r=e.theme)?void 0:r.space)?void 0:o[3]}}px;
      width: ${e=>{var r,o;return null==(o=null==(r=e.theme)?void 0:r.space)?void 0:o[3]}}px;
      background-color: ${e=>{var r;return null==(r=e.theme)?void 0:r.colors.background}};
    }
  }
`,r=n(d)`
  background-color: ${e=>{var r;return null==(r=e.theme)?void 0:r.colors.background}};
  border-radius: ${e=>{var r,o;return null==(o=null==(r=e.theme)?void 0:r.space)?void 0:o[2]}}px;
  padding: ${e=>{var r,o;return null==(o=null==(r=e.theme)?void 0:r.space)?void 0:o[3]}}px;
`;try{o.displayName="Tab",o.__docgenInfo={description:"",displayName:"Tab",props:{theme:{defaultValue:null,description:"",name:"theme",required:!1,type:{name:"Theme"}}}}}catch{}try{r.displayName="TabPanel",r.__docgenInfo={description:"",displayName:"TabPanel",props:{theme:{defaultValue:null,description:"",name:"theme",required:!1,type:{name:"Theme"}}}}}catch{}export{o as T,r as a};