import{j as t}from"./jsx-runtime-CexXSJP5.js";import{E as i}from"./ExternalLink-D9uHqDtY.js";import{I as n}from"./Icon-CSRB6BgM.js";import{F as v,a as c}from"./theme-ui-components.esm-Cq1N8tMa.js";const u=e=>e.charAt(0).toUpperCase()+e.slice(1),s=(e,a)=>"email"===a?`mailto:${e}`:0===e.indexOf("http")?e:`http://${e}`,d=[{pattern:new RegExp(/twitter\.com/),label:"Twitter"},{pattern:new RegExp(/facebook\.com/),label:"Facebook"},{pattern:new RegExp(/youtube\.com/),label:"Youtube"},{pattern:new RegExp(/instagram\.com/),label:"Instagram"}],p=(e,a)=>{const l=d.find((e=>e.pattern.test(a)));return l?l.label:e&&u(e)},r=e=>{const{url:a,label:l}=e;return t.jsxs(v,{sx:{justifyContent:"flex-start",alignItems:"center",flexDirection:"row",mt:0,...e.sx},children:[t.jsx(c,{children:t.jsx(n,{glyph:e.icon,size:22})}),t.jsx(i,{ml:2,color:"black","data-cy":"profile-link",href:s(a,l),children:p(l,a)})]})};try{u.displayName="capitalizeFirstLetter",u.__docgenInfo={description:"",displayName:"capitalizeFirstLetter",props:{}}}catch{}try{r.displayName="ProfileLink",r.__docgenInfo={description:"",displayName:"ProfileLink",props:{url:{defaultValue:null,description:"",name:"url",required:!0,type:{name:"string"}},label:{defaultValue:null,description:"",name:"label",required:!0,type:{name:"string"}},icon:{defaultValue:null,description:"",name:"icon",required:!0,type:{name:"enum",value:[{value:'"map"'},{value:'"menu"'},{value:'"search"'},{value:'"time"'},{value:'"filter"'},{value:'"image"'},{value:'"view"'},{value:'"email"'},{value:'"step"'},{value:'"other"'},{value:'"account-circle"'},{value:'"account"'},{value:'"add"'},{value:'"arrow-curved-bottom-right"'},{value:'"arrow-back"'},{value:'"arrow-down"'},{value:'"arrow-forward"'},{value:'"arrow-full-down"'},{value:'"arrow-full-up"'},{value:'"bazar"'},{value:'"category"'},{value:'"check"'},{value:'"chevron-down"'},{value:'"chevron-left"'},{value:'"chevron-right"'},{value:'"chevron-up"'},{value:'"close"'},{value:'"comment"'},{value:'"construction"'},{value:'"contact"'},{value:'"discord"'},{value:'"delete"'},{value:'"difficulty"'},{value:'"download"'},{value:'"download-cloud"'},{value:'"edit"'},{value:'"email-outline"'},{value:'"employee"'},{value:'"external-link"'},{value:'"external-url"'},{value:'"facebook"'},{value:'"flag-unknown"'},{value:'"food"'},{value:'"from the team"'},{value:'"guides"'},{value:'"hide"'},{value:'"hyperlink"'},{value:'"impact"'},{value:'"instagram"'},{value:'"landscape"'},{value:'"loading"'},{value:'"location-on"'},{value:'"lock"'},{value:'"machine"'},{value:'"machines"'},{value:'"mail-outline"'},{value:'"more-vert"'},{value:'"moulds"'},{value:'"notifications"'},{value:'"patreon"'},{value:'"pdf"'},{value:'"plastic"'},{value:'"profile"'},{value:'"products"'},{value:'"recycling"'},{value:'"revenue"'},{value:'"show"'},{value:'"slack"'},{value:'"sliders"'},{value:'"social-media"'},{value:'"star"'},{value:'"star-active"'},{value:'"supporter"'},{value:'"thunderbolt"'},{value:'"thunderbolt-grey"'},{value:'"turned-in"'},{value:'"update"'},{value:'"upload"'},{value:'"utilities"'},{value:'"useful"'},{value:'"verified"'},{value:'"volunteer"'},{value:'"website"'},{value:'"starter kits"'},{value:'"globe"'},{value:'"gps-location"'}]}},sx:{defaultValue:null,description:"",name:"sx",required:!1,type:{name:"ThemeUICSSObject"}}}}}catch{}export{r as P};