import * as React from 'react'

import Flex from 'src/components/Flex'
import Heading from 'src/components/Heading'
import Text from 'src/components/Text'
import { Box } from 'theme-ui'
import { FlexSectionContainer, ArrowIsSectionOpen } from './elements'
import { Link } from 'theme-ui'
import { Button } from 'oa-components'
import { ProfileTypeLabel } from 'src/models/user_pp.models'
import { PROFILE_TYPES } from 'src/mocks/user_pp.mock'
import { CustomRadioField } from './Fields/CustomRadio.field'
import theme from 'src/themes/styled.theme'
import { Field } from 'react-final-form'

interface IState {
  isOpen: boolean
}

export class FocusSection extends React.Component<any, IState> {
  state = { isOpen: true }
  render() {
    const { isOpen } = this.state
    return (
      <Field
        name="profileType"
        render={props => (
          <FlexSectionContainer>
            <Flex sx={{ justifyContent: 'space-between' }}>
              <Heading small>Focus</Heading>
              <ArrowIsSectionOpen
                onClick={() => {
                  this.setState({ isOpen: !isOpen })
                }}
                isOpen={isOpen}
              />
            </Flex>
            <Box sx={{ display: isOpen ? 'block' : 'none' }}>
              <Text regular my={4}>
                What is your main Precious Plastic activity?
              </Text>
              <Flex sx={{ flexWrap: ['wrap', 'wrap', 'nowrap'] }}>
                {PROFILE_TYPES.map((profile, index: number) => (
                  <CustomRadioField
                    data-cy={profile.label}
                    key={index}
                    value={profile.label}
                    name="profileType"
                    isSelected={profile.label === props.input.value}
                    onChange={v => props.input.onChange(v as ProfileTypeLabel)}
                    imageSrc={profile.imageSrc}
                    textLabel={profile.textLabel}
                  />
                ))}
              </Flex>
              <Flex sx={{ flexWrap: 'wrap', alignItems: 'center' }} mt={4}>
                <Text my={2}>Not sure about your focus ?</Text>
                <Link
                  href="https://drive.google.com/open?id=1fXTtBbzgCO0EL6G9__aixwqc-Euqgqnd"
                  target="_blank"
                >
                  <Button ml={[1, 2, 2]} variant="outline" data-cy="go-to">
                    Check out our guidelines
                  </Button>
                </Link>
              </Flex>
              {props.meta.error && (
                <Text color={theme.colors.red}>Please select a focus</Text>
              )}
            </Box>
          </FlexSectionContainer>
        )}
      />
    )
  }
}
