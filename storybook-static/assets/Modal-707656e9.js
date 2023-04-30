import{a as d,F as _,j as w}from"./jsx-runtime-93f93352.js";import{n as f}from"./emotion-styled.browser.esm-70334677.js";import{R as r}from"./index-3e1d4d7f.js";import{R as l}from"./index-ba39e096.js";import{p as a}from"./index-4d501b15.js";import{a as c}from"./theme-ui-components.esm-8feed514.js";var v=!!(typeof window<"u"&&window.document&&window.document.createElement),g=function(){function t(e,n){for(var i=0;i<n.length;i++){var o=n[i];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}();function O(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function x(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e&&(typeof e=="object"||typeof e=="function")?e:t}function P(t,e){if(typeof e!="function"&&e!==null)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}var h=function(t){P(e,t);function e(){return O(this,e),x(this,(e.__proto__||Object.getPrototypeOf(e)).apply(this,arguments))}return g(e,[{key:"componentWillUnmount",value:function(){this.defaultNode&&document.body.removeChild(this.defaultNode),this.defaultNode=null}},{key:"render",value:function(){return v?(!this.props.node&&!this.defaultNode&&(this.defaultNode=document.createElement("div"),document.body.appendChild(this.defaultNode)),r.createPortal(this.props.children,this.props.node||this.defaultNode)):null}}]),e}(l.Component);h.propTypes={children:a.node.isRequired,node:a.any};const N=h;var k=function(){function t(e,n){for(var i=0;i<n.length;i++){var o=n[i];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}();function j(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function D(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e&&(typeof e=="object"||typeof e=="function")?e:t}function E(t,e){if(typeof e!="function"&&e!==null)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}var s=function(t){E(e,t);function e(){return j(this,e),D(this,(e.__proto__||Object.getPrototypeOf(e)).apply(this,arguments))}return k(e,[{key:"componentDidMount",value:function(){this.renderPortal()}},{key:"componentDidUpdate",value:function(i){this.renderPortal()}},{key:"componentWillUnmount",value:function(){r.unmountComponentAtNode(this.defaultNode||this.props.node),this.defaultNode&&document.body.removeChild(this.defaultNode),this.defaultNode=null,this.portal=null}},{key:"renderPortal",value:function(i){!this.props.node&&!this.defaultNode&&(this.defaultNode=document.createElement("div"),document.body.appendChild(this.defaultNode));var o=this.props.children;typeof this.props.children.type=="function"&&(o=l.cloneElement(this.props.children)),this.portal=r.unstable_renderSubtreeIntoContainer(this,o,this.props.node||this.defaultNode)}},{key:"render",value:function(){return null}}]),e}(l.Component);const M=s;s.propTypes={children:a.node.isRequired,node:a.any};var u=void 0;r.createPortal?u=N:u=M;const R=u,p=t=>{const{children:e,width:n,height:i,isOpen:o}=t,m=()=>{t.onDidDismiss&&t.onDidDismiss()},y=f(c)`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    z-index: 4000;
  `,b=f(c)`
    display: block;
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: ${n||300}px;
    max-width: 100%;
    max-height: 100%;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border: 2px solid black;
    border-radius: 10px;
    z-index: 5000;
  `;return d(_,{children:o&&w(R,{children:[d(y,{onClick:()=>m()}),d(b,{sx:{height:i,width:n},children:e})]})})};try{p.displayName="Modal",p.__docgenInfo={description:"",displayName:"Modal",props:{isOpen:{defaultValue:null,description:"",name:"isOpen",required:!0,type:{name:"boolean"}},width:{defaultValue:null,description:"",name:"width",required:!1,type:{name:"number"}},height:{defaultValue:null,description:"",name:"height",required:!1,type:{name:"number"}},onDidDismiss:{defaultValue:null,description:"",name:"onDidDismiss",required:!1,type:{name:"(() => void)"}}}}}catch{}export{p as M};
//# sourceMappingURL=Modal-707656e9.js.map
