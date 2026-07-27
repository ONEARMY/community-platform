import { Button, Icon } from 'oa-components';
import { useNavigate } from 'react-router';
import thankYouDefault from 'src/assets/images/thank-you-lg.webp';
import { Flex, Image } from 'theme-ui';
import { useSupporterContext } from './SupporterContext';

export const ThankYouAuthenticatedView = () => {
  const navigate = useNavigate();
  const { thankYouImageUrl } = useSupporterContext();

  return (
    <Flex
      sx={{
        flexDirection: 'column',
        alignItems: 'center',
        mx: 'auto',
        my: 'auto',
        px: [3, 0],
        gap: 3,
        maxWidth: 450,
        flex: 1,
        justifyContent: 'center',
      }}
    >
      <Image
        src={thankYouImageUrl || thankYouDefault}
        alt="Thank you for your support"
        sx={{ maxWidth: '100%' }}
      />

      <Button
        type="button"
        variant="primary"
        onClick={() => navigate('/settings')}
        sx={{
          width: '100%',
          borderRadius: 1,
          justifyContent: 'center',
          '& > span': { display: 'inline-flex', alignItems: 'center', gap: 1 },
        }}
      >
        Continue
        <Icon
          glyph="arrow-forward"
          size={20}
          sx={{ display: 'inline', verticalAlign: 'middle', ml: 1 }}
        />
      </Button>
    </Flex>
  );
};
