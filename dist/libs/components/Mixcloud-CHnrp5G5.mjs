import { g as y, u as f, p as m } from "./index-r4K4TwPq.mjs";
import g from "react";
function v(t, e) {
  for (var r = 0; r < e.length; r++) {
    const s = e[r];
    if (typeof s != "string" && !Array.isArray(s)) {
      for (const o in s)
        if (o !== "default" && !(o in t)) {
          const n = Object.getOwnPropertyDescriptor(s, o);
          n && Object.defineProperty(t, o, n.get ? n : {
            enumerable: !0,
            get: () => s[o]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }));
}
var P = Object.create, i = Object.defineProperty, O = Object.getOwnPropertyDescriptor, b = Object.getOwnPropertyNames, M = Object.getPrototypeOf, w = Object.prototype.hasOwnProperty, x = (t, e, r) => e in t ? i(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r, j = (t, e) => {
  for (var r in e)
    i(t, r, { get: e[r], enumerable: !0 });
}, c = (t, e, r, s) => {
  if (e && typeof e == "object" || typeof e == "function")
    for (let o of b(e))
      !w.call(t, o) && o !== r && i(t, o, { get: () => e[o], enumerable: !(s = O(e, o)) || s.enumerable });
  return t;
}, D = (t, e, r) => (r = t != null ? P(M(t)) : {}, c(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  !t || !t.__esModule ? i(r, "default", { value: t, enumerable: !0 }) : r,
  t
)), S = (t) => c(i({}, "__esModule", { value: !0 }), t), a = (t, e, r) => (x(t, typeof e != "symbol" ? e + "" : e, r), r), d = {};
j(d, {
  default: () => l
});
var h = S(d), p = D(g), u = f, _ = m;
const L = "https://widget.mixcloud.com/media/js/widgetApi.js", T = "Mixcloud";
class l extends p.Component {
  constructor() {
    super(...arguments), a(this, "callPlayer", u.callPlayer), a(this, "duration", null), a(this, "currentTime", null), a(this, "secondsLoaded", null), a(this, "mute", () => {
    }), a(this, "unmute", () => {
    }), a(this, "ref", (e) => {
      this.iframe = e;
    });
  }
  componentDidMount() {
    this.props.onMount && this.props.onMount(this);
  }
  load(e) {
    (0, u.getSDK)(L, T).then((r) => {
      this.player = r.PlayerWidget(this.iframe), this.player.ready.then(() => {
        this.player.events.play.on(this.props.onPlay), this.player.events.pause.on(this.props.onPause), this.player.events.ended.on(this.props.onEnded), this.player.events.error.on(this.props.error), this.player.events.progress.on((s, o) => {
          this.currentTime = s, this.duration = o;
        }), this.props.onReady();
      });
    }, this.props.onError);
  }
  play() {
    this.callPlayer("play");
  }
  pause() {
    this.callPlayer("pause");
  }
  stop() {
  }
  seekTo(e, r = !0) {
    this.callPlayer("seek", e), r || this.pause();
  }
  setVolume(e) {
  }
  getDuration() {
    return this.duration;
  }
  getCurrentTime() {
    return this.currentTime;
  }
  getSecondsLoaded() {
    return null;
  }
  render() {
    const { url: e, config: r } = this.props, s = e.match(_.MATCH_URL_MIXCLOUD)[1], o = {
      width: "100%",
      height: "100%"
    }, n = (0, u.queryString)({
      ...r.options,
      feed: `/${s}/`
    });
    return /* @__PURE__ */ p.default.createElement(
      "iframe",
      {
        key: s,
        ref: this.ref,
        style: o,
        src: `https://www.mixcloud.com/widget/iframe/?${n}`,
        frameBorder: "0",
        allow: "autoplay"
      }
    );
  }
}
a(l, "displayName", "Mixcloud");
a(l, "canPlay", _.canPlay.mixcloud);
a(l, "loopOnEnded", !0);
const C = /* @__PURE__ */ y(h), A = /* @__PURE__ */ v({
  __proto__: null,
  default: C
}, [h]);
export {
  A as M
};
