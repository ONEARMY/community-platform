import { g as m, u as g, p as v } from "./index-r4K4TwPq.mjs";
import w from "react";
function O(t, e) {
  for (var a = 0; a < e.length; a++) {
    const s = e[a];
    if (typeof s != "string" && !Array.isArray(s)) {
      for (const r in s)
        if (r !== "default" && !(r in t)) {
          const o = Object.getOwnPropertyDescriptor(s, r);
          o && Object.defineProperty(t, r, o.get ? o : {
            enumerable: !0,
            get: () => s[r]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }));
}
var C = Object.create, i = Object.defineProperty, k = Object.getOwnPropertyDescriptor, D = Object.getOwnPropertyNames, R = Object.getPrototypeOf, S = Object.prototype.hasOwnProperty, E = (t, e, a) => e in t ? i(t, e, { enumerable: !0, configurable: !0, writable: !0, value: a }) : t[e] = a, j = (t, e) => {
  for (var a in e)
    i(t, a, { get: e[a], enumerable: !0 });
}, h = (t, e, a, s) => {
  if (e && typeof e == "object" || typeof e == "function")
    for (let r of D(e))
      !S.call(t, r) && r !== a && i(t, r, { get: () => e[r], enumerable: !(s = k(e, r)) || s.enumerable });
  return t;
}, I = (t, e, a) => (a = t != null ? C(R(t)) : {}, h(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  !t || !t.__esModule ? i(a, "default", { value: t, enumerable: !0 }) : a,
  t
)), M = (t) => h(i({}, "__esModule", { value: !0 }), t), n = (t, e, a) => (E(t, typeof e != "symbol" ? e + "" : e, a), a), d = {};
j(d, {
  default: () => l
});
var _ = M(d), y = I(w), c = g, P = v;
const W = "https://fast.wistia.com/assets/external/E-v1.js", A = "Wistia", L = "wistia-player-";
class l extends y.Component {
  constructor() {
    super(...arguments), n(this, "callPlayer", c.callPlayer), n(this, "playerID", this.props.config.playerId || `${L}${(0, c.randomString)()}`), n(this, "onPlay", (...e) => this.props.onPlay(...e)), n(this, "onPause", (...e) => this.props.onPause(...e)), n(this, "onSeek", (...e) => this.props.onSeek(...e)), n(this, "onEnded", (...e) => this.props.onEnded(...e)), n(this, "onPlaybackRateChange", (...e) => this.props.onPlaybackRateChange(...e)), n(this, "mute", () => {
      this.callPlayer("mute");
    }), n(this, "unmute", () => {
      this.callPlayer("unmute");
    });
  }
  componentDidMount() {
    this.props.onMount && this.props.onMount(this);
  }
  load(e) {
    const { playing: a, muted: s, controls: r, onReady: o, config: p, onError: b } = this.props;
    (0, c.getSDK)(W, A).then((f) => {
      p.customControls && p.customControls.forEach((u) => f.defineControl(u)), window._wq = window._wq || [], window._wq.push({
        id: this.playerID,
        options: {
          autoPlay: a,
          silentAutoPlay: "allow",
          muted: s,
          controlsVisibleOnLoad: r,
          fullscreenButton: r,
          playbar: r,
          playbackRateControl: r,
          qualityControl: r,
          volumeControl: r,
          settingsControl: r,
          smallPlayButton: r,
          ...p.options
        },
        onReady: (u) => {
          this.player = u, this.unbind(), this.player.bind("play", this.onPlay), this.player.bind("pause", this.onPause), this.player.bind("seek", this.onSeek), this.player.bind("end", this.onEnded), this.player.bind("playbackratechange", this.onPlaybackRateChange), o();
        }
      });
    }, b);
  }
  unbind() {
    this.player.unbind("play", this.onPlay), this.player.unbind("pause", this.onPause), this.player.unbind("seek", this.onSeek), this.player.unbind("end", this.onEnded), this.player.unbind("playbackratechange", this.onPlaybackRateChange);
  }
  play() {
    this.callPlayer("play");
  }
  pause() {
    this.callPlayer("pause");
  }
  stop() {
    this.unbind(), this.callPlayer("remove");
  }
  seekTo(e, a = !0) {
    this.callPlayer("time", e), a || this.pause();
  }
  setVolume(e) {
    this.callPlayer("volume", e);
  }
  setPlaybackRate(e) {
    this.callPlayer("playbackRate", e);
  }
  getDuration() {
    return this.callPlayer("duration");
  }
  getCurrentTime() {
    return this.callPlayer("time");
  }
  getSecondsLoaded() {
    return null;
  }
  render() {
    const { url: e } = this.props, a = e && e.match(P.MATCH_URL_WISTIA)[1], s = `wistia_embed wistia_async_${a}`, r = {
      width: "100%",
      height: "100%"
    };
    return /* @__PURE__ */ y.default.createElement("div", { id: this.playerID, key: a, className: s, style: r });
  }
}
n(l, "displayName", "Wistia");
n(l, "canPlay", P.canPlay.wistia);
n(l, "loopOnEnded", !0);
const N = /* @__PURE__ */ m(_), $ = /* @__PURE__ */ O({
  __proto__: null,
  default: N
}, [_]);
export {
  $ as W
};
