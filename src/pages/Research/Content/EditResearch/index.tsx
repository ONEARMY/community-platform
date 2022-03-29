import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import * as React from 'react'
import { Redirect, RouteComponentProps } from 'react-router'
import { Loader } from 'src/components/Loader'
import Text from 'src/components/Text'
import { IResearch } from 'src/models/research.models'
import { IUser } from 'src/models/user.models'
import ResearchForm from 'src/pages/Research/Content/Common/Research.form'
import { useResearchStore } from 'src/stores/Research/research.store'
import { isAllowToEditContent } from 'src/utils/helpers'

interface IState {
  formValues: IResearch.ItemDB
  formSaved: boolean
  isLoading: boolean
  _toDocsList: boolean
  showSubmitModal?: boolean
  loggedInUser?: IUser | undefined
}
type IProps = RouteComponentProps<any>

const EditResearch = observer((props: IProps) => {
  const store = useResearchStore()
  const [state, setState] = React.useState<IState>({
    formValues: {} as IResearch.ItemDB,
    formSaved: false,
    _toDocsList: false,
    isLoading: !store.activeResearchItem,
    loggedInUser: store.activeUser,
  })

  React.useEffect(() => {
    ;(async () => {
      let loggedInUser = store.activeUser
      if (!loggedInUser) {
        // TODO - handle the case where user is still loading
        await new Promise<void>(resolve =>
          setTimeout(() => {
            loggedInUser = store.activeUser
            resolve()
          }, 3000),
        )
      }
      if (store.activeResearchItem! !== undefined) {
        setState(prevState => ({
          ...prevState,
          formValues: toJS(store.activeResearchItem) as IResearch.ItemDB,
          isLoading: false,
          loggedInUser,
        }))
      } else {
        const slug = props.match.params.slug
        const doc = await store.setActiveResearchItem(slug)
        setState(prevState => ({
          ...prevState,
          formValues: doc as IResearch.ItemDB,
          isLoading: false,
          loggedInUser,
        }))
      }
    })()
  }, [store, props.match.params.slug])

  const { formValues, isLoading, loggedInUser } = state

  if (formValues && !isLoading) {
    if (loggedInUser && isAllowToEditContent(formValues, loggedInUser)) {
      return (
        <ResearchForm formValues={formValues} parentType="edit" {...props} />
      )
    } else {
      return <Redirect to={'/research/' + formValues.slug} />
    }
  } else {
    return isLoading ? (
      <Loader />
    ) : (
      <Text txtcenter mt="50px" sx={{width: '100%'}}>
        Research not found
      </Text>
    )
  }
})

export default EditResearch
