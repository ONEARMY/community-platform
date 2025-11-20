import { impactQuestions } from './content/impactQuestions';

import type { IImpactDataField } from 'oa-shared';
import type { IImpactQuestion } from './content/impactQuestions';

export interface ImpactDataFieldInputs {
  [key: string]: IImpactQuestion;
}

interface IInputs {
  [key: string]: IImpactDataField;
}

export const transformImpactData = (fields: IImpactDataField[]): ImpactDataFieldInputs => {
  const questionMap = new Map(impactQuestions.map((q) => [q.id, q]));
  const transformed = {} as ImpactDataFieldInputs;

  for (const field of fields) {
    const questionField = questionMap.get(field.id);
    if (questionField) {
      transformed[field.id] = {
        ...questionField,
        ...field,
      } as IImpactQuestion;
    }
  }

  return transformed;
};

export const transformImpactInputs = (inputs: IInputs): IImpactDataField[] => {
  const questionMap = new Map(impactQuestions.map((q) => [q.id, q]));
  const fields: IImpactDataField[] = [];

  for (const [key, field] of Object.entries(inputs)) {
    if (field?.value && questionMap.has(key)) {
      fields.push({
        id: key,
        value: field.value,
        isVisible: field.isVisible ?? true,
      });
    }
  }

  return fields;
};

export const sortImpactYearDisplayFields = (
  fields: IImpactDataField[] | undefined,
): IImpactDataField[] => {
  if (!fields) {
    return [];
  }

  const fieldMap = new Map(fields.map((field) => [field.id, field]));
  const sortedFields: IImpactDataField[] = [];

  for (const question of impactQuestions) {
    const field = fieldMap.get(question.id);
    if (field) {
      sortedFields.push(field);
    }
  }

  return sortedFields;
};
