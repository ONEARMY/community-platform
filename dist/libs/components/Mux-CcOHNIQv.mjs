import { g as P, p as g } from "./index-r4K4TwPq.mjs";
import E from "react";
function b(r, e) {
  for (var t = 0; t < e.length; t++) {
    const i = e[t];
    if (typeof i != "string" && !Array.isArray(i)) {
      for (const s in i)
        if (s !== "default" && !(s in r)) {
          const o = Object.getOwnPropertyDescriptor(i, s);
          o && Object.defineProperty(r, s, o.get ? o : {
            enumerable: !0,
            get: () => i[s]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(r, Symbol.toStringTag, { value: "Module" }));
}
var _ = Object.create, a = Object.defineProperty, L = Object.getOwnPropertyDescriptor, k = Object.getOwnPropertyNames, I = Object.getPrototypeOf, O = Object.prototype.hasOwnProperty, M = (r, e, t) => e in r ? a(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t, x = (r, e) => {
  for (var t in e)
    a(r, t, { get: e[t], enumerable: !0 });
}, v = (r, e, t, i) => {
  if (e && typeof e == "object" || typeof e == "function")
    for (let s of k(e))
      !O.call(r, s) && s !== t && a(r, s, { get: () => e[s], enumerable: !(i = L(e, s)) || i.enumerable });
  return r;
}, R = (r, e, t) => (t = r != null ? _(I(r)) : {}, v(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  !r || !r.__esModule ? a(t, "default", { value: r, enumerable: !0 }) : t,
  r
)), w = (r) => v(a({}, "__esModule", { value: !0 }), r), n = (r, e, t) => (M(r, typeof e != "symbol" ? e + "" : e, t), t), y = {};
x(y, {
  default: () => l
});
var m = w(y), f = R(E), p = g;
const D = "https://cdn.jsdelivr.net/npm/@mux/mux-player@VERSION/dist/mux-player.mjs";
class l extends f.Component {
  constructor() {
    super(...arguments), n(this, "onReady", (...e) => this.props.onReady(...e)), n(this, "onPlay", (...e) => this.props.onPlay(...e)), n(this, "onBuffer", (...e) => this.props.onBuffer(...e)), n(this, "onBufferEnd", (...e) => this.props.onBufferEnd(...e)), n(this, "onPause", (...e) => this.props.onPause(...e)), n(this, "onEnded", (...e) => this.props.onEnded(...e)), n(this, "onError", (...e) => this.props.onError(...e)), n(this, "onPlayBackRateChange", (e) => this.props.onPlaybackRateChange(e.target.playbackRate)), n(this, "onEnablePIP", (...e) => this.props.onEnablePIP(...e)), n(this, "onSeek", (e) => {
      this.props.onSeek(e.target.currentTime);
    }), n(this, "onDurationChange", () => {
      const e = this.getDuration();
      this.props.onDuration(e);
    }), n(this, "mute", () => {
      this.player.muted = !0;
    }), n(this, "unmute", () => {
      this.player.muted = !1;
    }), n(this, "ref", (e) => {
      this.player = e;
    });
  }
  componentDidMount() {
    this.props.onMount && this.props.onMount(this), this.addListeners(this.player);
    const e = this.getPlaybackId(this.props.url);
    e && (this.player.playbackId = e);
  }
  componentWillUnmount() {
    this.player.playbackId = null, this.removeListeners(this.player);
  }
  addListeners(e) {
    const { playsinline: t } = this.props;
    e.addEventListener("play", this.onPlay), e.addEventListener("waiting", this.onBuffer), e.addEventListener("playing", this.onBufferEnd), e.addEventListener("pause", this.onPause), e.addEventListener("seeked", this.onSeek), e.addEventListener("ended", this.onEnded), e.addEventListener("error", this.onError), e.addEventListener("ratechange", this.onPlayBackRateChange), e.addEventListener("enterpictureinpicture", this.onEnablePIP), e.addEventListener("leavepictureinpicture", this.onDisablePIP), e.addEventListener("webkitpresentationmodechanged", this.onPresentationModeChange), e.addEventListener("canplay", this.onReady), t && e.setAttribute("playsinline", "");
  }
  removeListeners(e) {
    e.removeEventListener("canplay", this.onReady), e.removeEventListener("play", this.onPlay), e.removeEventListener("waiting", this.onBuffer), e.removeEventListener("playing", this.onBufferEnd), e.removeEventListener("pause", this.onPause), e.removeEventListener("seeked", this.onSeek), e.removeEventListener("ended", this.onEnded), e.removeEventListener("error", this.onError), e.removeEventListener("ratechange", this.onPlayBackRateChange), e.removeEventListener("enterpictureinpicture", this.onEnablePIP), e.removeEventListener("leavepictureinpicture", this.onDisablePIP), e.removeEventListener("canplay", this.onReady);
  }
  async load(e) {
    var t;
    const { onError: i, config: s } = this.props;
    if (!((t = globalThis.customElements) != null && t.get("mux-player")))
      try {
        await import(
          /* webpackIgnore: true */
          `${D.replace("VERSION", s.version)}`
        ), this.props.onLoaded();
      } catch (u) {
        i(u);
      }
    const [, o] = e.match(p.MATCH_URL_MUX);
    this.player.playbackId = o;
  }
  play() {
    const e = this.player.play();
    e && e.catch(this.props.onError);
  }
  pause() {
    this.player.pause();
  }
  stop() {
    this.player.playbackId = null;
  }
  seekTo(e, t = !0) {
    this.player.currentTime = e, t || this.pause();
  }
  setVolume(e) {
    this.player.volume = e;
  }
  enablePIP() {
    this.player.requestPictureInPicture && document.pictureInPictureElement !== this.player && this.player.requestPictureInPicture();
  }
  disablePIP() {
    document.exitPictureInPicture && document.pictureInPictureElement === this.player && document.exitPictureInPicture();
  }
  setPlaybackRate(e) {
    try {
      this.player.playbackRate = e;
    } catch (t) {
      this.props.onError(t);
    }
  }
  getDuration() {
    if (!this.player)
      return null;
    const { duration: e, seekable: t } = this.player;
    return e === 1 / 0 && t.length > 0 ? t.end(t.length - 1) : e;
  }
  getCurrentTime() {
    return this.player ? this.player.currentTime : null;
  }
  getSecondsLoaded() {
    if (!this.player)
      return null;
    const { buffered: e } = this.player;
    if (e.length === 0)
      return 0;
    const t = e.end(e.length - 1), i = this.getDuration();
    return t > i ? i : t;
  }
  getPlaybackId(e) {
    const [, t] = e.match(p.MATCH_URL_MUX);
    return t;
  }
  render() {
    const { url: e, playing: t, loop: i, controls: s, muted: o, config: u, width: h, height: c } = this.props, d = {
      width: h === "auto" ? h : "100%",
      height: c === "auto" ? c : "100%"
    };
    return s === !1 && (d["--controls"] = "none"), /* @__PURE__ */ f.default.createElement(
      "mux-player",
      {
        ref: this.ref,
        "playback-id": this.getPlaybackId(e),
        style: d,
        preload: "auto",
        autoPlay: t || void 0,
        muted: o ? "" : void 0,
        loop: i ? "" : void 0,
        ...u.attributes
      }
    );
  }
}
n(l, "displayName", "Mux");
n(l, "canPlay", p.canPlay.mux);
const j = /* @__PURE__ */ P(m), B = /* @__PURE__ */ b({
  __proto__: null,
  default: j
}, [m]);
export {
  B as M
};
