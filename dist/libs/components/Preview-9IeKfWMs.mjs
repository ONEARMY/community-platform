import { g as y } from "./index-r4K4TwPq.mjs";
import v from "react";
function w(r, e) {
  for (var t = 0; t < e.length; t++) {
    const n = e[t];
    if (typeof n != "string" && !Array.isArray(n)) {
      for (const a in n)
        if (a !== "default" && !(a in r)) {
          const o = Object.getOwnPropertyDescriptor(n, a);
          o && Object.defineProperty(r, a, o.get ? o : {
            enumerable: !0,
            get: () => n[a]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(r, Symbol.toStringTag, { value: "Module" }));
}
var P = Object.create, s = Object.defineProperty, O = Object.getOwnPropertyDescriptor, x = Object.getOwnPropertyNames, I = Object.getPrototypeOf, j = Object.prototype.hasOwnProperty, S = (r, e, t) => e in r ? s(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t, E = (r, e) => {
  for (var t in e)
    s(r, t, { get: e[t], enumerable: !0 });
}, _ = (r, e, t, n) => {
  if (e && typeof e == "object" || typeof e == "function")
    for (let a of x(e))
      !j.call(r, a) && a !== t && s(r, a, { get: () => e[a], enumerable: !(n = O(e, a)) || n.enumerable });
  return r;
}, C = (r, e, t) => (t = r != null ? P(I(r)) : {}, _(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  !r || !r.__esModule ? s(t, "default", { value: r, enumerable: !0 }) : t,
  r
)), N = (r) => _(s({}, "__esModule", { value: !0 }), r), p = (r, e, t) => (S(r, typeof e != "symbol" ? e + "" : e, t), t), g = {};
E(g, {
  default: () => k
});
var m = N(g), i = C(v);
const u = "64px", d = {};
class k extends i.Component {
  constructor() {
    super(...arguments), p(this, "mounted", !1), p(this, "state", {
      image: null
    }), p(this, "handleKeyPress", (e) => {
      (e.key === "Enter" || e.key === " ") && this.props.onClick();
    });
  }
  componentDidMount() {
    this.mounted = !0, this.fetchImage(this.props);
  }
  componentDidUpdate(e) {
    const { url: t, light: n } = this.props;
    (e.url !== t || e.light !== n) && this.fetchImage(this.props);
  }
  componentWillUnmount() {
    this.mounted = !1;
  }
  fetchImage({ url: e, light: t, oEmbedUrl: n }) {
    if (!i.default.isValidElement(t)) {
      if (typeof t == "string") {
        this.setState({ image: t });
        return;
      }
      if (d[e]) {
        this.setState({ image: d[e] });
        return;
      }
      return this.setState({ image: null }), window.fetch(n.replace("{url}", e)).then((a) => a.json()).then((a) => {
        if (a.thumbnail_url && this.mounted) {
          const o = a.thumbnail_url.replace("height=100", "height=480").replace("-d_295x166", "-d_640");
          this.setState({ image: o }), d[e] = o;
        }
      });
    }
  }
  render() {
    const { light: e, onClick: t, playIcon: n, previewTabIndex: a, previewAriaLabel: o } = this.props, { image: f } = this.state, l = i.default.isValidElement(e), h = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }, c = {
      preview: {
        width: "100%",
        height: "100%",
        backgroundImage: f && !l ? `url(${f})` : void 0,
        backgroundSize: "cover",
        backgroundPosition: "center",
        cursor: "pointer",
        ...h
      },
      shadow: {
        background: "radial-gradient(rgb(0, 0, 0, 0.3), rgba(0, 0, 0, 0) 60%)",
        borderRadius: u,
        width: u,
        height: u,
        position: l ? "absolute" : void 0,
        ...h
      },
      playIcon: {
        borderStyle: "solid",
        borderWidth: "16px 0 16px 26px",
        borderColor: "transparent transparent transparent white",
        marginLeft: "7px"
      }
    }, b = /* @__PURE__ */ i.default.createElement("div", { style: c.shadow, className: "react-player__shadow" }, /* @__PURE__ */ i.default.createElement("div", { style: c.playIcon, className: "react-player__play-icon" }));
    return /* @__PURE__ */ i.default.createElement(
      "div",
      {
        style: c.preview,
        className: "react-player__preview",
        onClick: t,
        tabIndex: a,
        onKeyPress: this.handleKeyPress,
        ...o ? { "aria-label": o } : {}
      },
      l ? e : null,
      n || b
    );
  }
}
const D = /* @__PURE__ */ y(m), K = /* @__PURE__ */ w({
  __proto__: null,
  default: D
}, [m]);
export {
  K as P
};
