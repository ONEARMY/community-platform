import '@testing-library/jest-dom/vitest'

import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { createRoutesFromElements, Route } from '@remix-run/react'
import { render } from '@testing-library/react'
import { ThemeProvider } from '@theme-ui/core'
import {
  FactoryResearchItem,
  FactoryResearchItemUpdate,
} from 'src/test/factories/ResearchItem'
import { testingThemeStyles } from 'src/test/utils/themeUtils'
import { describe, expect, it, vi } from 'vitest'

import { ResearchUpdateForm } from './ResearchUpdate.form'

const Theme = testingThemeStyles

vi.mock('src/common/hooks/useCommonStores', () => {
  return {
    useCommonStores: () => ({
      stores: {
        researchStore: {
          updateUploadStatus: {
            Start: false,
            Images: false,
            Files: false,
            Database: false,
            Complete: false,
          },
          isTitleThatReusesSlug: vi.fn(),
          unlockResearchUpdate: vi.fn(),
        },
      },
    }),
  }
})

vi.mock('src/stores/Research/research.store', () => {
  return {
    useResearchStore: () => ({
      updateUploadStatus: {
        Start: false,
        Images: false,
        Files: false,
        Database: false,
        Complete: false,
      },
      isTitleThatReusesSlug: vi.fn(),
      toggleLockResearchUpdate: vi.fn(),
    }),
  }
})

describe('Research update form', () => {
  describe('Invalid file warning', () => {
    it('Does not appear when submitting only fileLink', () => {
      const formValues = FactoryResearchItemUpdate({
        fileLink: 'www.filedonwload.test',
      })

      const wrapper = getWrapper(formValues, 'create', {})

      expect(
        wrapper.queryByTestId('invalid-file-warning'),
      ).not.toBeInTheDocument()
    })

    it('Does not appear when submitting only files', () => {
      // Arrange
      const formValues = FactoryResearchItemUpdate({
        files: [new File(['test file content'], 'test-file.zip')],
      })

      // Act
      const wrapper = getWrapper(formValues, 'create', {})

      // Assert
      expect(
        wrapper.queryByTestId('invalid-file-warning'),
      ).not.toBeInTheDocument()
    })
  })
})

const getWrapper = (formValues, parentType, navProps) => {
  const router = createMemoryRouter(
    createRoutesFromElements(
      <Route
        index
        element={
          <ResearchUpdateForm
            research={FactoryResearchItem()}
            formValues={formValues}
            parentType={parentType}
            {...navProps}
          />
        }
      ></Route>,
    ),
  )

  return render(
    <ThemeProvider theme={Theme}>
      <RouterProvider router={router} />
    </ThemeProvider>,
  )
}
