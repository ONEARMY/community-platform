import{c as r}from"./emotion-react.browser.esm-C8oza9YZ.js";import{a as e}from"./TextNotification-DOP5W2SG.js";const d=({invalid:o})=>r`
  border-width: 1px;
  border-style: solid;
  border-color: ${o?"error":"transparent"};
  border-radius: 5px;
  font-family: 'Inter', Arial, sans-serif;
  font-size: 12px;
  background-color: background;
  width: 100%;
  box-sizing: border-box;

  &:disabled {
    border: none;
    color: black;
  }

  &:focus {
    border-color: blue;
    outline: none;
  }
`,s=e.div`
  height: 100%;
  width: 100%;
  ${d};
  border: none;
  padding: 0;
`;export{s as F};
