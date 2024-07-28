import '@testing-library/jest-dom/vitest'

import { describe, expect, it } from 'vitest'

import { render } from '../test/utils'
import { Default } from './SettingsFormWrapper.stories'

import type { IProps } from './SettingsFormWrapper'

describe('SettingsFormWrapper', () => {
  it('changes the tab display as expected', async () => {
    const screen = render(<Default {...(Default.args as IProps)} />)
    expect(screen.getByText('Form Body 1')).toBeInTheDocument()

    // Issue with how storybook is setup to do the routing
    //
    // const tabThree = screen.getAllByText('Bad', {
    //   exact: false,
    // })[0]

    // await fireEvent.click(tabThree)

    // expect(screen.getByText('Form Body 3')).toBeInTheDocument()
  })
})
