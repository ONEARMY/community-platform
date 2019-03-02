import styled from 'styled-components'
import Button from '@material-ui/core/Button'
import { colors } from 'src/themes/styled.theme'

export const Container = styled.div`
  display: inline-block;
  width: 100%;
  text-align: center;
`

export const TagContainer = styled.div`
  margin: 5px;
  display: inline-block;
`

export const Tag = styled(Button)`
  && {
    width: 140px;
    border-radius: 0 !important;
  }
`

export const SelectedTag = styled(Tag)`
  && {
    background-color: ${colors.greyTag};
    color: white;
  }
  &&:hover {
    background-color: ${colors.greyTag};
    color: white;
  }
`
