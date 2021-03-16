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
    isLoading: true,
    loggedInUser: undefined,
  })

  React.useEffect(() => {
    ;(async () => {
      const loggedInUser = store.activeUser
      if (store.activeResearchItem! !== undefined) {
        setState(prevState => ({
          ...prevState,
          formValues: toJS(store.activeResearchItem) as IResearch.ItemDB,
          isLoading: false,
          loggedInUser: loggedInUser ? loggedInUser : undefined,
        }))
      } else {
        const slug = props.match.params.slug
        const doc = await store.setActiveResearchItem(slug)
        setState(prevState => ({
          ...prevState,
          formValues: doc as IResearch.ItemDB,
          isLoading: false,
          loggedInUser: loggedInUser ? loggedInUser : undefined,
        }))
      }
    })()
  }, [])

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
      <Text txtcenter mt="50px" width={1}>
        Research not found
      </Text>
    )
  }
})

export default EditResearch
