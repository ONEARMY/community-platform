import { LibraryList } from 'src/pages/Library/Content/List/LibraryList';
import { generateTags, mergeMeta } from 'src/utils/seo.utils';

export async function loader() {
  return null;
}

export const meta = mergeMeta(() => {
  return generateTags(`Library - ${import.meta.env.VITE_SITE_NAME}`);
});

export default function Index() {
  return <LibraryList />;
}
