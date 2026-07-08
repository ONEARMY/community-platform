import oneArmyLogo from 'packages/components/assets/images/one-army-logo.png';
import ppLogo from 'packages/components/assets/images/precious-plastic-logo-official.svg';
import projectKampLogo from 'packages/components/assets/images/themes/project-kamp/project-kamp-header.png';
import type { ReactNode } from 'react';
import thankYouLg from 'src/assets/images/thank-you-lg.webp';
import thankYouMd from 'src/assets/images/thank-you-md.webp';
import thankYouSm from 'src/assets/images/thank-you-sm.webp';
import fixingFashionLogo from 'src/assets/images/themes/fixing-fashion/fixing-fashion-header.png';
import { Flex, Image, Text } from 'theme-ui';
import { useSupporterContext } from './SupporterContext';

export const ThankYouLayout = ({ children }: { children: ReactNode }) => {
  const { thankYouImageUrl } = useSupporterContext();
  // TODO: we discussed pulling the html from the blue section below

  return (
    <Flex
      sx={{
        maxWidth: 1200,
        mx: 'auto',
        my: 'auto',
        px: [3, 0],
        flex: 1,
        flexDirection: ['column', 'column', 'row'],
        gap: [4, 6],
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Flex
        sx={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {thankYouImageUrl ? (
          <Image
            src={thankYouImageUrl}
            alt="Thank you for your support"
            sx={{ maxWidth: '100%' }}
          />
        ) : (
          <picture>
            <source media="(min-width: 70em)" srcSet={thankYouLg} />
            <source media="(min-width: 52em)" srcSet={thankYouMd} />
            <Image src={thankYouSm} alt="Thank you for your support" sx={{ maxWidth: '100%' }} />
          </picture>
        )}
      </Flex>

      <Flex
        sx={{
          flexDirection: 'column',
          width: ['100%', '100%', 544],
          flexShrink: 0,
          gap: '10px',
        }}
      >
        {children}

        <Flex
          sx={{
            bg: '#deedf2',
            borderRadius: 3,
            px: '20px',
            py: '20px',
            textAlign: 'center',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <Flex sx={{ justifyContent: 'center' }}>
            <Image
              src={ppLogo}
              alt="Precious Plastic"
              sx={{
                width: 36,
                height: 36,
                zIndex: 3,
              }}
            />
            <Image
              src={projectKampLogo}
              alt="Project Kamp"
              sx={{
                width: 36,
                height: 36,
                ml: '-10px',
                zIndex: 2,
              }}
            />
            <Image
              src={fixingFashionLogo}
              alt="Fixing Fashion"
              sx={{
                width: 36,
                height: 36,
                ml: '-10px',
                zIndex: 1,
              }}
            />
          </Flex>
          <Flex sx={{ justifyContent: 'center', alignItems: 'center', gap: 1 }}>
            <Text sx={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
              Many projects, One Army
            </Text>
            <Image src={oneArmyLogo} alt="" sx={{ width: 20, height: 20 }} />
          </Flex>
          <Text sx={{ fontSize: '12px', lineHeight: 1.5, color: '#666', textAlign: 'left' }}>
            Precious Plastic is part of{' '}
            <a
              href="https://onearmy.earth/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#666', textDecoration: 'underline' }}
            >
              One Army
            </a>
            . Use the same account for Precious Plastic, Project Kamp, and all the One Army
            community platforms.
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};
