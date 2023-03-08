import { faker } from '@faker-js/faker'
import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { FieldEditor } from './FieldEditor'

export default {
  title: 'Components/FieldEditor',
  component: FieldEditor,
} as ComponentMeta<typeof FieldEditor>

export const Default: ComponentStory<typeof FieldEditor> = () => (
  <FieldEditor
    placeholder="Input placeholder"
    meta={{}}
    input={
      {
        value: faker.lorem.paragraph(),
      } as any
    }
  />
)
