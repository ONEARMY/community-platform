import{n as r}from"./emotion-styled.browser.esm-C0ON9tHb.js";import{a,T as n}from"./TabsList-Dh6gAoF4.js";const c=r(a)`
  background-color: transparent;
  border: none;
  border-top-left-radius: ${r=>{var e,o;return null==(o=null==(e=r.theme)?void 0:e.space)?void 0:o[2]}}px;
  border-top-right-radius: ${r=>{var e,o;return null==(o=null==(e=r.theme)?void 0:e.space)?void 0:o[2]}}px;
  box-shadow: 0 2px 0px 0px transparent;
  cursor: pointer;
  font-family: ${r=>{var e,o;return null==(o=null==(e=r.theme)?void 0:e.text)?void 0:o.heading.fontFamily}};
  font-size: ${r=>{var e,o;return null==(o=null==(e=r.theme)?void 0:e.fontSizes)?void 0:o[2]}}px;
  padding: ${r=>{var e,o;return null==(o=null==(e=r.theme)?void 0:e.space)?void 0:o[2]}}px
    ${r=>{var e,o;return null==(o=null==(e=r.theme)?void 0:e.space)?void 0:o[3]}}px;
  margin-right: ${r=>{var e,o;return null==(o=null==(e=r.theme)?void 0:e.space)?void 0:o[3]}}px;
  color: ${r=>{var e,o;return null==(o=null==(e=r.theme)?void 0:e.colors)?void 0:o.grey}};

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
    border: 1px solid ${r=>{var e,o;return null==(o=null==(e=r.theme)?void 0:e.colors)?void 0:o.grey}};
    border-radius: ${r=>{var e,o;return null==(o=null==(e=r.theme)?void 0:e.space)?void 0:o[2]}}px;
    margin-bottom: ${r=>{var e,o;return null==(o=null==(e=r.theme)?void 0:e.space)?void 0:o[2]}}px;
  }

  &.base--selected {
    background-color: ${r=>{var e;return null==(e=r.theme)?void 0:e.colors.background}};
    text-decoration: none;
    border: none;
    color: ${r=>{var e,o;return null==(o=null==(e=r.theme)?void 0:e.colors)?void 0:o.black}};

    &:after {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      top: 100%;
      height: ${r=>{var e,o;return null==(o=null==(e=r.theme)?void 0:e.space)?void 0:o[3]}}px;
      width: ${r=>{var e,o;return null==(o=null==(e=r.theme)?void 0:e.space)?void 0:o[3]}}px;
      background-color: ${r=>{var e;return null==(e=r.theme)?void 0:e.colors.background}};
    }
  }
`,i=r(n)`
  background-color: ${r=>{var e;return null==(e=r.theme)?void 0:e.colors.background}};
  border-radius: ${r=>{var e,o;return null==(o=null==(e=r.theme)?void 0:e.space)?void 0:o[2]}}px;
  padding: ${r=>{var e,o;return null==(o=null==(e=r.theme)?void 0:e.space)?void 0:o[3]}}px;
`;export{c as T,i as a};