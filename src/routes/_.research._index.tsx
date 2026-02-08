import ResearchList from 'src/pages/Research/Content/ResearchList';
import { generateTags, mergeMeta } from 'src/utils/seo.utils';

export async function loader() {
  return null;
}

export const meta = mergeMeta(() => {
  return generateTags(`Research - ${import.meta.env.VITE_SITE_NAME}`);
});

export default function Index() {
  return <ResearchList />;
}
