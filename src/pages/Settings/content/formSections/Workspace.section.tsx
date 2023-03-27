import * as React from 'react'

import { Flex, Heading, Box, Text } from 'theme-ui'
import { FlexSectionContainer } from './elements'
import { CustomRadioField } from './Fields/CustomRadio.field'
import { required } from 'src/utils/validators'
// TODO: Remove direct usage of Theme
import { preciousPlasticTheme } from 'oa-themes'
const theme = preciousPlasticTheme.styles
import { Field } from 'react-final-form'
import type { IWorkspaceType } from 'src/models'

import Extrusion from 'src/assets/images/workspace-focus/extrusion.png'
import Injection from 'src/assets/images/workspace-focus/injection.png'
import Mix from 'src/assets/images/workspace-focus/mix.png'
import Sheetpress from 'src/assets/images/workspace-focus/sheetpress.png'
import Shredder from 'src/assets/images/workspace-focus/shredder.png'

const WORKSPACE_TYPES: IWorkspaceType[] = [
  {
    label: 'shredder',
    textLabel: 'Shredder',
    subText: 'Shredding plastic waste into flakes',
    imageSrc: Shredder,
  },
  {
    label: 'sheetpress',
    textLabel: 'Sheetpress',
    subText: 'Making recycled plastic sheets',
    imageSrc: Sheetpress,
  },
  {
    label: 'extrusion',
    textLabel: 'Extrusion',
    subText: 'Extruding plastic into beams or products',
    imageSrc: Extrusion,
  },
  {
    label: 'injection',
    textLabel: 'Injection',
    subText: 'Making small productions of goods',
    imageSrc: Injection,
  },
  {
    label: 'mix',
    textLabel: 'Mix',
    subText: 'Running a workspace with multiple machines and goals',
    imageSrc: Mix,
  },
]

export class WorkspaceSection extends React.Component<any> {
  render() {
    return (
      <Field
        name="workspaceType"
        validate={required}
        validateFields={[]}
        render={({ input, meta }) => (
          <FlexSectionContainer>
            <Flex sx={{ justifyContent: 'space-between' }}>
              <Heading variant="small">Workspace</Heading>
            </Flex>
            <Box>
              <Text mt={4} mb={4}>
                What kind of Precious Plastic workspace do you run?
              </Text>
              <Flex sx={{ flexWrap: ['wrap', 'wrap', 'nowrap'] }}>
                {WORKSPACE_TYPES.map((workspace, index: number) => (
                  <CustomRadioField
                    data-cy={workspace.label}
                    key={index}
                    value={workspace.label}
                    name="workspaceType"
                    isSelected={workspace.label === input.value}
                    onChange={(v) => {
                      input.onChange(v)
                      input.onBlur()
                    }}
                    imageSrc={workspace.imageSrc}
                    textLabel={workspace.textLabel}
                    subText={workspace.subText}
                  />
                ))}
              </Flex>
              {meta.touched && meta.error && (
                <Text
                  color={theme.colors.error}
                  sx={{
                    fontSize: 0.5,
                    marginLeft: 1,
                    marginRight: 1,
                  }}
                >
                  Please select your workspace type
                </Text>
              )}
            </Box>
          </FlexSectionContainer>
        )}
      />
    )
  }
}
