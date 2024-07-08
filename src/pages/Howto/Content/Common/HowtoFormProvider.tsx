import { Form } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { FactoryHowto } from 'src/test/factories/Howto'
import { vi } from 'vitest'

export const HowtoFormProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const formProps = {
    formValues: FactoryHowto(),
    onSubmit: vi.fn(),
    mutators: { ...arrayMutators },
    component: () => children,
  }
  return <Form {...formProps} />
}
