import ResearchList from 'src/pages/Research/Content/ResearchList';
import { SeoTagsUpdateComponent } from 'src/utils/seo';

export async function clientLoader() {
  return null;
}

export default function Index() {
  return (
    <>
      <SeoTagsUpdateComponent title="Research" />
      <ResearchList />
    </>
  );
}
