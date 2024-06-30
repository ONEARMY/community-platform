import { Button, Icon } from '@onearmy.apps/components'
import { observer } from 'mobx-react'
import { Box, Flex, Text } from 'theme-ui'

import { ImpactField } from '../../../../../pages/User/impact/ImpactField'
import { buttons, missingData } from '../../../../../pages/UserSettings/labels'

import type { IImpactYearFieldList } from '../../../../../models'

interface Props {
  fields: IImpactYearFieldList | undefined
  formId: string
  setIsEditMode: (boolean: boolean) => void
}

export const ImpactYearDisplayField = observer((props: Props) => {
  const { fields, formId, setIsEditMode } = props
  const { create, edit } = buttons.impact

  const buttonLabel = fields ? edit : create

  return (
    <Flex sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
      {fields && fields.length > 0 ? (
        fields.map((field, index) => {
          const glyph = field.isVisible ? 'show' : 'hide'
          return (
            <Box key={index} sx={{ width: '100%' }}>
              <Flex
                sx={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <ImpactField field={{ ...field, isVisible: true }} />
                <Icon glyph={glyph} size={24} />
              </Flex>
            </Box>
          )
        })
      ) : (
        <Text>{missingData}</Text>
      )}
      <Button
        data-cy={`${formId}-button-edit`}
        onClick={() => setIsEditMode(true)}
        sx={{ marginTop: 3 }}
      >
        {buttonLabel}
      </Button>
    </Flex>
  )
})
