import { QuestionListing } from 'src/pages/Question/QuestionListing';
import { SeoTagsUpdateComponent } from 'src/utils/seo';

export async function clientLoader() {
  return null;
}

export default function Index() {
  return (
    <>
      <SeoTagsUpdateComponent title="Questions" />
      <QuestionListing />
    </>
  );
}
