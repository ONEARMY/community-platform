import { g as d, u as f, p as m } from "./index-r4K4TwPq.mjs";
import _ from "react";
function P(t, e) {
  for (var r = 0; r < e.length; r++) {
    const a = e[r];
    if (typeof a != "string" && !Array.isArray(a)) {
      for (const s in a)
        if (s !== "default" && !(s in t)) {
          const o = Object.getOwnPropertyDescriptor(a, s);
          o && Object.defineProperty(t, s, o.get ? o : {
            enumerable: !0,
            get: () => a[s]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }));
}
var g = Object.create, n = Object.defineProperty, b = Object.getOwnPropertyDescriptor, v = Object.getOwnPropertyNames, O = Object.getPrototypeOf, D = Object.prototype.hasOwnProperty, w = (t, e, r) => e in t ? n(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r, M = (t, e) => {
  for (var r in e)
    n(t, r, { get: e[r], enumerable: !0 });
}, h = (t, e, r, a) => {
  if (e && typeof e == "object" || typeof e == "function")
    for (let s of v(e))
      !D.call(t, s) && s !== r && n(t, s, { get: () => e[s], enumerable: !(a = b(e, s)) || a.enumerable });
  return t;
}, j = (t, e, r) => (r = t != null ? g(O(t)) : {}, h(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  !t || !t.__esModule ? n(r, "default", { value: t, enumerable: !0 }) : r,
  t
)), L = (t) => h(n({}, "__esModule", { value: !0 }), t), i = (t, e, r) => (w(t, typeof e != "symbol" ? e + "" : e, r), r), c = {};
M(c, {
  default: () => l
});
var y = L(c), p = j(_), u = f, S = m;
const V = "https://player.vimeo.com/api/player.js", E = "Vimeo", k = (t) => t.replace("/manage/videos", "");
class l extends p.Component {
  constructor() {
    super(...arguments), i(this, "callPlayer", u.callPlayer), i(this, "duration", null), i(this, "currentTime", null), i(this, "secondsLoaded", null), i(this, "mute", () => {
      this.setMuted(!0);
    }), i(this, "unmute", () => {
      this.setMuted(!1);
    }), i(this, "ref", (e) => {
      this.container = e;
    });
  }
  componentDidMount() {
    this.props.onMount && this.props.onMount(this);
  }
  load(e) {
    this.duration = null, (0, u.getSDK)(V, E).then((r) => {
      if (!this.container)
        return;
      const { playerOptions: a, title: s } = this.props.config;
      this.player = new r.Player(this.container, {
        url: k(e),
        autoplay: this.props.playing,
        muted: this.props.muted,
        loop: this.props.loop,
        playsinline: this.props.playsinline,
        controls: this.props.controls,
        ...a
      }), this.player.ready().then(() => {
        const o = this.container.querySelector("iframe");
        o.style.width = "100%", o.style.height = "100%", s && (o.title = s);
      }).catch(this.props.onError), this.player.on("loaded", () => {
        this.props.onReady(), this.refreshDuration();
      }), this.player.on("play", () => {
        this.props.onPlay(), this.refreshDuration();
      }), this.player.on("pause", this.props.onPause), this.player.on("seeked", (o) => this.props.onSeek(o.seconds)), this.player.on("ended", this.props.onEnded), this.player.on("error", this.props.onError), this.player.on("timeupdate", ({ seconds: o }) => {
        this.currentTime = o;
      }), this.player.on("progress", ({ seconds: o }) => {
        this.secondsLoaded = o;
      }), this.player.on("bufferstart", this.props.onBuffer), this.player.on("bufferend", this.props.onBufferEnd), this.player.on("playbackratechange", (o) => this.props.onPlaybackRateChange(o.playbackRate));
    }, this.props.onError);
  }
  refreshDuration() {
    this.player.getDuration().then((e) => {
      this.duration = e;
    });
  }
  play() {
    const e = this.callPlayer("play");
    e && e.catch(this.props.onError);
  }
  pause() {
    this.callPlayer("pause");
  }
  stop() {
    this.callPlayer("unload");
  }
  seekTo(e, r = !0) {
    this.callPlayer("setCurrentTime", e), r || this.pause();
  }
  setVolume(e) {
    this.callPlayer("setVolume", e);
  }
  setMuted(e) {
    this.callPlayer("setMuted", e);
  }
  setLoop(e) {
    this.callPlayer("setLoop", e);
  }
  setPlaybackRate(e) {
    this.callPlayer("setPlaybackRate", e);
  }
  getDuration() {
    return this.duration;
  }
  getCurrentTime() {
    return this.currentTime;
  }
  getSecondsLoaded() {
    return this.secondsLoaded;
  }
  render() {
    const { display: e } = this.props, r = {
      width: "100%",
      height: "100%",
      overflow: "hidden",
      display: e
    };
    return /* @__PURE__ */ p.default.createElement(
      "div",
      {
        key: this.props.url,
        ref: this.ref,
        style: r
      }
    );
  }
}
i(l, "displayName", "Vimeo");
i(l, "canPlay", S.canPlay.vimeo);
i(l, "forceLoad", !0);
const R = /* @__PURE__ */ d(y), N = /* @__PURE__ */ P({
  __proto__: null,
  default: R
}, [y]);
export {
  N as V
};
