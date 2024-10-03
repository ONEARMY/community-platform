import {
  addIDToSessionStorageArray,
  retrieveSessionStorageArray,
} from './sessionStorage'

import type { IHowtoDB, IQuestion, IResearch, IUserDB } from 'oa-shared'
import type { IStores } from 'src/stores/RootStore'

type IDocument = Partial<IHowtoDB | IQuestion.Item | IResearch.Item | IUserDB>
type IDocumentType = 'howto' | 'question' | 'research' | 'user'

interface IProps {
  document: IDocument
  documentType: IDocumentType
  store: IStores['howtoStore' | 'researchStore' | 'questionStore' | 'userStore']
}

export const incrementViewCount = async ({
  document,
  documentType,
  store,
}: IProps) => {
  const { _id } = document
  if (!_id) return

  const sessionStorageArray = retrieveSessionStorageArray(documentType)
  if (sessionStorageArray.includes(_id)) return

  await store.incrementViewCount(document)
  addIDToSessionStorageArray(documentType, _id)
}
