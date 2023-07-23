import { render, screen } from '@testing-library/react'
import { Form } from 'react-final-form'

import { FactoryHowto } from 'src/test/factories/Howto'
import { HowtoStep } from './HowtoStep.form'

const howtoWrapper = (howtoProps) => {
  const component = () => <HowtoStep {...howtoProps} />
  const formProps = {
    formValues: FactoryHowto(),
    onSubmit: jest.fn(),
    component,
  }
  return <Form {...formProps} />
}

describe('HowtoStep', () => {
  describe('Required step', () => {
    it("shows when it's a required step for submission", async () => {
      const howtoProps = {
        step: [],
        index: 0,
        images: [],
        onDelete: jest.fn(() => null),
        moveStep: jest.fn(() => null),
      }

      render(howtoWrapper(howtoProps))

      await screen.findByText('Step 1 *')
    })
    it("shows when it's not a required step for submission", async () => {
      const howtoProps = {
        step: [],
        index: 3,
        images: [],
        onDelete: jest.fn(() => null),
        moveStep: jest.fn(() => null),
      }

      render(howtoWrapper(howtoProps))

      await screen.findByText('Step 4')
    })
  })
})
