import { useState } from 'react';
import { Box, Flex, Input, Link, Text } from 'theme-ui';
import { CurrencyDropdown } from './CurrencyDropdown';
import { SupporterCard } from './SupporterCard';
import { useSupporterContext } from './SupporterContext';
import { SupporterCTA } from './SupporterCTA';
import { formatPrice } from './SupporterPage';
import { TierBanner } from './TierBanner';

const inputSx = {
  height: '50px',
  px: '15px',
  bg: 'background',
  border: 'none',
  borderRadius: '5px',
  fontSize: '16px',
  '&:focus': { outline: 'none' },
};

export const SupporterForm = () => {
  const {
    siteImage,
    siteName,
    tierConfig,
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

  const currentTierConfig = selectedTier != null ? tierConfig[selectedTier] : null;
  const tierColor = currentTierConfig?.color || '#BFDEBA';
  const disabled = isLoading || !selectedPriceId;

  const toggleButtonSx = (active: boolean) => ({
    width: '127px',
    minWidth: '120px',
    height: '36px',
    py: '8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: active ? '1px solid rgba(0, 0, 0, 0.2)' : 'none',
    borderRadius: '44px',
    bg: active ? 'white' : 'transparent',
    cursor: 'pointer',
    fontSize: '17px',
    lineHeight: '20px',
    fontFamily: 'body',
    color: 'black',
    opacity: active ? 1 : 0.6,
  });

  return (
    <Flex
      sx={{
        flexDirection: 'column',
        maxWidth: '580px',
        width: '100%',
        mx: 'auto',
        my: [3, 5],
        px: [3, 0],
      }}
    >
      <SupporterCard
        siteImage={siteImage}
        heading={siteName ? `${siteName} Membership` : 'Become a supporter'}
      >
        <Flex
          sx={{
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            alignSelf: 'stretch',
          }}
        >
          <Flex
            sx={{
              bg: '#E4E9EC',
              border: '1px solid rgba(0, 0, 0, 0.11)',
              borderRadius: '65px',
              p: '4px',
              height: '44px',
              display: 'inline-flex',
            }}
          >
            <Box
              as="button"
              onClick={() => setInterval('month')}
              sx={toggleButtonSx(interval === 'month')}
            >
              Monthly
            </Box>
            <Box
              as="button"
              onClick={() => setInterval('year')}
              sx={toggleButtonSx(interval === 'year')}
            >
              Yearly
            </Box>
          </Flex>

          <Flex
            sx={{
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '10px',
              alignSelf: 'stretch',
            }}
          >
            <CurrencyDropdown currencies={currencies} value={currency} onChange={setCurrency} />

            <Flex
              sx={{
                flexWrap: 'wrap',
                alignItems: 'center',
                alignContent: 'flex-start',
                gap: '10px',
                alignSelf: 'stretch',
              }}
            >
              {availablePrices.map((price) => {
                const priceTierColor = tierConfig[price.tier!]?.color || '#BFDEBA';
                const isSelected = selectedPriceId === price.id;
                return (
                  <Box
                    key={price.id}
                    as="button"
                    onClick={() => setSelectedPriceId(price.id)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flex: '1 0 0',
                      minWidth: '120px',
                      height: '50px',
                      minHeight: '40px',
                      p: '10px',
                      border: '2px solid',
                      borderColor: isSelected ? 'black' : 'offWhite',
                      borderRadius: '5px',
                      bg: isSelected
                        ? `color-mix(in srgb, ${priceTierColor} 50%, transparent)`
                        : 'white',
                      cursor: 'pointer',
                      fontSize: '19px',
                      lineHeight: '23px',
                      fontWeight: 500,
                      fontFamily: 'body',
                      color: 'black',
                      '&:hover': { borderColor: 'black' },
                    }}
                  >
                    {formatPrice(price.unitAmount, currency)}
                  </Box>
                );
              })}
            </Flex>
          </Flex>

          {selectedTier != null && currentTierConfig && (
            <TierBanner tier={selectedTier} tierConfig={currentTierConfig} tierColor={tierColor} />
          )}
        </Flex>

        <Flex sx={{ flexDirection: 'column', gap: '10px', alignSelf: 'stretch' }}>
          {!isAuthenticated && (
            <Flex sx={{ flexDirection: 'column', gap: '5px' }}>
              {fieldErrors.name && (
                <Text sx={{ fontSize: '14px', color: 'error' }}>{fieldErrors.name}</Text>
              )}
              <Input
                placeholder="Your name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: undefined }));
                }}
                sx={{
                  ...inputSx,
                  ...(fieldErrors.name && { boxShadow: 'inset 0 0 0 1px red' }),
                }}
              />
            </Flex>
          )}
          <Flex sx={{ flexDirection: 'column', gap: '5px' }}>
            {fieldErrors.email && (
              <Text sx={{ fontSize: '14px', color: 'error' }}>{fieldErrors.email}</Text>
            )}
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
              }}
              disabled={isAuthenticated}
              sx={{
                ...inputSx,
                ...(fieldErrors.email && { boxShadow: 'inset 0 0 0 1px red' }),
              }}
            />
          </Flex>
        </Flex>

        {error && <Text sx={{ color: 'red' }}>{error}</Text>}

        <Flex
          sx={{
            flexDirection: 'column',
            alignItems: 'center',
            gap: '15px',
            alignSelf: 'stretch',
          }}
        >
          <SupporterCTA onClick={handleSupport} disabled={disabled} color={tierColor}>
            {isLoading
              ? 'Processing...'
              : `Support for ${formatPrice(selectedAmount, currency)}/${label}  →`}
          </SupporterCTA>

          <Text sx={{ fontSize: '12px', lineHeight: 1.4, color: 'darkGrey', textAlign: 'center' }}>
            By continuing, you agree to the{' '}
            <Link
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: 'inherit', textDecoration: 'underline' }}
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: 'inherit', textDecoration: 'underline' }}
            >
              Privacy Policy
            </Link>
          </Text>
        </Flex>
      </SupporterCard>
    </Flex>
  );
};
