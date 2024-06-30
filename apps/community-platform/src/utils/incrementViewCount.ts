import {
  addIDToSessionStorageArray,
  retrieveSessionStorageArray,
} from './sessionStorage'

import type { IHowtoDB, IQuestionItem, IResearchItem } from '../models'
import type { IStores } from '../stores/RootStore'

type IDocument = Partial<IHowtoDB | IQuestionItem | IResearchItem>
type IDocumentType = 'howto' | 'question' | 'research'

interface IProps {
  document: IDocument
  documentType: IDocumentType
  store: IStores['howtoStore' | 'researchStore' | 'questionStore']
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
