import { useState } from 'react'
import { Avatar } from 'theme-ui'

import { CreateComment } from './CreateComment'

import type { StoryFn, Meta } from '@storybook/react'

export default {
  title: 'Components/CreateComment',
  component: CreateComment,
} as Meta<typeof CreateComment>

export const Default: StoryFn<typeof CreateComment> = () => {
  const [comment, setComment] = useState('')
  return (
    <CreateComment
      comment={comment}
      onChange={setComment}
      onSubmit={() => null}
      userProfileType="member"
      maxLength={1000}
      isLoggedIn={true}
    />
  )
}

export const LoggedOut: StoryFn<typeof CreateComment> = () => {
  const [comment, setComment] = useState('')
  return (
    <CreateComment
      comment={comment}
      onChange={setComment}
      onSubmit={() => null}
      userProfileType="member"
      maxLength={123}
      isLoggedIn={false}
    />
  )
}

export const WithLongComment: StoryFn<typeof CreateComment> = () => {
  const [comment, setComment] =
    useState(`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque sodales sodales nunc, ut pharetra magna. Nulla malesuada sodales finibus. In condimentum nulla et nunc convallis, ac interdum turpis convallis. Praesent nec ipsum et lacus rhoncus facilisis id ac enim. Nunc cursus facilisis libero non blandit. Maecenas in mauris vel odio sollicitudin rutrum. Sed suscipit fermentum mi, nec faucibus urna mattis quis. In euismod mi ut lorem imperdiet semper.

Vestibulum mi felis, blandit ut mollis sed, consequat et massa. Vivamus vitae sem mattis, scelerisque odio ac, convallis lectus. Duis arcu velit, euismod et leo eget, iaculis molestie est. Phasellus facilisis in metus id sodales. Integer vestibulum interdum euismod. Fusce in lectus non lorem accumsan condimentum a non enim. Quisque porta fermentum facilisis.

Donec ut tristique sapien. Morbi consectetur, elit sit amet molestie fringilla, eros odio rutrum est, sed dictum tortor massa et mi. Donec nec justo lorem. Suspendisse potenti. Proin molestie dolor sed ipsum porta sollicitudin eget quis mauris. Integer quis nisl magna. Vivamus convallis nunc ac mauris interdum tempor. Nullam elit velit, sollicitudin et porttitor sit amet, ultricies a sem. Mauris erat orci, sodales eget enim a, semper porta enim. Integer at mi molestie enim consectetur laoreet. Mauris diam ligula, lobortis nec tortor eget, pulvinar finibus dolor. Fusce ac tincidunt leo. Pellentesque elementum, tellus a feugiat commodo, leo risus ornare nulla, ut interdum justo dolor non turpis. Aliquam semper tortor quis nunc posuere tincidunt.

Donec dapibus leo quis sagittis fringilla. Phasellus ut imperdiet sapien. Nullam posuere elementum odio, a condimentum velit. Integer diam lacus, iaculis eu faucibus eu, iaculis ac eros. Suspendisse accumsan accumsan congue. Vivamus feugiat mi quis massa convallis, sed vestibulum elit volutpat. Suspendisse in elit arcu. Cras fermentum condimentum odio, et ultrices urna auctor et. Ut orci metus, sagittis sit amet sollicitudin in, sagittis sed metus.`)

  return (
    <CreateComment
      comment={comment}
      onChange={setComment}
      onSubmit={() => null}
      userProfileType="member"
      maxLength={12300}
      isLoggedIn={true}
    />
  )
}

export const CustomButtonText: StoryFn<typeof CreateComment> = () => {
  const [comment, setComment] = useState('')
  return (
    <CreateComment
      buttonLabel="SEND THIS NOOOOW!"
      comment={comment}
      onChange={setComment}
      onSubmit={() => null}
      userProfileType="member"
      maxLength={123}
      isLoggedIn={false}
    />
  )
}

export const CustomAvatar: StoryFn<typeof CreateComment> = () => {
  const [comment, setComment] = useState('')
  const src =
    'http://cdn.mcauto-images-production.sendgrid.net/cb5a685b085b7e7c/1e6f3be3-e6fd-46c5-b30f-bcde950b0dbc/165x131.png'

  return (
    <CreateComment
      comment={comment}
      onChange={setComment}
      onSubmit={() => null}
      maxLength={123}
      userAvatar={<Avatar src={src} />}
      isLoggedIn={true}
    />
  )
}
