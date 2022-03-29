import React from 'react'
import Flex from 'src/components/Flex'
import Heading from 'src/components/Heading'
import styled from '@emotion/styled'
import theme from 'src/themes/styled.theme'
import { Button } from 'oa-components'
import { Form, Field } from 'react-final-form'
import { InputField } from 'src/components/Form/Fields'
import { logger } from 'src/logger'

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
        onSubmit={e => this.onSignupSubmit(e)}
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
                <Flex
                  card
                  mediumRadius
                  bg={'softblue'}
                  px={3}
                  py={2}
                  sx={{ width: '100%' }}
                >
                  <Heading medium sx={{ width: '100%' }}>
                    Something didn't work
                  </Heading>
                </Flex>
                <Flex
                  card
                  mediumRadius
                  bg={'white'}
                  mt={3}
                  px={4}
                  pt={0}
                  pb={4}
                  sx={{
                    flexWrap: 'wrap',
                    flexDirection: 'column',
                    width: '100%',
                  }}
                >
                  <Heading small py={4} sx={{ width: '100%' }}>
                    Resend email
                  </Heading>
                  <Flex sx={{ flexDirection: 'column' }} mb={3}>
                    <Flex
                      mb={3}
                      sx={{ flexDirection: 'column', width: ['100%', '100%', `${2 / 3 * 100}%`] }}
                    >
                      <Label htmlFor="email">Email</Label>
                      <Field
                        name="email"
                        type="email"
                        id="email"
                        component={InputField}
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
                <Flex mt={3} sx={{ justifyContent: 'flex-end' }}>
                  <Button variant="tertiary">Home</Button>
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
