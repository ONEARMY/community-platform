import styled from 'styled-components'
import Typography from '@material-ui/core/Typography'

export const Container = styled.div`
  max-width: 1200px;
  display: inline-block;
  background-color: white;
  width: 75%;
  margin: 30px auto;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  padding: 40px 50px;
`

export const ContainerLeft = styled.div`
  width: 50%;
  float: left;
  display: block;
  position: relative;
  height: 100%;
`

export const ContainerRight = styled.div`
  width: 50%;
  float: right;
  height: 100%;
  text-align: center;
`

export const CoverImg = styled.img`
  object-fit: cover;
  max-height: 360px;
  max-width: 600px;
  width: 100%;
`

export const Padding = styled.div`
  padding: 0 50px 15px;
`

export const TutorialInfo = styled(Typography)`
  margin: 10px 0 !important;
`
