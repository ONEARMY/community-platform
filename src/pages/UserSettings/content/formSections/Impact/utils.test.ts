import {
  sortImpactYearDisplayFields,
  transformImpactData,
  transformImpactInputs,
} from './utils'

describe('transformImpactData', () => {
  it('returns data structured as field inputs', () => {
    const description =
      'What was your revenue (in $)? By revenue we mean all money coming in.'

    const impactFields = [
      {
        id: 'revenue',
        value: 75000,
        isVisible: false,
      },
    ]
    const expected = {
      revenue: {
        id: 'revenue',
        icon: 'revenue',
        description,
        label: 'revenue',
        prefix: '$',
        value: 75000,
        isVisible: false,
      },
    }
    expect(transformImpactData(impactFields)).toEqual(expected)
  })
})

describe('transformImpactInputs', () => {
  it('returns data structured as impact data', () => {
    const description = 'How many machines did you build?'

    const inputFields = {
      machines: {
        id: 'machines',
        description,
        label: 'machines built',
        value: 20,
        isVisible: true,
      },
    }

    const expected = [
      {
        id: 'machines',
        value: 20,
        isVisible: true,
      },
    ]
    expect(transformImpactInputs(inputFields)).toEqual(expected)
  })
})

describe('sortImpactYearDisplayFields', () => {
  it('sorts impact data in the same order as impact questions', () => {
    const fields = [
      {
        id: 'machines',
        value: 15,
        isVisible: true,
      },
      {
        id: 'revenue',
        value: 2000,
        isVisible: true,
      },
      { id: 'plastic', value: 30000, isVisible: true },
    ]

    const expected = [
      { id: 'plastic', value: 30000, isVisible: true },
      { id: 'revenue', value: 2000, isVisible: true },
      { id: 'machines', value: 15, isVisible: true },
    ]
    expect(sortImpactYearDisplayFields(fields)).toEqual(expected)
  })
})
