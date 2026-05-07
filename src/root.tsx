import { Global, withEmotionCache } from '@emotion/react';
import { ThemeProvider } from '@theme-ui/core';
import { GlobalStyles } from 'oa-components';
import { theme } from 'oa-themes';
import { useContext, useEffect, useRef } from 'react';
import type { LinksFunction, LoaderFunctionArgs, MetaFunction } from 'react-router';
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from 'react-router';
import { createSupabaseServerClient } from './repository/supabase.server';
import { TenantSettingsService } from './services/tenantSettingsService.server';
import { ClientStyleContext, ServerStyleContext } from './styles/context';
import { generateTags } from './utils/seo.utils';

interface DocumentProps {
  children: React.ReactNode;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = createSupabaseServerClient(request);
  const settings = await new TenantSettingsService(client).get();

  return {
    colorPrimary: settings.colorPrimary,
    colorPrimaryHover: settings.colorPrimaryHover,
    colorAccent: settings.colorAccent,
    colorAccentHover: settings.colorAccentHover,
    siteName: settings.siteName,
    siteDescription: settings.siteDescription,
  };
}

const Document = withEmotionCache(({ children }: DocumentProps, emotionCache) => {
  const loaderData = useLoaderData<typeof loader>();
  const serverStyleData = useContext(ServerStyleContext);
  const clientStyleData = useContext(ClientStyleContext);
  const reinjectStylesRef = useRef(true);

  const cssVars = `
    --color-primary: ${loaderData.colorPrimary};
    --color-primary-hover: ${loaderData.colorPrimaryHover};
    --color-accent: ${loaderData.colorAccent};
    --color-accent-hover: ${loaderData.colorAccentHover};
  `;

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
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <link rel="preconnect" href="https://storage.googleapis.com" crossOrigin="anonymous" />
        <Meta />
        <Links />
        <style dangerouslySetInnerHTML={{ __html: `:root { ${cssVars} }` }} />

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

export const links: LinksFunction = () => {
  return [
    {
      rel: 'icon',
      href: '/api/favicon',
      type: 'image/x-icon',
    },
    {
      rel: 'manifest',
      href: '/manifest.webmanifest',
    },
  ];
};

export const meta: MetaFunction<typeof loader> = ({ loaderData }) => {
  const tags = generateTags(
    loaderData?.siteName || '',
    loaderData?.siteDescription || undefined,
    '/social-image.jpg',
    { siteName: loaderData?.siteName },
  );

  tags.push({
    name: 'theme-color',
    content: loaderData?.colorPrimary || '#000',
  });

  // iOS PWA meta tags
  tags.push({ name: 'apple-mobile-web-app-capable', content: 'yes' });
  tags.push({
    name: 'apple-mobile-web-app-status-bar-style',
    content: 'default',
  });
  tags.push({
    name: 'apple-mobile-web-app-title',
    content: loaderData?.siteName || '',
  });

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
      <ThemeProvider theme={theme}>
        <Outlet />
        <Global styles={GlobalStyles} />
      </ThemeProvider>
    </Document>
  );
}
