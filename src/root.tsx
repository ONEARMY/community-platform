import { Global, withEmotionCache } from '@emotion/react';
import { ThemeProvider } from '@theme-ui/core';
import { GlobalStyles } from 'oa-components';
import { fixingFashionTheme, preciousPlasticTheme, projectKampTheme } from 'oa-themes';
import { useContext, useEffect, useRef } from 'react';
import type { LinksFunction, MetaFunction } from 'react-router';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import { VITE_THEME } from './config/config';
import { ClientStyleContext, ServerStyleContext } from './styles/context';
import { generateTags } from './utils/seo.utils';

interface DocumentProps {
  children: React.ReactNode;
}

const Document = withEmotionCache(({ children }: DocumentProps, emotionCache) => {
  const serverStyleData = useContext(ServerStyleContext);
  const clientStyleData = useContext(ClientStyleContext);
  const reinjectStylesRef = useRef(true);
  // const isProd = import.meta.env.VITE_BRANCH === 'production';

  // Only executed on client
  // When a top level ErrorBoundary or CatchBoundary are rendered,
  // the document head gets removed, so we have to create the style tags
  useEffect(() => {
    if (!reinjectStylesRef.current) {
      return;
    }
    // re-link sheet container
    emotionCache.sheet.container = document.head;

    // re-inject tags
    const tags = emotionCache.sheet.tags;
    emotionCache.sheet.flush();
    tags.forEach((tag) => {
      (emotionCache.sheet as any)._insertTag(tag);
    });

    // reset cache to re-apply global styles
    clientStyleData!.reset();
    // ensure we only do this once per mount
    reinjectStylesRef.current = false;
  }, [clientStyleData, emotionCache.sheet]);

  return (
    <html lang="en" style={{ overflowY: 'scroll' }}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <link rel="preconnect" href="https://storage.googleapis.com" crossOrigin="anonymous" />
        <Meta />
        <Links />
        {serverStyleData?.map(({ key, ids, css }) => (
          <style
            key={key}
            data-emotion={`${key} ${ids.join(' ')}`}
            dangerouslySetInnerHTML={{ __html: css }}
          />
        ))}
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
});

const getEnvironmentTheme = () => {
  switch (VITE_THEME) {
    case 'project-kamp':
      return projectKampTheme;
    case 'fixing-fashion':
      return fixingFashionTheme;
    case 'precious-plastic':
    default:
      return preciousPlasticTheme;
  }
};

export const links: LinksFunction = () => {
  return [
    {
      rel: 'icon',
      href: '/api/favicon',
      type: 'image/x-icon',
    },
  ];
};

export const meta: MetaFunction = () => {
  const theme = getEnvironmentTheme();
  const tags = generateTags(theme.siteName, theme.description);

  if (import.meta.env.VITE_BRANCH !== 'production') {
    tags.push({
      name: 'robots',
      content: 'noindex',
    });
  }

  return tags;
};

export default function Root() {
  return (
    <Document>
      <ThemeProvider theme={getEnvironmentTheme().styles}>
        <Outlet />
        <Global styles={GlobalStyles} />
      </ThemeProvider>
    </Document>
  );
}
