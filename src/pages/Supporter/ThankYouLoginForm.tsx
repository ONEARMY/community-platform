import { Button } from 'oa-components';
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
    if (previewMode) return;

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
          padding: 4,
          textAlign: 'left',
        }}
      >
        <Flex sx={{ flexDirection: 'column', gap: 3 }}>
          <Heading as="h2" sx={{ fontSize: [3, 4] }}>
            Login to your account
          </Heading>

          <Text sx={{ fontSize: 1, color: 'grey' }}>
            There is an active One Army account under the email {email}. Log in to access your perks
            in the community platform.
          </Text>

          <Box as="form" onSubmit={handleSubmit}>
            <Flex sx={{ flexDirection: 'column', gap: 3 }}>
              <Box>
                <Text variant="quiet" sx={{ fontSize: 1, mb: 1 }}>
                  Password
                </Text>
                <Flex sx={{ position: 'relative' }}>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    sx={{
                      border: '1px solid',
                      borderColor: 'offWhite',
                      borderRadius: 1,
                      px: 3,
                      py: 3,
                      bg: 'background',
                      pr: '48px',
                      '&:focus': { outline: 'none', borderColor: 'green' },
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: 'grey',
                      padding: 0,
                    }}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </Flex>
              </Box>

              <Text sx={{ fontSize: 1 }}>
                <a href="/reset-password" style={{ color: 'grey' }}>
                  Forgot your password?
                </a>
              </Text>

              {error && <Text sx={{ color: 'red', fontSize: 1 }}>{error}</Text>}

              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting || !password}
                sx={{ justifyContent: 'center' }}
              >
                {isSubmitting ? 'Logging in...' : 'Log in'}
              </Button>

              <Text sx={{ fontSize: 1, color: 'grey' }}>
                If something is not right,{' '}
                <a href="/contact" style={{ color: 'inherit', textDecoration: 'underline' }}>
                  contact us
                </a>
                .
              </Text>
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
