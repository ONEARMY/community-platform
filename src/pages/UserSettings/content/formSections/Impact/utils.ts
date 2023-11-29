import { impactQuestions } from '../Impact/impactQuestions'

import type { IImpactDataField, IImpactYearFieldList } from 'src/models'
import type { IImpactQuestion } from '../Impact/impactQuestions'

export interface ImpactDataFieldInputs {
  [key: string]: IImpactQuestion
}

interface IInputs {
  [key: string]: IImpactDataField
}

export const transformImpactData = (
  fields: IImpactYearFieldList,
): ImpactDataFieldInputs => {
  const transformed = {} as ImpactDataFieldInputs

  Object.values(fields).forEach((field) => {
    const questionField = impactQuestions.find(
      (question) => question.label === field.label,
    )
    return (transformed[field.label] = {
      ...field,
      description: questionField?.description,
    } as IImpactQuestion)
  })

  return transformed
}

export const transformImpactInputs = (
  inputs: IInputs,
): IImpactYearFieldList => {
  const fields = [] as IImpactYearFieldList

  Object.keys(inputs).forEach((key) => {
    const field = inputs[key]
    const question = impactQuestions.find(({ label }) => label === key)
    if (field && question && field.value) {
      fields.push({
        label: key,
        value: field.value,
        isVisible:
          typeof field.isVisible === 'boolean' ? field.isVisible : true,
        ...(question.prefix && { prefix: question.prefix }),
        ...(question.suffix && { suffix: question.suffix }),
      })
    }
  })

  return fields
}
