import { describe, expect, it } from 'vitest'

import { getSummaryFromMarkdown } from './getSummaryFromMarkdown'

describe('getSummaryFromMarkdown', () => {
  it('removes markdown elements', () => {
    const simpleHeading = `**A** B

* C

> D

E
`
    expect(getSummaryFromMarkdown(simpleHeading)).toEqual('A B D')
  })
})
