import { Form } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { vi } from 'vitest'

import { FactoryUser } from '../factories/User'

export const SettingsFormProvider = ({ children }) => {
  const user = FactoryUser()

  const formProps = {
    formValues: user,
    onSubmit: vi.fn(),
    mutators: { ...arrayMutators },
    component: () => children,
  }

  return <Form {...formProps} />
}
