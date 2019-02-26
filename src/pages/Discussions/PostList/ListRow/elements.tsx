import styled from 'styled-components'

import { MdRecordVoiceOver, MdQuestionAnswer } from 'react-icons/md'

export const Post = styled.li`
  height: 100px;
  border-bottom: 1px grey solid;
  &:before {
    content: '';
    display: inline-block;
    vertical-align: middle;
    height: 100%;
  }
`

export const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin: 0 20px;
  display: inline-block;
  vertical-align: middle;
`

export const TitleAndTagsContaier = styled.div`
  width: 45%;
  display: inline-block;
  vertical-align: middle;
`
// TODO remove this strange typescript casting on new @types/styled-components release
export const Title = styled<any, 'span'>('span')`
  text-decoration: none;
  font-size: 1.1em;
  color: black;
  display: block;
  max-width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

export const TagsContainer = styled.div`
  display: inline-block;
  margin-top: 10px;
`

export const Tag = styled.span`
  background-color: green;
  margin: 5px 10px;
  border-radius: 2px;
  padding: 3px;
  &:first-child {
    margin-left: 0;
  }
`

export const InteractionNb = styled.span`
  font-size: 0.8em;
  width: 10%;
  display: inline-block;
  vertical-align: middle;
`

export const ViewCount = styled.span`
  font-size: 0.8em;
  margin-left: 60px;
  width: 5%;
  display: inline-block;
  vertical-align: middle;
`

export const UsefullCount = styled.span`
  font-size: 0.8em;
  padding: 20px;
  display: inline-block;
  vertical-align: middle;
  border: 1px solid black;
`

export const PostDate = styled.span`
  font-size: 0.8em;
  margin-left: 60px;
  width: 5%;
  display: inline-block;
  vertical-align: middle;
`

export const DiscussIcon = styled(MdRecordVoiceOver)`
  font-size: 0.8em;
  margin-left: 60px;
  width: 5%;
  display: inline-block;
  vertical-align: middle;
  width: 20px;
  height: 20px;
`

export const QaIcon = styled(MdQuestionAnswer)`
  font-size: 0.8em;
  margin-left: 60px;
  width: 5%;
  display: inline-block;
  vertical-align: middle;
  width: 20px;
  height: 20px;
`
