import Main from 'src/pages/common/Layout/Main';
import PrivacyPolicy from 'src/pages/policy/PrivacyPolicy';
import { generateTags } from 'src/utils/seo.utils';

export const meta = generateTags('Privacy Policy');

export default function Index() {
  return (
    <Main style={{ flex: 1 }}>
      <PrivacyPolicy />
    </Main>
  );
}
