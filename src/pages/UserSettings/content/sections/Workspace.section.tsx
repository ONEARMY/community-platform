import { Field } from 'react-final-form'
import Extrusion from 'src/assets/images/workspace-focus/extrusion.png'
import Injection from 'src/assets/images/workspace-focus/injection.png'
import Mix from 'src/assets/images/workspace-focus/mix.png'
import Sheetpress from 'src/assets/images/workspace-focus/sheetpress.png'
import Shredder from 'src/assets/images/workspace-focus/shredder.png'
import { fields } from 'src/pages/UserSettings/labels'
import { required } from 'src/utils/validators'
import { Flex, Grid, Heading, Text } from 'theme-ui'

import { FlexSectionContainer } from '../elements'
import { CustomRadioField } from '../fields/CustomRadio.field'

import type { IWorkspaceType } from 'oa-shared'

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

export const WorkspaceSection = () => {
  const { description, error, title } = fields.workspaceType

  return (
    <Field
      name="workspaceType"
      validate={required}
      validateFields={[]}
      render={({ input, meta }) => (
        <FlexSectionContainer>
          <Flex
            data-testid="workspaceType"
            sx={{
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Heading as="h2">{title}</Heading>
            <Text variant="quiet">{description}</Text>
            {meta.touched && meta.error && (
              <Text sx={{ color: 'error', fontSize: 1 }}>{error}</Text>
            )}
            <Grid columns={['repeat(auto-fill, minmax(125px, 1fr))']} gap={2}>
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
            </Grid>
          </Flex>
        </FlexSectionContainer>
      )}
    />
  )
}
