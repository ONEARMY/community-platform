import { NewsListing } from 'src/pages/News/NewsListing';
import { generateTags, mergeMeta } from 'src/utils/seo.utils';

export async function loader() {
  return null;
}

export const meta = mergeMeta(() => {
  return generateTags(`Map - ${import.meta.env.VITE_SITE_NAME}`);
});

export default function Index() {
  return <NewsListing />;
}
