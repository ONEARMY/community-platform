import { g as U, u as I, p as L } from "./index-r4K4TwPq.mjs";
import M from "react";
function Y(a, e) {
  for (var t = 0; t < e.length; t++) {
    const o = e[t];
    if (typeof o != "string" && !Array.isArray(o)) {
      for (const r in o)
        if (r !== "default" && !(r in a)) {
          const n = Object.getOwnPropertyDescriptor(o, r);
          n && Object.defineProperty(a, r, n.get ? n : {
            enumerable: !0,
            get: () => o[r]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(a, Symbol.toStringTag, { value: "Module" }));
}
var k = Object.create, u = Object.defineProperty, N = Object.getOwnPropertyDescriptor, j = Object.getOwnPropertyNames, V = Object.getPrototypeOf, B = Object.prototype.hasOwnProperty, K = (a, e, t) => e in a ? u(a, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : a[e] = t, x = (a, e) => {
  for (var t in e)
    u(a, t, { get: e[t], enumerable: !0 });
}, v = (a, e, t, o) => {
  if (e && typeof e == "object" || typeof e == "function")
    for (let r of j(e))
      !B.call(a, r) && r !== t && u(a, r, { get: () => e[r], enumerable: !(o = N(e, r)) || o.enumerable });
  return a;
}, F = (a, e, t) => (t = a != null ? k(V(a)) : {}, v(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  !a || !a.__esModule ? u(t, "default", { value: a, enumerable: !0 }) : t,
  a
)), H = (a) => v(u({}, "__esModule", { value: !0 }), a), s = (a, e, t) => (K(a, typeof e != "symbol" ? e + "" : e, t), t), w = {};
x(w, {
  default: () => O
});
var S = H(w), m = F(M), p = I, D = L;
const G = "https://www.youtube.com/iframe_api", T = "YT", z = "onYouTubeIframeAPIReady", f = /[?&](?:list|channel)=([a-zA-Z0-9_-]+)/, b = /user\/([a-zA-Z0-9_-]+)\/?/, Q = /youtube-nocookie\.com/, Z = "https://www.youtube-nocookie.com";
class O extends m.Component {
  constructor() {
    super(...arguments), s(this, "callPlayer", p.callPlayer), s(this, "parsePlaylist", (e) => {
      if (e instanceof Array)
        return {
          listType: "playlist",
          playlist: e.map(this.getID).join(",")
        };
      if (f.test(e)) {
        const [, t] = e.match(f);
        return {
          listType: "playlist",
          list: t.replace(/^UC/, "UU")
        };
      }
      if (b.test(e)) {
        const [, t] = e.match(b);
        return {
          listType: "user_uploads",
          list: t
        };
      }
      return {};
    }), s(this, "onStateChange", (e) => {
      const { data: t } = e, { onPlay: o, onPause: r, onBuffer: n, onBufferEnd: P, onEnded: _, onReady: g, loop: y, config: { playerVars: l, onUnstarted: d } } = this.props, { UNSTARTED: h, PLAYING: c, PAUSED: i, BUFFERING: E, ENDED: A, CUED: C } = window[T].PlayerState;
      if (t === h && d(), t === c && (o(), P()), t === i && r(), t === E && n(), t === A) {
        const R = !!this.callPlayer("getPlaylist");
        y && !R && (l.start ? this.seekTo(l.start) : this.play()), _();
      }
      t === C && g();
    }), s(this, "mute", () => {
      this.callPlayer("mute");
    }), s(this, "unmute", () => {
      this.callPlayer("unMute");
    }), s(this, "ref", (e) => {
      this.container = e;
    });
  }
  componentDidMount() {
    this.props.onMount && this.props.onMount(this);
  }
  getID(e) {
    return !e || e instanceof Array || f.test(e) ? null : e.match(D.MATCH_URL_YOUTUBE)[1];
  }
  load(e, t) {
    const { playing: o, muted: r, playsinline: n, controls: P, loop: _, config: g, onError: y } = this.props, { playerVars: l, embedOptions: d } = g, h = this.getID(e);
    if (t) {
      if (f.test(e) || b.test(e) || e instanceof Array) {
        this.player.loadPlaylist(this.parsePlaylist(e));
        return;
      }
      this.player.cueVideoById({
        videoId: h,
        startSeconds: (0, p.parseStartTime)(e) || l.start,
        endSeconds: (0, p.parseEndTime)(e) || l.end
      });
      return;
    }
    (0, p.getSDK)(G, T, z, (c) => c.loaded).then((c) => {
      this.container && (this.player = new c.Player(this.container, {
        width: "100%",
        height: "100%",
        videoId: h,
        playerVars: {
          autoplay: o ? 1 : 0,
          mute: r ? 1 : 0,
          controls: P ? 1 : 0,
          start: (0, p.parseStartTime)(e),
          end: (0, p.parseEndTime)(e),
          origin: window.location.origin,
          playsinline: n ? 1 : 0,
          ...this.parsePlaylist(e),
          ...l
        },
        events: {
          onReady: () => {
            _ && this.player.setLoop(!0), this.props.onReady();
          },
          onPlaybackRateChange: (i) => this.props.onPlaybackRateChange(i.data),
          onPlaybackQualityChange: (i) => this.props.onPlaybackQualityChange(i),
          onStateChange: this.onStateChange,
          onError: (i) => y(i.data)
        },
        host: Q.test(e) ? Z : void 0,
        ...d
      }));
    }, y), d.events && console.warn("Using `embedOptions.events` will likely break things. Use ReactPlayer’s callback props instead, eg onReady, onPlay, onPause");
  }
  play() {
    this.callPlayer("playVideo");
  }
  pause() {
    this.callPlayer("pauseVideo");
  }
  stop() {
    document.body.contains(this.callPlayer("getIframe")) && this.callPlayer("stopVideo");
  }
  seekTo(e, t = !1) {
    this.callPlayer("seekTo", e), !t && !this.props.playing && this.pause();
  }
  setVolume(e) {
    this.callPlayer("setVolume", e * 100);
  }
  setPlaybackRate(e) {
    this.callPlayer("setPlaybackRate", e);
  }
  setLoop(e) {
    this.callPlayer("setLoop", e);
  }
  getDuration() {
    return this.callPlayer("getDuration");
  }
  getCurrentTime() {
    return this.callPlayer("getCurrentTime");
  }
  getSecondsLoaded() {
    return this.callPlayer("getVideoLoadedFraction") * this.getDuration();
  }
  render() {
    const { display: e } = this.props, t = {
      width: "100%",
      height: "100%",
      display: e
    };
    return /* @__PURE__ */ m.default.createElement("div", { style: t }, /* @__PURE__ */ m.default.createElement("div", { ref: this.ref }));
  }
}
s(O, "displayName", "YouTube");
s(O, "canPlay", D.canPlay.youtube);
const $ = /* @__PURE__ */ U(S), W = /* @__PURE__ */ Y({
  __proto__: null,
  default: $
}, [S]);
export {
  W as Y
};
