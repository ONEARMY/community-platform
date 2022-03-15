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
              width={1}
              css={{ maxWidth: '620px' }}
              mx={'auto'}
              mt={20}
              mb={3}
            >
              <Flex flexDirection={'column'} width={1}>
                <Flex card mediumRadius bg={'softblue'} px={3} py={2} width={1}>
                  <Heading medium width={1}>
                    Something didn't work
                  </Heading>
                </Flex>
                <Flex
                  card
                  mediumRadius
                  bg={'white'}
                  width={1}
                  mt={3}
                  px={4}
                  pt={0}
                  pb={4}
                  flexWrap="wrap"
                  flexDirection="column"
                >
                  <Heading small py={4} width={1}>
                    Resend email
                  </Heading>
                  <Flex flexDirection={'column'} mb={3}>
                    <Flex flexDirection={'column'} mb={3} width={[1, 1, 2 / 3]}>
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
                      width={1}
                      variant={'primary'}
                      disabled={disabled}
                      type="submit"
                    >
                      Resend
                    </Button>
                  </Flex>
                </Flex>
                <Flex mt={3} justifyContent={'flex-end'}>
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
