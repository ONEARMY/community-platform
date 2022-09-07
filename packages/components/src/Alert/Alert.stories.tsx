import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { Alert } from 'theme-ui'

export default {
  title: 'Components/Alert',
  component: Alert,
} as ComponentMeta<typeof Alert>

export const Success: ComponentStory<typeof Alert> = () => (
  <Alert variant="success">A successful message</Alert>
)

export const Failure: ComponentStory<typeof Alert> = () => (
  <Alert variant="failure">An error message</Alert>
)

export const FailureLong: ComponentStory<typeof Alert> = () => (
  <Alert variant="failure">
    An error message: Veniam explicabo dolor ipsam impedit. Eum eos ut et
    consequatur eos eaque explicabo et inventore. Aperiam aut consequatur sit
    ut. Iusto consequatur enim placeat enim quia voluptas pariatur. Culpa
    quaerat placeat magni et autem earum placeat deserunt eum. A autem enim
    dolorum. Quo sint nisi vel. Voluptate voluptates alias repudiandae doloribus
    nemo. Quia aperiam nihil magnam quos ut id. Pariatur itaque sint. Id vel
    aliquid ullam delectus animi quis.{' '}
  </Alert>
)
