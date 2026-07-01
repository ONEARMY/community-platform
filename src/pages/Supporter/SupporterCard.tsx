import type { ReactNode } from 'react';
import { Card, Flex, Heading, Image } from 'theme-ui';

export const SupporterCard = ({
  siteImage,
  heading,
  children,
}: {
  siteImage?: string;
  heading: string;
  children: ReactNode;
}) => (
  <>
    {siteImage && (
      <Flex
        sx={{ justifyContent: 'center', mb: ['-44px', '-34px'], position: 'relative', zIndex: 1 }}
      >
        <Image
          src={siteImage}
          sx={{
            width: ['130px', '100px'],
            height: ['130px', '100px'],
            borderRadius: '50%',
            objectFit: 'cover',
          }}
          alt="Site logo"
        />
      </Flex>
    )}

    <Card
      sx={{
        borderRadius: '15px',
        border: '1px solid rgba(27, 27, 27, 0.09)',
        boxShadow: '0px 44px 54px rgba(0, 0, 0, 0.06)',
        px: ['20px', '64px'],
        pt: siteImage ? ['50px', '40px'] : '50px',
        pb: ['30px', '64px'],
      }}
    >
      <Flex sx={{ flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
        <Heading
          as="h1"
          sx={{
            fontSize: '28px',
            textAlign: 'center',
            letterSpacing: '-0.01em',
            maxWidth: '300px',
          }}
        >
          {heading}
        </Heading>

        {children}
      </Flex>
    </Card>
  </>
);
