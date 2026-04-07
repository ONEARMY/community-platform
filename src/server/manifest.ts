export function getManifest(env) {

  return {
    name: env.APP_NAME,
    short_name: env.APP_SHORT_NAME,
    start_url: "/",
    display: "standalone",
    theme_color: env.THEME_COLOR,
    background_color: "#ffffff",

    icons: [
      {
        src: env.ICON_192,
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: env.ICON_512,
        sizes: "512x512",
        type: "image/png"
      }
    ]
  };
}