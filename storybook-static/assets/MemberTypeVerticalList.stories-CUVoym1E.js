import{j as s}from"./jsx-runtime-CexXSJP5.js";import{r as y}from"./index-BP8_t0zE.js";import{M as c}from"./MemberTypeVerticalList.client-DRPyMsNI.js";import"./CardButton-DqlKyyLu.js";import"./theme-ui-components.esm-Cq1N8tMa.js";import"./parseProps-780b287c.browser.esm-DiCerVr_.js";import"./emotion-use-insertion-effect-with-fallbacks.browser.esm-UWD3gXM2.js";import"./theme-ui-core-jsx-runtime.browser.esm-CH0qhC10.js";import"./hoist-non-react-statics.cjs-CQI8syxn.js";import"./MemberBadge-BQwHjTxI.js";import"./icon-star-active-ClN6U5FF.js";import"./theme-ui-core.browser.esm-CvTdiiil.js";import"./emotion-react.browser.esm-BYoRxRk_.js";import"./cjs-Clfm10Kj.js";import"./VerticalList.client-B4MxpJfx.js";import"./emotion-styled.browser.esm-Dz2BNYeh.js";import"./extends-CF3RwP-h.js";import"./ArrowIcon-DGi346k6.js";import"./Icon-CSRB6BgM.js";import"./contact-DD4r1-LP.js";import"./supporter-D7hp958O.js";import"./icon-arrow-down-CJeToCJe.js";const q={title:"Map/MemberTypeVerticalList",component:c},l=[{label:"Workspace",_id:"workspace",filterType:"profileType"},{label:"Machine Builder",_id:"machine-builder",filterType:"profileType"},{label:"Community Builder",_id:"community-builder",filterType:"profileType"},{label:"Collection Point",_id:"collection-point",filterType:"profileType"},{label:"Want to get started",_id:"member",filterType:"profileType"},{label:"Generic Without Icon",_id:"none",filterType:"profileType"}],r=()=>{const[e,i]=y.useState([]);return s.jsx("div",{style:{maxWidth:"500px"},children:s.jsx(c,{activeFilters:e,availableFilters:l,onFilterChange:e=>l.find((i=>i._id==e._id))?i((i=>i.filter((i=>i!==e)))):i((i=>[...i,e]))})})},n=()=>{const[e,i]=y.useState([]);return s.jsxs("div",{style:{maxWidth:"500px"},children:[s.jsx(c,{activeFilters:e,availableFilters:[l[0]],onFilterChange:e=>l.find((i=>i._id==e._id))?i((i=>i.filter((i=>i!==e)))):i((i=>[...i,e]))}),"(Shouldn't see anything, only renders for two or more)"]})};var m,d,F,f,u,v;r.parameters={...r.parameters,docs:{...null==(m=r.parameters)?void 0:m.docs,source:{originalSource:"() => {\n  const [activeFilters, setActiveFilters] = useState<MapFilterOptionsList>([]);\n  const onFilterChange = (option: MapFilterOption) => {\n    const isFilterPresent = !!availableFilters.find(pinFilter => pinFilter._id == option._id);\n    if (isFilterPresent) {\n      return setActiveFilters(filter => filter.filter(existingOption => existingOption !== option));\n    }\n    return setActiveFilters(existingOptions => [...existingOptions, option]);\n  };\n  return <div style={{\n    maxWidth: '500px'\n  }}>\n      <MemberTypeVerticalList activeFilters={activeFilters} availableFilters={availableFilters} onFilterChange={onFilterChange} />\n    </div>;\n}",...null==(F=null==(d=r.parameters)?void 0:d.docs)?void 0:F.source}}},n.parameters={...n.parameters,docs:{...null==(f=n.parameters)?void 0:f.docs,source:{originalSource:"() => {\n  const [activeFilters, setActiveFilters] = useState<MapFilterOptionsList>([]);\n  const onFilterChange = (option: MapFilterOption) => {\n    const isFilterPresent = !!availableFilters.find(pinFilter => pinFilter._id == option._id);\n    if (isFilterPresent) {\n      return setActiveFilters(filter => filter.filter(existingOption => existingOption !== option));\n    }\n    return setActiveFilters(existingOptions => [...existingOptions, option]);\n  };\n  return <div style={{\n    maxWidth: '500px'\n  }}>\n      <MemberTypeVerticalList activeFilters={activeFilters} availableFilters={[availableFilters[0]]} onFilterChange={onFilterChange} />\n      (Shouldn't see anything, only renders for two or more)\n    </div>;\n}",...null==(v=null==(u=n.parameters)?void 0:u.docs)?void 0:v.source}}};const z=["Basic","OnlyOne"];export{r as Basic,n as OnlyOne,z as __namedExportsOrder,q as default};