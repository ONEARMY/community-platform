import { describe, expect, it } from 'vitest';

import { intro, steps } from '../../labels';
import { transformLibraryErrors } from './transformLibraryErrors';

describe('transformLibraryErrors', () => {
  describe('introErrors', () => {
    it('transforms a shallow list of intro errors into a set', () => {
      const errors = {
        notReal: 'anything',
        title: 'missing',
        category: 'add a category',
      };

      const expected = [
        {
          errors,
          title: 'Intro',
          keys: ['title', 'category'],
          labels: intro,
        },
      ];

      expect(transformLibraryErrors(errors)).toEqual(expected);
    });
  });

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
      };

      const expectedStepTwo = {
        errors: { ...errors.steps[1] },
        title: 'Step 2',
        keys: ['title', 'text'],
        labels: steps,
      };

      const expectedStepThree = {
        errors: { ...errors.steps[2] },
        title: 'Step 3',
        keys: ['title'],
        labels: steps,
      };

      const set = transformLibraryErrors(errors);
      expect(set).toEqual([expectedStepTwo, expectedStepThree]);
    });
  });
});
