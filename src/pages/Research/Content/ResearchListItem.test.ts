import { calculateTotalComments } from 'src/pages/Research/Content/ResearchListItem'
import type { IResearch } from 'src/models'

describe('calculateTotalComments', () => {
  it("outputs '-' given zero research items", () => {
    expect(calculateTotalComments({} as IResearch.ItemDB)).toBe('-')
  })
})
