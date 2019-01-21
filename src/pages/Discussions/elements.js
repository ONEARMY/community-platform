import styled from 'styled-components'

import Row from 'src/components/Layout/Row.js'

import { MdRecordVoiceOver, MdQuestionAnswer } from 'react-icons/md'

export const Content = styled.div`
  margin-top: 5%;
  text-align: left;
  color: black;
`

export const Main = styled(Row)`
  @media (max-width: 768px) {
    flex-direction: column;
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

export const List = styled.ul`
  list-style: none;
  width: 100%;
  display: inline-block;
  padding: 0;
`
export const Post = styled.li`
  height: 100px;
  margin: 0 25px;
  border-bottom: 1px grey solid;
  &:before {
    content: '';
    display: inline-block;
    vertical-align: middle;
    height: 100%;
  }
`

export const TitleAndTagsContaier = styled.div`
  width: 45%;
  display: inline-block;
  vertical-align: middle;
`

export const Title = styled.a`
  text-decoration: none;
  font-size: 1.1em;
  color: black;
  display: block;
  max-width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  &:hover {
    text-decoration: underline;
  }
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
  margin-left: 20px;
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
  margin-left: 30px;
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
