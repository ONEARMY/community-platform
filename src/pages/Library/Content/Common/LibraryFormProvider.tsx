import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { FactoryLibraryItem } from 'src/test/factories/Library';
import { vi } from 'vitest';

export const LibraryFormProvider = ({ children }: { children: React.ReactNode }) => {
  const formProps = {
    formValues: FactoryLibraryItem(),
    onSubmit: vi.fn(),
    mutators: { ...arrayMutators },
    component: () => children,
  };
  return <Form {...formProps} />;
};
