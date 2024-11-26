import{j as r}from"./jsx-runtime-CexXSJP5.js";import{R as a}from"./index-BBRV8eG_.js";import{a as l}from"./index-BP8_t0zE.js";import{P as d}from"./index-Snk9MO9S.js";import{n as f}from"./emotion-styled.browser.esm-Dz2BNYeh.js";import{a as c}from"./theme-ui-components.esm-BngKL4Rx.js";var w=!!(typeof window<"u"&&window.document&&window.document.createElement),v=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}();function x(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function g(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function O(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var h=function(){function e(){return x(this,e),g(this,(e.__proto__||Object.getPrototypeOf(e)).apply(this,arguments))}return O(e,l.Component),v(e,[{key:"componentWillUnmount",value:function(){this.defaultNode&&document.body.removeChild(this.defaultNode),this.defaultNode=null}},{key:"render",value:function(){return w?(!this.props.node&&!this.defaultNode&&(this.defaultNode=document.createElement("div"),document.body.appendChild(this.defaultNode)),a.createPortal(this.props.children,this.props.node||this.defaultNode)):null}}]),e}();h.propTypes={children:d.node.isRequired,node:d.any};var j=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}();function P(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function N(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function k(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var s=function(){function e(){return P(this,e),N(this,(e.__proto__||Object.getPrototypeOf(e)).apply(this,arguments))}return k(e,l.Component),j(e,[{key:"componentDidMount",value:function(){this.renderPortal()}},{key:"componentDidUpdate",value:function(e){this.renderPortal()}},{key:"componentWillUnmount",value:function(){a.unmountComponentAtNode(this.defaultNode||this.props.node),this.defaultNode&&document.body.removeChild(this.defaultNode),this.defaultNode=null,this.portal=null}},{key:"renderPortal",value:function(e){!this.props.node&&!this.defaultNode&&(this.defaultNode=document.createElement("div"),document.body.appendChild(this.defaultNode));var t=this.props.children;"function"==typeof this.props.children.type&&(t=l.cloneElement(this.props.children)),this.portal=a.unstable_renderSubtreeIntoContainer(this,t,this.props.node||this.defaultNode)}},{key:"render",value:function(){return null}}]),e}();s.propTypes={children:d.node.isRequired,node:d.any};var u=void 0;u=a.createPortal?h:s;const p=e=>{const{children:t,width:n,height:o,isOpen:i,sx:a}=e,d=f(c)`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    z-index: 4000;
  `,l=f(c)`
    display: block;
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: ${n||300}px;
    max-width: 100vw;
    max-height: 100vh;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border: 2px solid black;
    border-radius: 10px;
    z-index: 4001;
  `;return r.jsx(r.Fragment,{children:i&&r.jsxs(u,{children:[r.jsx(d,{onClick:()=>{e.onDidDismiss&&e.onDidDismiss()}}),r.jsx(l,{sx:{height:o,width:n,...a},children:t})]})})};try{p.displayName="Modal",p.__docgenInfo={description:"",displayName:"Modal",props:{isOpen:{defaultValue:null,description:"",name:"isOpen",required:!0,type:{name:"boolean"}},width:{defaultValue:null,description:"",name:"width",required:!1,type:{name:"number"}},height:{defaultValue:null,description:"",name:"height",required:!1,type:{name:"number"}},onDidDismiss:{defaultValue:null,description:"",name:"onDidDismiss",required:!1,type:{name:"(() => void)"}},sx:{defaultValue:null,description:"",name:"sx",required:!1,type:{name:"ThemeUIStyleObject"}}}}}catch{}export{p as M};