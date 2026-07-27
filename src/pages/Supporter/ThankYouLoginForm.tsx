import { Button, Icon } from 'oa-components';
import { type FormEvent, useRef, useState } from 'react';
import { stripeService } from 'src/services/stripeService';
import { Box, Card, Flex, Heading, Input, Text } from 'theme-ui';
import { useSupporterContext } from './SupporterContext';
import { ThankYouLayout } from './ThankYouLayout';

export const ThankYouLoginForm = () => {
  const { email, stripeCustomerId, previewMode } = useSupporterContext();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const signInFormRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (previewMode) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const result = await stripeService.linkExistingAccount({
      email,
      password,
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
          <Heading as="h2" sx={{ fontSize: '30px' }}>
            Login to your account
          </Heading>

          <Text sx={{ fontSize: '14px', color: 'grey' }}>
            There is an active One Army account under the email <strong>{email}</strong>. Log in to
            access your perks in the community platform.
          </Text>

          <Box as="form" onSubmit={handleSubmit}>
            <Flex sx={{ flexDirection: 'column', gap: '20px' }}>
              <Flex sx={{ flexDirection: 'column', gap: '10px' }}>
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

                <Text sx={{ fontSize: 1 }}>
                  <a href="/reset-password" style={{ color: 'blue' }}>
                    Forgot your password?
                  </a>
                </Text>
              </Flex>

              {error && <Text sx={{ color: 'red', fontSize: 1 }}>{error}</Text>}

              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting || !password}
                sx={{ justifyContent: 'center' }}
              >
                {isSubmitting ? 'Logging in...' : 'Log in'}
              </Button>

              <Text sx={{ fontSize: '14px', color: 'grey' }}>
                If something is not right, <a href="/contact">contact us</a>.
              </Text>
            </Flex>
          </Box>
        </Flex>
      </Card>

      <form
        ref={signInFormRef}
        method="post"
        action={`/sign-in?returnUrl=${encodeURIComponent('/settings/account')}`}
        style={{ display: 'none' }}
      >
        <input type="hidden" name="email" value={email} />
        <input type="hidden" name="password" value={password} />
      </form>
    </ThankYouLayout>
  );
};
