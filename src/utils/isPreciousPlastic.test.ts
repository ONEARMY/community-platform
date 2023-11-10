import { isPreciousPlastic } from './isPreciousPlastic'

describe('isPreciousPlastic', () => {
  it('is true when PP is the platform theme ', () => {
    localStorage.setItem('platformTheme', 'precious-plastic')
    const isPP = isPreciousPlastic()
    expect(isPP).toBe(true)
  })

  it('is false when anything else is the platform theme ', () => {
    localStorage.setItem('platformTheme', 'anything')
    const isPP = isPreciousPlastic()
    expect(isPP).toBe(false)
  })
})
