import { useEffect, useState } from 'react'
import { Field } from 'react-final-form'

import { CategoriesSelectV2 } from '../../../../../pages/common/Category/CategoriesSelectV2'
import { FormFieldWrapper } from '../../../../../pages/Howto/Content/Common'
import { fields } from '../../../../../pages/Question/labels'
import { questionService } from '../../../../../pages/Question/question.service'

import type { SelectValue } from '../../../../../pages/common/Category/CategoriesSelectV2'

export const QuestionCategoryField = () => {
  const [categories, setCategories] = useState<SelectValue[]>([])

  const { placeholder, title } = fields.category
  const name = 'questionCategory'

  useEffect(() => {
    const initCategories = async () => {
      const categories = await questionService.getQuestionCategories()
      if (!categories) {
        return
      }

      const selectOptions = categories.map((category) => ({
        value: category,
        label: category.label,
      }))
      setCategories(selectOptions)
    }

    initCategories()
  }, [categories])

  return (
    <FormFieldWrapper htmlFor={name} text={title}>
      <Field
        name={name}
        id={name}
        render={({ input, ...rest }) => (
          <CategoriesSelectV2
            {...rest}
            categories={categories || []}
            isForm={true}
            onChange={input.onChange}
            value={input.value}
            placeholder={placeholder as string}
          />
        )}
      />
    </FormFieldWrapper>
  )
}
