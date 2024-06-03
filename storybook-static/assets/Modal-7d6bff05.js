import{a as l,F as w,j as v}from"./jsx-runtime-913be41c.js";import{R as r}from"./index-0dfb046a.js";import{R as d}from"./index-2506bfc3.js";import{p as a}from"./index-4d501b15.js";import{n as f}from"./emotion-styled.browser.esm-935c8bd8.js";import{B as c}from"./theme-ui-components.esm-29c4d01e.js";var g=!!(typeof window<"u"&&window.document&&window.document.createElement),x=function(){function t(e,n){for(var i=0;i<n.length;i++){var o=n[i];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}();function O(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function P(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e&&(typeof e=="object"||typeof e=="function")?e:t}function N(t,e){if(typeof e!="function"&&e!==null)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}var h=function(t){N(e,t);function e(){return O(this,e),P(this,(e.__proto__||Object.getPrototypeOf(e)).apply(this,arguments))}return x(e,[{key:"componentWillUnmount",value:function(){this.defaultNode&&document.body.removeChild(this.defaultNode),this.defaultNode=null}},{key:"render",value:function(){return g?(!this.props.node&&!this.defaultNode&&(this.defaultNode=document.createElement("div"),document.body.appendChild(this.defaultNode)),r.createPortal(this.props.children,this.props.node||this.defaultNode)):null}}]),e}(d.Component);h.propTypes={children:a.node.isRequired,node:a.any};const j=h;var k=function(){function t(e,n){for(var i=0;i<n.length;i++){var o=n[i];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}();function D(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function E(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e&&(typeof e=="object"||typeof e=="function")?e:t}function M(t,e){if(typeof e!="function"&&e!==null)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}var s=function(t){M(e,t);function e(){return D(this,e),E(this,(e.__proto__||Object.getPrototypeOf(e)).apply(this,arguments))}return k(e,[{key:"componentDidMount",value:function(){this.renderPortal()}},{key:"componentDidUpdate",value:function(i){this.renderPortal()}},{key:"componentWillUnmount",value:function(){r.unmountComponentAtNode(this.defaultNode||this.props.node),this.defaultNode&&document.body.removeChild(this.defaultNode),this.defaultNode=null,this.portal=null}},{key:"renderPortal",value:function(i){!this.props.node&&!this.defaultNode&&(this.defaultNode=document.createElement("div"),document.body.appendChild(this.defaultNode));var o=this.props.children;typeof this.props.children.type=="function"&&(o=d.cloneElement(this.props.children)),this.portal=r.unstable_renderSubtreeIntoContainer(this,o,this.props.node||this.defaultNode)}},{key:"render",value:function(){return null}}]),e}(d.Component);const R=s;s.propTypes={children:a.node.isRequired,node:a.any};var u=void 0;r.createPortal?u=j:u=R;const $=u,p=t=>{const{children:e,width:n,height:i,isOpen:o,sx:m}=t,y=()=>{t.onDidDismiss&&t.onDidDismiss()},b=f(c)`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    z-index: 4000;
  `,_=f(c)`
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
  `;return l(w,{children:o&&v($,{children:[l(b,{onClick:()=>y()}),l(_,{sx:{height:i,width:n,...m},children:e})]})})};try{p.displayName="Modal",p.__docgenInfo={description:"",displayName:"Modal",props:{isOpen:{defaultValue:null,description:"",name:"isOpen",required:!0,type:{name:"boolean"}},width:{defaultValue:null,description:"",name:"width",required:!1,type:{name:"number"}},height:{defaultValue:null,description:"",name:"height",required:!1,type:{name:"number"}},onDidDismiss:{defaultValue:null,description:"",name:"onDidDismiss",required:!1,type:{name:"(() => void)"}},sx:{defaultValue:null,description:"",name:"sx",required:!1,type:{name:"ThemeUIStyleObject"}}}}}catch{}export{p as M};
//# sourceMappingURL=Modal-7d6bff05.js.map
