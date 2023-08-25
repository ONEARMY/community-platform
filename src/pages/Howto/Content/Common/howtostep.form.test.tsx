import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form } from 'react-final-form'
import { faker } from '@faker-js/faker'

import { FactoryHowto } from 'src/test/factories/Howto'
import { HowtoStep } from './HowtoStep.form'
import type { IUploadedFileMeta } from 'src/stores/storage'

const simpleHowtoProps = {
  step: {},
  index: 0,
  images: [] as IUploadedFileMeta[],
  onDelete: jest.fn(() => null),
  moveStep: jest.fn(() => null),
}

const howtoWrapper = (howtoProps = simpleHowtoProps) => {
  const component = () => <HowtoStep {...howtoProps} />
  const formProps = {
    formValues: FactoryHowto(),
    onSubmit: jest.fn(),
    component,
  }
  return <Form {...formProps} />
}

describe('HowtoStep', () => {
  describe('Step title', () => {
    it("shows step number and if it's a required minimum step", async () => {
      render(howtoWrapper())

      await screen.findByText('Step 1 *')
    })

    it("shows step number and if it's a not required minimum step", async () => {
      const howtoProps = {
        ...simpleHowtoProps,
        index: 3,
      }

      render(howtoWrapper(howtoProps))

      await screen.findByText('Step 4')
    })
  })

  describe('delete button', () => {
    it("isn't visible when a required step", async () => {
      render(howtoWrapper())

      const deleteButton = await screen.queryByTestId('delete-step')

      expect(deleteButton).toBeNull()
    })

    it('warns users when they try to delete a step', async () => {
      const user = userEvent.setup()

      const howtoProps = {
        ...simpleHowtoProps,
        index: 3,
      }

      render(howtoWrapper(howtoProps))

      await user.click(screen.getByTestId('delete-step'))
      await screen.findByText('Are you sure you want to delete this step?')
      expect(howtoProps.onDelete).toBeCalledTimes(0)
    })

    it('deletes after user confirms deletion', async () => {
      const user = userEvent.setup()

      const howtoProps = {
        ...simpleHowtoProps,
        index: 3,
      }

      render(howtoWrapper(howtoProps))

      await user.click(screen.getByTestId('delete-step'))
      await user.click(screen.getByTestId('confirm'))
      expect(howtoProps.onDelete).toHaveBeenCalled()
    })
  })

  describe('Move steps', () => {
    it("won't have move up visible when the top step", async () => {
      render(howtoWrapper())

      const deleteButton = await screen.queryByTestId('move-step-up')

      expect(deleteButton).toBeNull()
    })

    it('will request to move the step up', async () => {
      const user = userEvent.setup()

      const index = 1
      const howtoProps = {
        ...simpleHowtoProps,
        index,
      }

      render(howtoWrapper(howtoProps))
      await user.click(screen.getByTestId('move-step-up'))

      expect(howtoProps.moveStep).toHaveBeenCalledWith(index, index - 1)
    })

    it('will request to move the step down', async () => {
      const user = userEvent.setup()

      const index = 1
      const howtoProps = {
        ...simpleHowtoProps,
        index,
      }

      render(howtoWrapper(howtoProps))
      await user.click(screen.getByTestId('move-step-down'))

      expect(howtoProps.moveStep).toHaveBeenCalledWith(index, index + 1)
    })
  })

  describe('Title', () => {
    it('displays the title character count', async () => {
      const user = userEvent.setup()

      const shortTitle = faker.lorem.sentence(15).slice(0, 10)

      render(howtoWrapper())
      const titleField = await screen.getByTestId('step-title')
      await user.click(titleField)
      await user.paste(shortTitle)

      await screen.findByText('10 / 50')
    })

    it("won't populate the field beyond the character limit", async () => {
      const user = userEvent.setup()
      const tooLongTitle = faker.lorem.sentence(15).slice(0, 55)

      render(howtoWrapper())
      const titleField = await screen.getByTestId('step-title')
      await user.click(titleField)
      await user.paste(tooLongTitle)

      await screen.findByText('50 / 50')
    })
  })

  describe('Description', () => {
    it('displays the title character count', async () => {
      const user = userEvent.setup()

      const shortDescription = faker.lorem.sentences(20).slice(0, 100)

      render(howtoWrapper())
      const descriptionField = await screen.getByTestId('step-description')
      await user.click(descriptionField)
      await user.paste(shortDescription)

      await screen.findByText('100 / 1000')
    })

    it("won't populate the field beyond the character limit", async () => {
      const user = userEvent.setup()
      const tooLongDescription = faker.lorem.sentences(30)

      render(howtoWrapper())
      const descriptionField = await screen.getByTestId('step-description')
      await user.click(descriptionField)
      await user.paste(tooLongDescription)

      await screen.findByText('1000 / 1000')
    })
  })

  describe('File upload', () => {
    const validImageFile = new File(['hello'], 'hello.png', {
      type: 'image/png',
    })

    it('uploads a valid image file', async () => {
      const user = userEvent.setup()

      render(howtoWrapper())
      const uploadImageButton = await screen.getByTestId('step-image-0')
      await user.upload(uploadImageButton, validImageFile)

      await screen.getByTestId('delete-image')
    })

    it('removes an uploaded image', async () => {
      const user = userEvent.setup()

      render(howtoWrapper())
      const uploadImageButton = await screen.getByTestId('step-image-0')
      await user.upload(uploadImageButton, validImageFile)
      const deleteButton = await screen.getByTestId('delete-image')
      await user.click(deleteButton)
      const uploadButtons = await screen.getAllByText('Upload Image')

      expect(uploadButtons.length).toEqual(3)
    })

    it("won't upload something that isn't an image file", async () => {
      const user = userEvent.setup()
      const invalidFile = new File(['hello'], 'hello.txt', {
        type: 'text/plain',
      })

      render(howtoWrapper())
      const uploadImageButton = await screen.getByTestId('step-image-0')
      await user.upload(uploadImageButton, invalidFile)
      const deleteButton = await screen.queryByTestId('delete-image')
      const uploadButtons = await screen.getAllByText('Upload Image')

      expect(uploadButtons.length).toEqual(3)
      expect(deleteButton).toBeNull()
    })
  })

  describe('YouTube link', () => {
    it("doesn't show an error when a valid youtube url is provided", async () => {
      const user = userEvent.setup()

      render(howtoWrapper())
      const urlField = await screen.getByTestId('step-videoUrl')
      await user.click(urlField)
      await user.paste('https://www.youtube.com/watch?v=iq1cpMN4m2E')
      const emptyFieldError = await screen.queryByDisplayValue(
        'Include either images or a video',
      )
      const wrongUrlError = await screen.queryByDisplayValue(
        'Please provide a valid YouTube Url',
      )

      expect(emptyFieldError).toBeNull()
      expect(wrongUrlError).toBeNull()
    })

    it('shows an error when an invalid url is provided', async () => {
      const user = userEvent.setup()

      render(howtoWrapper())
      const urlField = await screen.getByTestId('step-videoUrl')
      await user.click(urlField)
      await user.paste('https://www.bbc.co.uk/')
      await user.click(document.body)

      await screen.findByText('Please provide a valid YouTube Url')
    })

    it('shows an error when an url is provided if images are already present', async () => {
      const user = userEvent.setup()

      const howtoProps = {
        ...simpleHowtoProps,
        images: [
          {
            downloadUrl: 'string',
            contentType: 'image/jpeg',
            fullPath: '//',
            name: 'howto-step-pic1.jpg',
            type: 'image/jpeg',
            size: 19410,
            timeCreated: '01/01/2000',
            updated: '01/01/2000',
          },
        ],
      }

      render(howtoWrapper(howtoProps))
      const urlField = await screen.getByTestId('step-videoUrl')
      await user.click(urlField)
      await user.paste('https://www.anything.com/')
      await user.click(document.body)

      await screen.findByText('Do not include both images and video')
    })
  })
})
