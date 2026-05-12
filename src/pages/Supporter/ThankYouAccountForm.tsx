import { Button, Icon } from 'oa-components';
import { FRIENDLY_MESSAGES } from 'oa-shared';
import { type FormEvent, useRef, useState } from 'react';
import { stripeService } from 'src/services/stripeService';
import { Box, Card, Flex, Heading, Input, Text } from 'theme-ui';
import { useSupporterContext } from './SupporterContext';
import { ThankYouLayout } from './ThankYouLayout';

export const ThankYouAccountForm = () => {
  const { email, name, stripeCustomerId, accountCreated, previewMode } = useSupporterContext();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const signInFormRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (previewMode) return;

    setIsSubmitting(true);
    setError(null);

    if (password.length < 6) {
      setError(FRIENDLY_MESSAGES['sign-up/password-short']);
      setIsSubmitting(false);
      return;
    }

    const result = accountCreated
      ? await stripeService.setPassword({
          email,
          stripeCustomerId: stripeCustomerId!,
          password,
        })
      : await stripeService.createSupporterAccount({
          email,
          password,
          name,
          stripeCustomerId: stripeCustomerId!,
        });

    if (!result.ok) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    signInFormRef.current?.submit();
  };

  return (
    <ThankYouLayout>
      <Card
        sx={{
          bg: 'white',
          border: '2px solid',
          borderColor: 'black',
          borderRadius: 3,
          px: '20px',
          py: '20px',
          textAlign: 'left',
        }}
      >
        <Flex sx={{ flexDirection: 'column', gap: '20px' }}>
          <Heading as="h1">Setup your account</Heading>
          <Text sx={{ fontSize: '14px', color: 'grey' }}>
            Set up an account to access exclusive updates and connect with the community.
          </Text>
          <Box as="form" onSubmit={handleSubmit}>
            <Flex sx={{ flexDirection: 'column', gap: 3 }}>
              <Box
                sx={{
                  position: 'relative',
                  '&:focus-within .floating-label, &.has-value .floating-label': {
                    top: '6px',
                    fontSize: '12px',
                    color: 'grey',
                  },
                }}
                className={password ? 'has-value' : undefined}
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
                  Password
                </Text>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  variant="textarea"
                  sx={{ px: 3, pt: '24px', pb: '8px', pr: '48px' }}
                />
                <Icon
                  glyph={showPassword ? 'hide' : 'show'}
                  onClick={() => setShowPassword(!showPassword)}
                  size="25"
                  sx={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                />
              </Box>

              {error && <Text sx={{ color: 'red', fontSize: 1 }}>{error}</Text>}

              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting || password.length < 6}
                sx={{ justifyContent: 'center' }}
              >
                {isSubmitting
                  ? accountCreated
                    ? 'Setting password...'
                    : 'Creating account...'
                  : accountCreated
                    ? 'Set password'
                    : 'Create account'}
              </Button>
            </Flex>
          </Box>
        </Flex>
      </Card>

      <form
        ref={signInFormRef}
        method="post"
        action={`/sign-in?returnUrl=${encodeURIComponent('/settings?subscription=success')}`}
        style={{ display: 'none' }}
      >
        <input type="hidden" name="email" value={email} />
        <input type="hidden" name="password" value={password} />
      </form>
    </ThankYouLayout>
  );
};
