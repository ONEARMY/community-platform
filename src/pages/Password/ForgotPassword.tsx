import React from 'react'
import { Card, Flex, Heading } from 'theme-ui'
import styled from '@emotion/styled'
// TODO: Remove direct usage of Theme
import { preciousPlasticTheme } from 'oa-themes'
const theme = preciousPlasticTheme.styles
import { Button, FieldInput } from 'oa-components'
import { Form, Field } from 'react-final-form'
import { logger } from 'workbox-core/_private'

const Label = styled.label`
 font-size: ${theme.fontSizes[2] + 'px'}
 margin-bottom: ${theme.space[2] + 'px'}
 display: block;
`

interface IFormValues {
  email: string
}
interface IState {
  formValues: IFormValues
  errorMsg?: string
  disabled?: boolean
}
interface IProps {
  onChange?: (e: React.FormEvent<any>) => void
  preloadValues?: any
}

class ForgotPasswordPage extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      formValues: {
        email: '',
      },
    }
  }

  onSignupSubmit(e) {
    logger.debug(e)
  }

  public render() {
    const { email } = this.state.formValues
    const disabled = this.state.disabled || email === ''
    return (
      <Form
        onSubmit={(e) => this.onSignupSubmit(e)}
        render={() => (
          <form>
            <Flex
              bg="inherit"
              px={2}
              sx={{ width: '100%' }}
              css={{ maxWidth: '620px' }}
              mx={'auto'}
              mt={20}
              mb={3}
            >
              <Flex sx={{ flexDirection: 'column', width: '100%' }}>
                <Card bg={'softblue'} px={3} py={2} sx={{ width: '100%' }}>
                  <Heading>We've all been there</Heading>
                </Card>
                <Card mt={3}>
                  <Flex
                    px={4}
                    pt={0}
                    pb={4}
                    sx={{
                      width: '100%',
                      flexWrap: 'wrap',
                      flexDirection: 'column',
                    }}
                  >
                    <Heading variant="small" py={4} sx={{ width: '100%' }}>
                      Reset your password
                    </Heading>
                    <Flex sx={{ flexDirection: 'column' }} mb={3}>
                      <Flex sx={{ flexDirection: 'column' }} mb={3}>
                        <Flex
                          mb={3}
                          sx={{
                            flexDirection: 'column',
                            width: ['100%', '100%', `${(2 / 3) * 100}%`],
                          }}
                        >
                          <Label htmlFor="email">Email</Label>
                          <Field
                            name="email"
                            type="email"
                            id="email"
                            component={FieldInput}
                            autoComplete="email"
                          />
                        </Flex>
                        <Button
                          sx={{ width: '100%' }}
                          variant={'primary'}
                          disabled={disabled}
                          type="submit"
                        >
                          Resend email
                        </Button>
                      </Flex>
                    </Flex>
                  </Flex>
                </Card>
                <Flex mt={3} sx={{ justifyContent: 'flex-end' }}>
                  <Button variant={'outline'}>Close</Button>
                </Flex>
              </Flex>
            </Flex>
          </form>
        )}
      />
    )
  }
}
export default ForgotPasswordPage
