import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { CommentList } from './CommentList'

export default {
  title: 'Components/CommentList',
  component: CommentList,
} as ComponentMeta<typeof CommentList>

const comments = [
  {
    _created: '2022-06-15T09:41:09.571Z',
    _creatorId: 'TestCreatorID',
    _id: 'testID',
    creatorName: 'TestName',
    isUserVerified: false,
    text: 'Test text one',
    isEditable: true,
  },
  {
    _created: '2022-06-15T09:41:09.571Z',
    _creatorId: 'TestCreatorID2',
    _id: 'testID2',
    creatorName: 'TestName2',
    isUserVerified: false,
    text: 'Test text two',
    isEditable: true,
  },
]

export const Default: ComponentStory<typeof CommentList> = () => (
  <CommentList
    comments={comments}
    articleTitle="Test article"
    handleDelete={() => Promise.resolve()}
    handleEditRequest={() => Promise.resolve()}
    handleEdit={() => Promise.resolve()}
  />
)
