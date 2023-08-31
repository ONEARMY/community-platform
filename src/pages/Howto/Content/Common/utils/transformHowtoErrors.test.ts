import { transformHowtoErrors } from '.'
import { intro, steps } from 'src/pages/Howto/labels'

describe('transformHowtoErrors', () => {
  describe('introErrors', () => {
    it('transforms a shallow list of intro errors into a set', () => {
      const errors = {
        notReal: 'anything',
        title: 'missing',
        category: 'add a category',
      }

      const expected = [
        {
          errors,
          title: 'Intro',
          keys: ['title', 'category'],
          labels: intro,
        },
      ]

      expect(transformHowtoErrors(errors)).toEqual(expected)
    })
  })

  describe('stepErrors', () => {
    it('transforms how final-forms provides steps errors into a set', () => {
      const errors = {
        steps: [
          {},
          {
            title: 'missing',
            text: 'no description',
          },
          {
            title: 'missing',
          },
        ],
      }

      const expectedStepTwo = {
        errors: { ...errors.steps[1] },
        title: 'Step 2',
        keys: ['title', 'text'],
        labels: steps,
      }

      const expectedStepThree = {
        errors: { ...errors.steps[2] },
        title: 'Step 3',
        keys: ['title'],
        labels: steps,
      }

      const set = transformHowtoErrors(errors)
      expect(set).toEqual([expectedStepTwo, expectedStepThree])
    })
  })
})
