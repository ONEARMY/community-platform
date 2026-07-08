import { Button, Icon } from 'oa-components';
import { useNavigate } from 'react-router';
import thankYouLg from 'src/assets/images/thank-you-lg.webp';
import thankYouMd from 'src/assets/images/thank-you-md.webp';
import thankYouSm from 'src/assets/images/thank-you-sm.webp';
import { Flex, Image, Text } from 'theme-ui';
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
      {thankYouImageUrl ? (
        <Image src={thankYouImageUrl} alt="Thank you for your support" sx={{ maxWidth: '100%' }} />
      ) : (
        <picture>
          <source media="(min-width: 70em)" srcSet={thankYouLg} />
          <source media="(min-width: 52em)" srcSet={thankYouMd} />
          <Image src={thankYouSm} alt="Thank you for your support" sx={{ maxWidth: '100%' }} />
        </picture>
      )}

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
