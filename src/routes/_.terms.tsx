import Main from 'src/pages/common/Layout/Main';
import TermsPolicy from 'src/pages/policy/TermsPolicy';
import { generateTags } from 'src/utils/seo.utils';

export const meta = generateTags('Terms of Use');

export default function Index() {
  return (
    <Main style={{ flex: 1 }}>
      <TermsPolicy />
    </Main>
  );
}
