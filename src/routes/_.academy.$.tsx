import Academy from 'src/pages/Academy/Academy';
import Main from 'src/pages/common/Layout/Main';

export async function clientLoader() {
  return null;
}

export default function Index() {
  return (
    <Main style={{ flex: 1, overflow: 'hidden' }} ignoreMaxWidth={true}>
      {/* <SeoTagsUpdateComponent title="Academy" /> */}
      <Academy />
      <style
        dangerouslySetInnerHTML={{ __html: `html { overflow-y: hidden !important; }` }}
      ></style>
    </Main>
  );
}
