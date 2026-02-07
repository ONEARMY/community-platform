import { FieldInput, Icon } from 'oa-components';
import { Field } from 'react-final-form';
import { Box, Flex, Label, Text } from 'theme-ui';

import type { IImpactQuestion } from '../impactQuestions';

interface Props {
  formId: string;
  field: IImpactQuestion;
}

export const ImpactQuestionField = ({ field, formId }: Props) => {
  return (
    <Box sx={{ marginBottom: 3 }}>
      <Label htmlFor={`${field.id}.value`} sx={{ marginBottom: 1 }}>
        {field.description}
      </Label>
      <Flex
        sx={{
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Flex
          sx={{
            alignItems: 'center',
            alignSelf: 'flex-start',
            flexDirection: 'row',
            gap: 2,
          }}
        >
          {field.prefix && (
            <Box>
              <Text>{field.prefix}</Text>
            </Box>
          )}

          <Box>
            <Field
              component={FieldInput}
              data-cy={`${formId}-field-${field.id}-value`}
              name={`${field.id}.value`}
              sx={{ background: 'white' }}
              type="number"
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                  e.preventDefault();
                }
              }}
              onInput={(e: React.FormEvent<HTMLInputElement>) => {
                const target = e.target as HTMLInputElement;

                target.value = target.value
                  .replaceAll('e', '')
                  .replaceAll('E', '')
                  .replaceAll('+', '')
                  .replaceAll('-', '');
              }}
            />
          </Box>

          {field.suffix && (
            <Box>
              <Text>{field.suffix}</Text>
            </Box>
          )}

          <Box>
            <Text>{field.label}</Text>
          </Box>
        </Flex>

        <Flex sx={{ alignSelf: 'flex-end', flexDirection: 'row' }}>
          <Icon glyph="show" size={24} />
          <Field
            component="input"
            data-cy={`${formId}-field-${field.id}-isVisible`}
            initialValue={true}
            name={`${field.id}.isVisible`}
            type="checkbox"
          />
        </Flex>
      </Flex>
    </Box>
  );
};
