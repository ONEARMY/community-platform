import { css, Global } from '@emotion/react';
import Academy from 'src/pages/Academy/Academy';
import Main from 'src/pages/common/Layout/Main';
import { generateTags, mergeMeta } from 'src/utils/seo.utils';

export async function loader() {
  return null;
}

export const meta = mergeMeta(() => {
  return generateTags(`Academy - ${import.meta.env.VITE_SITE_NAME}`);
});

export default function Index() {
  return (
    <Main style={{ flex: 1, overflow: 'hidden' }} ignoreMaxWidth={true}>
      <Academy />
      <Global
        styles={css`
          html {
            overflow-y: hidden !important;
          }
        `}
      />
    </Main>
  );
}
