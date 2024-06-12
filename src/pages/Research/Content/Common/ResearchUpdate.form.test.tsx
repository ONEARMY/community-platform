import '@testing-library/jest-dom/vitest'

import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from '@emotion/react'
import { render } from '@testing-library/react'
import { FactoryResearchItemUpdate } from 'src/test/factories/ResearchItem'
import { testingThemeStyles } from 'src/test/utils/themeUtils'
import { describe, expect, it, vi } from 'vitest'

import { ResearchUpdateForm } from './ResearchUpdate.form'

const Theme = testingThemeStyles

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
      unlockResearchUpdate: vi.fn(),
    }),
  }
})

describe('Research update form', () => {
  describe('Invalid file warning', () => {
    it('Does not appear when submitting only fileLink', async () => {
      const formValues = FactoryResearchItemUpdate({
        fileLink: 'www.filedonwload.test',
      })

      const wrapper = getWrapper(formValues, 'create', {})

      expect(
        wrapper.queryByTestId('invalid-file-warning'),
      ).not.toBeInTheDocument()
    })

    it('Does not appear when submitting only files', async () => {
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
  return render(
    <ThemeProvider theme={Theme}>
      <MemoryRouter initialEntries={['/research/:slug/update']}>
        <ResearchUpdateForm
          formValues={formValues}
          parentType={parentType}
          {...navProps}
        />
      </MemoryRouter>
    </ThemeProvider>,
  )
}
