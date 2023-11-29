import { transformImpactData, transformImpactInputs } from './utils'

describe('transformImpactData', () => {
  it('returns data structured as field inputs', () => {
    const description =
      'What was your revenue (in $)? By revenue we mean all money coming in.'

    const impactFields = [
      {
        description,
        label: 'revenue',
        prefix: '$',
        value: 75000,
        isVisible: true,
      },
    ]
    const expected = {
      revenue: {
        description,
        label: 'revenue',
        prefix: '$',
        value: 75000,
        isVisible: true,
      },
    }
    expect(transformImpactData(impactFields)).toEqual(expected)
  })
})

describe('transformImpactData', () => {
  it('returns data structured as impact data', () => {
    const description =
      'What was your revenue (in $)? By revenue we mean all money coming in.'

    const inputFields = {
      revenue: {
        description,
        label: 'revenue',
        prefix: '$',
        value: 75000,
        isVisible: true,
      },
    }

    const expected = [
      {
        label: 'revenue',
        prefix: '$',
        value: 75000,
        isVisible: true,
      },
    ]
    expect(transformImpactInputs(inputFields)).toEqual(expected)
  })
})
