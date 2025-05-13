import React from 'react'
import { Heading as HeadingComp } from '@react-email/components'

const h1 = {
  color: '#2e2e2e',
  lineHeight: '30px',
  fontSize: '24px',
  fontWeight: 'normal',
  fontFamily: '"Helvetica", serif',
  marginBottom: '12px',
  padding: '0',
}

interface IProps {
  children: React.ReactNode
}

export const Heading = ({ children }: IProps) => (
  <HeadingComp style={h1}>{children}</HeadingComp>
)
