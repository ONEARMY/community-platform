import { NewsListing } from 'src/pages/News/NewsListing';
import { SeoTagsUpdateComponent } from 'src/utils/seo';

export async function clientLoader() {
  return null;
}

export default function Index() {
  return (
    <>
      <SeoTagsUpdateComponent title="News" />
      <NewsListing />
    </>
  );
}
