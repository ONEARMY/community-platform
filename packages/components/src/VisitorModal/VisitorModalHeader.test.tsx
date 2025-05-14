import '@testing-library/jest-dom/vitest'

import { act } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { render } from '../test/utils'
import { VisitorModalHeader } from './VisitorModalHeader'
import type { DisplayData } from './props'
import { Flex } from 'theme-ui'

describe('VisitorHeaderFooter', () => {
  const data: DisplayData = {
    icon: <Flex>icon</Flex>,
    label: 'visitor policy label',
    default: 'policy default text'
  }

  it('shows the data icon and label', () => {

    const { getByText } = render(<VisitorModalHeader data={data} hide={() => {}} />)

    expect(getByText('icon')).toBeInTheDocument()
    expect(getByText('visitor policy label')).toBeInTheDocument()
  })

  it('passes the "contact" target to the hide function on click', () => {
    const hideTrigger = vi.fn()
    const { getByTestId } = render(<VisitorModalHeader data={data} hide={hideTrigger} />)

    act(() => {
      getByTestId('VisitorModal-CloseButton').click()
    })

    expect(hideTrigger).toHaveBeenCalled()
  })
})
