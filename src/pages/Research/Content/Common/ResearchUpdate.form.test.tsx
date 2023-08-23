import { render } from "@testing-library/react"
import { Provider } from "mobx-react"
import { act } from "react-dom/test-utils"
import { useCommonStores } from "src"
import { FactoryResearchItemUpdate } from "src/test/factories/ResearchItem"

import { ThemeProvider } from "theme-ui"
import { testingThemeStyles } from 'src/test/utils/themeUtils'
import { MemoryRouter } from "react-router"
import { ResearchUpdateForm } from "./ResearchUpdate.form"
import { useResearchStore } from "src/stores/Research/research.store"
import { FactoryUser } from "src/test/factories/User"

const Theme = testingThemeStyles

const activeUser = FactoryUser({
  userRoles: ['beta-tester'],
})

const mockUser = FactoryUser({ country: 'AF' })

jest.mock('src/index', () => {
  return {
    useResearchStore: () => ({
      updateUploadStatus: {
        Start: false,
        Images: false,
        Files: false,
        Database: false,
        Complete: false
      }
    })
  }
})

jest.mock('src/stores/Research/research.store')

describe('Research update form', () => {
  describe('Invalid file warning', () => {
    it('Does not appear when submitting only fileLink', async () => {
      const formValues = FactoryResearchItemUpdate({fileLink: 'www.filedonwload.test'})
  
      let wrapper
      await act(async () => {
        wrapper = await getWrapper(formValues, 'create', {})
  
      })

      expect(wrapper.queryByTestId('invalid-file-warning')).not.toBeInTheDocument()
    })
  })

})

const getWrapper = async (formValues, parentType, navProps) => {
  return render(
    <Provider {...useResearchStore()}>
      <ThemeProvider theme={Theme}>
        <MemoryRouter initialEntries={['/research/:slug/update']}>
          <ResearchUpdateForm
            formValues={formValues}
            parentType={parentType}
            {...navProps}
          />
        </MemoryRouter>
      </ThemeProvider>
    </Provider>,
  )
}