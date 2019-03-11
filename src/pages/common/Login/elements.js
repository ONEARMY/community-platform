import * as React from 'react'
import styled from 'styled-components'
import Paper from '@material-ui/core/Paper'
import Avatar from '@material-ui/core/Avatar'
import RouterLink from 'react-router-dom/Link'
import { Link as RebassLink } from 'rebass'
import { theme } from 'src/themes/app.theme'

export const Link = props => <RebassLink {...props} as={RouterLink} />

export const ModalPaper = styled(Paper)`
  margin-top: ${theme.spacing.unit * 8}px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px
    ${theme.spacing.unit * 3}px;
`

export const Main = styled.main`
  width: auto;
  display: block; // Fix IE11 issue.
  padding-left: ${theme.spacing.unit * 3}px;
  padding-right: ${theme.spacing.unit * 3}px;
`

export const ModalAvatar = styled(Avatar)`
  margin: ${theme.spacing.unit};
  background-color: ${theme.palette.secondary.main};
`

export const Form = styled.form`
  width: 100%;
  margin-top: ${theme.spacing.unit};
`
