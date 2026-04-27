import type { ReactNode } from 'react';
import thankYouLg from 'src/assets/images/thank-you-lg.svg';
import thankYouMd from 'src/assets/images/thank-you-md.svg';
import thankYouSm from 'src/assets/images/thank-you-sm.svg';
import { Flex, Image } from 'theme-ui';

export const ThankYouLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Flex
      sx={{
        maxWidth: 960,
        mx: 'auto',
        my: [3, 5],
        px: [3, 0],
        flexDirection: ['column', 'column', 'row'],
        gap: [4, 6],
        alignItems: ['center', 'center', 'flex-start'],
      }}
    >
      <Flex
        sx={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <picture>
          <source media="(min-width: 70em)" srcSet={thankYouLg} />
          <source media="(min-width: 52em)" srcSet={thankYouMd} />
          <Image src={thankYouSm} alt="Thank you for your support" sx={{ maxWidth: '100%' }} />
        </picture>
      </Flex>

      <Flex
        sx={{
          flexDirection: 'column',
          width: ['100%', '100%', 420],
          flexShrink: 0,
        }}
      >
        {children}
      </Flex>
    </Flex>
  );
};
