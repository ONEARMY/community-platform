function f(t){return f=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},f(t)}function o(t,e){if(f(t)!=="object"||t===null)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var n=r.call(t,e||"default");if(f(n)!=="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}function l(t){var e=o(t,"string");return f(e)==="symbol"?e:String(e)}function u(t,e,r){return e=l(e),e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function i(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,l(n.key),n)}}function a(t,e,r){return e&&i(t.prototype,e),r&&i(t,r),Object.defineProperty(t,"prototype",{writable:!1}),t}export{u as _,a,f as b};
//# sourceMappingURL=createClass-020e4422.js.map