import { Button, Icon, Select } from 'oa-components';
import { Box, Card, Flex, Heading, Image, Input, Text } from 'theme-ui';
import { useSupporterContext } from './SupporterContext';
import { formatPrice } from './SupporterPage';

export const SupporterForm = () => {
  const {
    siteImage,
    currencies,
    currency,
    setCurrency,
    interval,
    setInterval,
    availableAmounts,
    selectedAmount,
    setAmount,
    name,
    setName,
    email,
    setEmail,
    isAuthenticated,
    isLoading,
    error,
    onSupport,
  } = useSupporterContext();

  const label = interval === 'month' ? 'month' : 'year';

  return (
    <Flex
      sx={{
        flexDirection: 'column',
        maxWidth: 480,
        mx: 'auto',
        my: [3, 5],
        px: [3, 0],
      }}
    >
      <Flex
        sx={{
          justifyContent: 'center',
          alignItems: 'flex-end',
          mb: '-15px',
          position: 'relative',
          zIndex: 0,
        }}
      >
        <Icon glyph="supporter" size={80} />
        {siteImage && <Image src={siteImage} sx={{ width: 90, height: 90 }} alt="Site logo" />}
      </Flex>

      <Card
        sx={{
          bg: 'white',
          border: '2px solid',
          borderColor: 'black',
          borderRadius: 3,
          padding: 4,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Flex sx={{ flexDirection: 'column', gap: 3 }}>
          <Heading as="h1" sx={{ fontSize: [4, 5] }}>
            Become a supporter
          </Heading>

          <Box>
            <Text variant="quiet" sx={{ fontSize: 0, mb: 1 }}>
              Payment currency
            </Text>
            <Select
              variant="form"
              options={currencies}
              value={currencies.find((c) => c.value === currency)}
              onChange={(option: any) => option && setCurrency(option.value)}
            />
          </Box>

          <Flex sx={{ gap: 0 }}>
            <Box
              as="button"
              onClick={() => setInterval('month')}
              sx={{
                flex: 1,
                py: 2,
                px: 3,
                border: '2px solid',
                borderColor: interval === 'month' ? 'green' : 'offWhite',
                borderRadius: '8px 0 0 8px',
                bg: 'white',
                color: 'black',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: 2,
                textAlign: 'center',
                fontFamily: 'body',
              }}
            >
              Monthly
            </Box>
            <Box
              as="button"
              onClick={() => setInterval('year')}
              sx={{
                flex: 1,
                py: 2,
                px: 3,
                border: '2px solid',
                borderColor: interval === 'year' ? 'green' : 'offWhite',
                borderRadius: '0 8px 8px 0',
                bg: 'white',
                color: 'black',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: 2,
                textAlign: 'center',
                fontFamily: 'body',
              }}
            >
              Yearly
            </Box>
          </Flex>

          <Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 2,
              }}
            >
              {availableAmounts.map((preset) => (
                <Box
                  key={preset}
                  as="button"
                  onClick={() => setAmount(preset)}
                  sx={{
                    py: 2,
                    px: 3,
                    border: '2px solid',
                    borderColor: selectedAmount === preset ? 'green' : 'offWhite',
                    borderRadius: 1,
                    bg: 'white',
                    cursor: 'pointer',
                    fontWeight: selectedAmount === preset ? 'bold' : 'normal',
                    fontSize: 2,
                    textAlign: 'center',
                    fontFamily: 'body',
                    '&:hover': { borderColor: 'green' },
                  }}
                >
                  {formatPrice(preset, currency)}
                </Box>
              ))}
            </Box>

            <Flex
              sx={{
                justifyContent: 'space-between',
                alignItems: 'baseline',
                mt: 3,
                bg: 'background',
                borderRadius: 2,
                px: 3,
                py: 3,
              }}
            >
              <Text sx={{ fontSize: 4, fontWeight: 'bold' }}>
                {formatPrice(selectedAmount, currency)}
              </Text>
              <Text variant="quiet">per {label}</Text>
            </Flex>
          </Box>

          <Flex sx={{ flexDirection: 'column', gap: 2 }}>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              sx={{
                border: '1px solid',
                borderColor: 'offWhite',
                borderRadius: 1,
                px: 3,
                py: 3,
                bg: 'background',
                '&:focus': { outline: 'none', borderColor: 'green' },
              }}
            />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              disabled={isAuthenticated}
              sx={{
                border: '1px solid',
                borderColor: 'offWhite',
                borderRadius: 1,
                px: 3,
                py: 3,
                bg: 'background',
                opacity: isAuthenticated ? 0.7 : 1,
                '&:focus': { outline: 'none', borderColor: 'green' },
              }}
            />
          </Flex>

          {error && <Text sx={{ color: 'red' }}>{error}</Text>}

          <Button
            type="button"
            variant="primary"
            onClick={onSupport}
            disabled={isLoading || !selectedAmount || !name.trim() || !email.trim()}
          >
            {isLoading
              ? 'Processing...'
              : `Support ${formatPrice(selectedAmount, currency)}/${label === 'month' ? 'Month' : 'Year'}`}
          </Button>

          <Text variant="quiet" sx={{ fontSize: 0 }}>
            By continuing, you agree to the{' '}
            <a href="/terms" target="_blank" rel="noopener noreferrer">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>
          </Text>
        </Flex>
      </Card>
    </Flex>
  );
};
