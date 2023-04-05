import React from 'react'
import { Card, Flex, Heading, Label } from 'theme-ui'
import { Button, FieldInput } from 'oa-components'
import { Form, Field } from 'react-final-form'
import { logger } from 'src/logger'

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

class ResendSignUpMessagePage extends React.Component<IProps, IState> {
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
              sx={{ width: '100%', maxWidth: '620px' }}
              mx={'auto'}
              mt={20}
              mb={3}
            >
              <Flex sx={{ flexDirection: 'column', width: '100%' }}>
                <Card bg={'softblue'}>
                  <Flex px={3} py={2} sx={{ width: '100%' }}>
                    <Heading>Something didn't work</Heading>
                  </Flex>
                </Card>
                <Card mt={3}>
                  <Flex
                    px={4}
                    pt={0}
                    pb={4}
                    sx={{
                      flexWrap: 'wrap',
                      flexDirection: 'column',
                      width: '100%',
                    }}
                  >
                    <Heading variant="small" py={4} sx={{ width: '100%' }}>
                      Resend email
                    </Heading>
                    <Flex sx={{ flexDirection: 'column' }} mb={3}>
                      <Flex
                        mb={3}
                        sx={{
                          flexDirection: 'column',
                          width: ['100%', '100%', `${(2 / 3) * 100}%`],
                        }}
                      >
                        <Label
                          htmlFor="email"
                          sx={{
                            fontSize: 2,
                            mb: 2,
                          }}
                        >
                          Email
                        </Label>
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
                        Resend
                      </Button>
                    </Flex>
                  </Flex>
                </Card>

                <Flex mt={3} sx={{ justifyContent: 'flex-end' }}>
                  <Button variant={'outline'}>Home</Button>
                </Flex>
              </Flex>
            </Flex>
          </form>
        )}
      />
    )
  }
}
export default ResendSignUpMessagePage
