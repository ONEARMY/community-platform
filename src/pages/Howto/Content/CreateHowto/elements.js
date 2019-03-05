import styled from 'styled-components'
import Typography from '@material-ui/core/Typography'
import { Field } from 'react-final-form'
import { Button } from 'src/components/Button'

import { colors } from 'src/themes/styled.theme'

export const FormContainer = styled.div`
  position: relative;
  margin: 0 auto;
`

export const Title = styled(Typography)`
  display: table !important;
  margin: 30px auto !important;
`

export const TutorialForm = styled.form`
  width: 100%;
  margin: 0 auto;
  text-align: left;
`

export const Background = styled.div`
  max-width: 1200px;
  width: 75%;
  display: block;
  background-color: white;
  position: relative;
  padding: 40px 50px;
  margin: auto;
`

export const DescriptionContainer = styled.div`
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  display: block;
  margin: auto 0;
  max-width: 500px;
`

export const StepBackground = styled.div`
  margin: 40px auto;
  max-width: 600px;
`

export const CoverImage = styled.img`
  width: 300px;
  display: block;
  margin: 20px auto;
`

export const Select = styled(Field)`
  border: 1px solid ${colors.grey};
  margin: 0 auto;
  display: block;
  font-size: 1.1em;
  background: white;
  width: 40%;
  height: 45px;
`
