import{c as t}from"./emotion-react.browser.esm-BYoRxRk_.js";import{c as o}from"./styles-BSw35Wi0.js";const r=""+new URL("Inter-Regular-h_wQ04HD.ttf",import.meta.url).href,e=""+new URL("Inter-Regular-B2VlYN-u.woff",import.meta.url).href,a=""+new URL("Inter-Regular-CcCsk3RA.woff2",import.meta.url).href,n=""+new URL("Inter-SemiBold-ipl4pJhC.ttf",import.meta.url).href,f=""+new URL("Inter-SemiBold-BAEEcJ4E.woff2",import.meta.url).href,l=""+new URL("VarelaRound-Regular-D7RT_WHs.ttf",import.meta.url).href,s=""+new URL("VarelaRound-Regular-BWsNRsEZ.woff",import.meta.url).href,i=`\n  @font-face {\n    font-family: 'Varela Round';\n    font-display: auto;\n    src:  url("${s}") format('woff'),\n          url("${l}") format('truetype');\n    font-weight: normal;\n    font-style: normal;\n  }\n  \n  @font-face {\n    font-family: 'Inter';\n    font-display: auto;\n    src:  url("${a}") format('woff2'),\n          url("${e}") format('woff'),\n          url("${r}") format('truetype');\n    font-weight: normal;\n    font-style: normal;\n  }\n  \n  @font-face {\n    font-family: 'Inter';\n    font-display: auto;\n    src:  url("${f}") format('woff2'),\n          url("${n}") format('truetype');\n    font-weight: bold;\n    font-style: normal;\n  }\n`,c=t`
  ${i}
  body {
    font-family: 'Varela Round', Arial, sans-serif;
    background-color: ${o.colors.background};
    margin: 0;
    padding: 0;
    min-height: 100vh;
  }

  a {
    text-decoration: none;
  }

  * {
    box-sizing: border-box;
  }

  .beta-tester-feature {
    border: 4px dashed ${o.colors.betaGreen};
  }

  body:has(.beta-tester-feature) .user-beta-icon > span {
    background-color: ${o.colors.betaGreen};
  }

  /***** Fix for Algolia search Icon *******/
  .ap-icon-pin {
    display: none;
  }

  /* Screen-reader text only - Taken from bootstrap 4 */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`;export{c as G};