import React from 'react'
import { FlexSectionContainer } from 'src/pages/Settings/content/formSections/elements'
import { Box, Flex, Heading, Input, Label, Text } from 'theme-ui';
import workspace from '../../../../assets/images/badges/pt-workspace.jpg'
import machineBuilder from '../../../../assets/images/badges/pt-machine-shop.jpg'
import communitybuilder from '../../../../assets/images/badges/pt_community_point.png'
import member from '../../../../assets/images/badges/pt-member.jpg'
import collectionPoint from '../../../../assets/images/badges/pt-collection-point.jpg'
import { CustomRadioField } from 'src/pages/Settings/content/formSections/Fields/CustomRadio.field';
import { Field } from 'react-final-form';
import { getSupportedProfileTypes } from 'src/modules/profile';
import type { ProfileTypeLabel } from 'src/modules/profile'
import { useTheme } from '@emotion/react';

const types = [
    {
        label:'member',
        img:member
    },
    {
        label:'workspace',
        img:workspace
    },
    {
        label:'machine-builder',
        img:machineBuilder
    },
    {
        label:'community-builder',
        img:communitybuilder
    },
    {
        label:'collection-point',
        img:collectionPoint
    }
]

type Props = {
    value:string
}

function TypesRenderer() {
    const theme = useTheme()
    const profileTypes = getSupportedProfileTypes().filter(({ label }) =>
        Object.keys(theme.badges).includes(label),
    )
    return (
      <Field
        name="profileType"
        render={(props) => (
          <Box>
            <Flex sx={{ flexWrap: ['wrap', 'wrap', 'nowrap'] }}>
              {profileTypes.map((profile, index: number) => (
                <Box key={index} sx={{ width: `20%` }}>
                  <CustomRadioField
                    data-cy={profile.label}
                    value={profile.label}
                    name="profileType"
                    isSelected={profile.label === props.input.value}
                    onChange={(v) =>
                      props.input.onChange(v as ProfileTypeLabel)
                    }
                    imageSrc={
                      theme.badges[profile.label]?.normal || profile.imageSrc
                    }
                    textLabel={profile.textLabel}
                  />
                </Box>
              ))}
            </Flex>
            {props.meta.error && (
              <Text color={theme.colors.red}>Please select a focus</Text>
            )}
          </Box>
        )}
      />
    )
}

function CommunitySelector() {
  return (
    <Box>
        <Text my={4}>User Type*</Text>
        <Field name="profileType" render={TypesRenderer} />
    </Box>
  )
}

export default CommunitySelector