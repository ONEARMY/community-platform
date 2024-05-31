import '@testing-library/jest-dom'

import { fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { render } from '../tests/utils'
import { ImageCrop } from './ImageCrop'

describe('ImageCrop', () => {
  it('calls the callback on submit', async () => {
    const callbackFn = vi.fn()
    const screen = render(
      <ImageCrop
        aspect={1}
        callbackFn={callbackFn}
        callbackLabel="Upload image"
        imgSrc="https://onearmy.github.io/academy/assets/comm_badges.jpg"
        subTitle="Before uploading, select how we should crop the image to fit."
        title="Select crop"
      />,
    )
    const cropContainer = screen.getByTestId('cropImage')
    await fireEvent.drag(cropContainer, {
      delta: { x: 100, y: 0 },
    })

    const submit = screen.getByText('Upload image', { exact: false })
    fireEvent.click(submit)

    expect(
      screen.getByText('Uploading image', { exact: false }),
    ).toBeInTheDocument()
  })
})
