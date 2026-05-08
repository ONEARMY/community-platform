import { Button, ExternalLink, Icon } from 'oa-components';
import { useState } from 'react';
import { Box, Card, Flex, Heading, Image, Input, Text } from 'theme-ui';
import { CurrencyDropdown } from './CurrencyDropdown';
import { useSupporterContext } from './SupporterContext';
import { formatPrice } from './SupporterPage';
import { TIER_CONFIG } from './tierConfig';

export const SupporterForm = () => {
  const {
    siteImage,
    currencies,
    currency,
    setCurrency,
    interval,
    setInterval,
    availablePrices,
    selectedPriceId,
    selectedAmount,
    selectedTier,
    setSelectedPriceId,
    name,
    setName,
    email,
    setEmail,
    isAuthenticated,
    isLoading,
    error,
    onSupport,
  } = useSupporterContext();

  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string }>({});
  const label = interval === 'month' ? 'month' : 'year';

  const validate = () => {
    const errors: { name?: string; email?: string } = {};
    if (!isAuthenticated && !name.trim()) {
      errors.name = 'Enter your name. It can be a nickname.';
    }
    if (!email.trim()) {
      errors.email = 'Enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "That email address doesn't look valid. Please check it and try again.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSupport = () => {
    if (validate()) {
      onSupport();
    }
  };

  return (
    <Flex
      sx={{
        flexDirection: 'column',
        width: 450,
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
        <Icon glyph="supporter" size={80} sx={{ color: '#d61f30' }} />
        {siteImage && <Image src={siteImage} sx={{ width: 90, height: 90 }} alt="Site logo" />}
      </Flex>

      <Card
        variant="primary"
        sx={{
          borderRadius: 3,
          px: 6,
          pt: 5,
          pb: 3,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Flex sx={{ flexDirection: 'column', gap: 4 }}>
          <Heading as="h1" sx={{ fontSize: [4, 5] }}>
            Become a supporter
          </Heading>

          <Flex sx={{ gap: 2 }}>
            {(['month', 'year'] as const).map((i) => (
              <Box
                key={i}
                as="button"
                onClick={() => setInterval(i)}
                sx={{
                  flex: 1,
                  py: 2,
                  border: '2px solid',
                  borderColor: interval === i ? 'green' : 'offWhite',
                  borderRadius: 1,
                  bg: interval === i ? 'background' : 'white',
                  cursor: 'pointer',
                  fontSize: 3,
                }}
              >
                {i === 'month' ? 'Monthly' : 'Yearly'}
              </Box>
            ))}
          </Flex>

          <Flex sx={{ flexDirection: 'column', gap: 2 }}>
            <CurrencyDropdown currencies={currencies} value={currency} onChange={setCurrency} />

            <Flex sx={{ flexWrap: 'wrap', gap: 2 }}>
              {availablePrices.map((price) => {
                const tierColor = TIER_CONFIG[price.tier!]?.color || 'green';
                const isSelected = selectedPriceId === price.id;
                return (
                  <Box
                    key={price.id}
                    as="button"
                    onClick={() => setSelectedPriceId(price.id)}
                    sx={{
                      flex: '1 1 calc(33.333% - 7px)',
                      minWidth: 120,
                      py: 2,
                      border: '2px solid',
                      borderColor: isSelected ? tierColor : 'offWhite',
                      borderRadius: 1,
                      bg: isSelected ? 'background' : 'white',
                      cursor: 'pointer',
                      fontSize: 3,
                      '&:hover': { borderColor: tierColor },
                    }}
                  >
                    {formatPrice(price.unitAmount, currency)}
                  </Box>
                );
              })}
            </Flex>

            {selectedTier != null && TIER_CONFIG[selectedTier] && (
              <Flex sx={{ flexDirection: 'column', gap: 1, py: 2 }}>
                <Flex sx={{ alignItems: 'center', gap: 1 }}>
                  <Icon
                    glyph="supporter"
                    size={25}
                    sx={{
                      color: TIER_CONFIG[selectedTier].color,
                    }}
                  />
                  <Text sx={{ fontSize: [3, 4] }}>
                    You're {/^[aeiou]/i.test(TIER_CONFIG[selectedTier].name) ? 'an' : 'a'}{' '}
                    {TIER_CONFIG[selectedTier].name} supporter
                  </Text>
                </Flex>
                <Text variant="auxiliary">{TIER_CONFIG[selectedTier].description}</Text>
              </Flex>
            )}

            {!isAuthenticated && (
              <Flex sx={{ flexDirection: 'column', gap: 1 }}>
                {fieldErrors.name && (
                  <Text sx={{ fontSize: 1, color: 'error' }}>{fieldErrors.name}</Text>
                )}
                <Box
                  sx={{
                    position: 'relative',
                    '&:focus-within .floating-label, &.has-value .floating-label': {
                      top: '6px',
                      fontSize: '12px',
                      color: 'grey',
                    },
                  }}
                  className={name ? 'has-value' : undefined}
                >
                  <Text
                    className="floating-label"
                    sx={{
                      position: 'absolute',
                      left: '16px',
                      top: '14px',
                      fontSize: 2,
                      color: 'grey',
                      pointerEvents: 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Your name
                  </Text>
                  <Input
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (fieldErrors.name)
                        setFieldErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    variant={fieldErrors.name ? 'textareaError' : 'textarea'}
                    sx={{ px: 3, pt: '24px', pb: '8px' }}
                  />
                </Box>
              </Flex>
            )}
            <Flex sx={{ flexDirection: 'column', gap: 1 }}>
              {fieldErrors.email && (
                <Text sx={{ fontSize: 1, color: 'error' }}>{fieldErrors.email}</Text>
              )}
              <Box
                sx={{
                  position: 'relative',
                  '&:focus-within .floating-label, &.has-value .floating-label': {
                    top: '6px',
                    fontSize: '12px',
                    color: 'grey',
                  },
                }}
                className={email ? 'has-value' : undefined}
              >
                <Text
                  className="floating-label"
                  sx={{
                    position: 'absolute',
                    left: '16px',
                    top: '14px',
                    fontSize: 2,
                    color: 'grey',
                    pointerEvents: 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Email
                </Text>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email)
                      setFieldErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  disabled={isAuthenticated}
                  variant={fieldErrors.email ? 'textareaError' : 'textarea'}
                  sx={{ px: 3, pt: '24px', pb: '8px' }}
                />
              </Box>
            </Flex>
          </Flex>

          {error && <Text sx={{ color: 'red' }}>{error}</Text>}

          <Flex sx={{ flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Button
              type="button"
              variant="primary"
              onClick={handleSupport}
              disabled={isLoading || !selectedPriceId}
              sx={{
                width: '100%',
                borderRadius: 1,
                justifyContent: 'center',
                '& > span': { display: 'inline-flex', alignItems: 'center', gap: 1 },
              }}
            >
              {isLoading
                ? 'Processing...'
                : `Support ${formatPrice(selectedAmount, currency)}/${label === 'month' ? 'month' : 'year'}`}
              {!isLoading && (
                <Icon
                  glyph="arrow-forward"
                  size={20}
                  sx={{ display: 'inline', verticalAlign: 'middle', ml: 1 }}
                />
              )}
            </Button>

            <Text variant="auxiliary">
              By continuing, you agree to the{' '}
              <ExternalLink href="/terms">Terms of Service</ExternalLink> and{' '}
              <ExternalLink href="/privacy">Privacy Policy</ExternalLink>
            </Text>
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
};
