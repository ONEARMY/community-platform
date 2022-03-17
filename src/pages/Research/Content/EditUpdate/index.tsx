import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import * as React from 'react'
import { Redirect, RouteComponentProps } from 'react-router'
import { Loader } from 'src/components/Loader'
import Text from 'src/components/Text'
import { IResearch } from 'src/models/research.models'
import { IUser } from 'src/models/user.models'
import UpdateForm from 'src/pages/Research/Content/Common/Update.form'
import { useResearchStore } from 'src/stores/Research/research.store'
import { isAllowToEditContent } from 'src/utils/helpers'

interface IState {
  formValues: IResearch.UpdateDB
  formSaved: boolean
  isLoading: boolean
  _toDocsList: boolean
  showSubmitModal?: boolean
  loggedInUser?: IUser | undefined
}
type IProps = RouteComponentProps<{ update: string; slug: string }> & {
  updateId?: string
}

const EditUpdate = observer((props: IProps) => {
  const store = useResearchStore()
  const [state, setState] = React.useState<IState>({
    formValues: {} as IResearch.UpdateDB,
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
      const updateId = props.updateId
        ? props.updateId
        : props.match.params.update
      if (store.activeResearchItem! !== undefined) {
        const update = store.activeResearchItem.updates.find(
          upd => upd._id === updateId,
        )
        setState(prevState => ({
          ...prevState,
          formValues: toJS(update) as IResearch.UpdateDB,
          isLoading: false,
          loggedInUser,
        }))
      } else {
        const slug = props.match.params.slug
        const doc = await store.setActiveResearchItem(slug)
        let update
        if (doc) {
          update = doc.updates.find(upd => upd._id === updateId)
        }
        setState(prevState => ({
          ...prevState,
          formValues: update as IResearch.UpdateDB,
          isLoading: false,
          loggedInUser,
        }))
      }
    })()
  }, [
    store,
    props.match.params.slug,
    props.match.params.update,
    props.updateId,
  ])

  const { formValues, isLoading, loggedInUser } = state
  if (formValues && !isLoading) {
    if (
      loggedInUser &&
      isAllowToEditContent(store.activeResearchItem!, loggedInUser)
    ) {
      return <UpdateForm formValues={formValues} parentType="edit" {...props} />
    } else {
      return <Redirect to={'/research/' + store.activeResearchItem!.slug} />
    }
  } else {
    return isLoading ? (
      <Loader />
    ) : (
      <Text txtcenter mt="50px" sx={{width: '100%'}}>
        Research update not found
      </Text>
    )
  }
})

export default EditUpdate
