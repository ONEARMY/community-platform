# Fonts

Custom fonts are imported in [app.globalStyle.js](src\themes\app.globalStyle.js)
This allows them to be more easily combined in the build and work in harmony with the styled components system

See article for more info: https://dev.to/alaskaa/how-to-import-a-web-font-into-your-react-app-with-styled-components-4-1dni

Note - as the platform relies on modern browser feature legacy font formats (ttf, otf) can mostly be ignored in favour of woff2 and woff

Legacy (css) implementation:
Define a `fonts.css` file

```
@font-face {
  font-family: 'Varela Round';
  src: url('./VarelaRound-Regular.eot');
  src: url('./VarelaRound-Regular.woff') format('woff'),
    url('./VarelaRound-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: 'Inter';
  src: url('./Inter-Regular.otf');
  src: url('./Inter-Regular.woff') format('woff'),
    url('./Inter-Regular.woff2') format('woff2'),
    url('./Inter-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: 'Inter';
  src: url('./Inter-Medium.otf');
  src: url('./Inter-Medium.woff') format('woff'),
    url('./Inter-Medium.woff2') format('woff2'),
    url('./Inter-Medium.ttf') format('truetype');
  font-weight: bold;
  font-style: normal;
}

```

Import in `index.html` (note, seemed to break with lazy-loading)

```
    <link
      rel="preload"
      href="%PUBLIC_URL%/fonts/fonts.css"
      as="style"
      crossorigin
    />
```
