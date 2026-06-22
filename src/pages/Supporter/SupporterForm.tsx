import { useState } from 'react';
import { Box, Flex, Input, Link, Text } from 'theme-ui';
import { CurrencyDropdown } from './CurrencyDropdown';
import { SupporterCard } from './SupporterCard';
import { useSupporterContext } from './SupporterContext';
import { SupporterCTA } from './SupporterCTA';
import { formatPrice } from './SupporterPage';
import { TierBanner } from './TierBanner';

const ArrowRightIcon = () => (
  <svg width={10} height={12} viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M4.06881 1.66897C5.03025 2.75347 6.00707 3.82259 6.96851 4.9071C4.96872 5.08656 2.96636 5.16861 0.961439 5.15322C0.706449 5.15322 0.461904 5.25452 0.281599 5.43482C0.101294 5.61513 0 5.85967 0 6.11466C0 6.36965 0.101294 6.6142 0.281599 6.7945C0.461904 6.97481 0.706449 7.0761 0.961439 7.0761C2.91508 7.0761 4.86616 6.99919 6.81468 6.84536C5.96861 7.83756 5.0764 8.81438 4.13034 9.72967C3.18428 10.645 4.59952 11.9525 5.48405 11.0911C6.99548 9.63245 8.40868 8.07536 9.71438 6.43001C9.80755 6.30985 9.87319 6.17069 9.90666 6.02236C9.96661 5.86125 9.98037 5.68661 9.94639 5.5181C9.91242 5.34959 9.83206 5.19392 9.71438 5.06862C8.29145 3.47648 6.84544 1.89972 5.43021 0.307573C4.59952 -0.615408 3.24582 0.74599 4.06881 1.66897Z"
      fill="currentColor"
    />
  </svg>
);

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
    flex: 1,
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
              width: ['65%', 'auto'],
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

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
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
            </Box>
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
            {isLoading ? (
              'Processing...'
            ) : (
              <>
                {`Support for ${formatPrice(selectedAmount, currency)}/${label} `}
                <ArrowRightIcon />
              </>
            )}
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
