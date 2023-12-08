import { Box, Flex, Text } from 'theme-ui'
import { Button, Icon } from 'oa-components'
import { observer } from 'mobx-react'

import { buttons, missingData } from 'src/pages/UserSettings/labels'
import { ImpactField } from 'src/pages/User/impact/ImpactField'

import type { IImpactYearFieldList } from 'src/models'

interface Props {
  fields: IImpactYearFieldList | undefined
  id: string
  setIsEditMode: (boolean) => void
}

export const ImpactYearDisplayField = observer((props: Props) => {
  const { fields, id, setIsEditMode } = props
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
                <ImpactField field={field} />
                <Icon glyph={glyph} size={24} />
              </Flex>
            </Box>
          )
        })
      ) : (
        <Text>{missingData}</Text>
      )}
      <Button
        data-cy={`${id}-button-edit`}
        onClick={() => setIsEditMode(true)}
        sx={{ marginTop: 3 }}
      >
        {buttonLabel}
      </Button>
    </Flex>
  )
})
