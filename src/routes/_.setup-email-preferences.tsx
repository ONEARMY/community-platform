import Main from 'src/pages/common/Layout/Main';
import { EmailPreferences } from 'src/pages/SignUp/EmailPreferences';
import { Card, Flex } from 'theme-ui';

export default function Index() {
  return (
    <Main style={{ flex: 1 }}>
      <Flex
        sx={{
          bg: 'inherit',
          px: 2,
          width: '100%',
          maxWidth: '620px',
          mx: 'auto',
          mt: [5, 10],
          mb: 3,
        }}
      >
        <Card sx={{ borderRadius: 3, width: '100%' }}>
          <Flex
            sx={{
              flexDirection: 'column',
              padding: 4,
              gap: 4,
              width: '100%',
            }}
          >
            <EmailPreferences />
          </Flex>
        </Card>
      </Flex>
    </Main>
  );
}
