import { QuestionListing } from 'src/pages/Question/QuestionListing';
import { generateTags, mergeMeta } from 'src/utils/seo.utils';

export async function loader() {
  return null;
}

export const meta = mergeMeta(() => {
  return generateTags(`Questions - ${import.meta.env.VITE_SITE_NAME}`);
});

export default function Index() {
  return <QuestionListing />;
}
