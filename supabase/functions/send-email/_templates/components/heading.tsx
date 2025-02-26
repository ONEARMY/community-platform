import { Heading as HeadingComp } from 'npm:@react-email/components@0.0.22'
import React from 'npm:react@18.3.1'

const h1 = {
  color: '#27272c',
  fontSize: '18px',
  fontWeight: '700',
  marginBottom: '12px',
  padding: '0',
}

interface IProps {
  children: React.ReactNode
}

export const Heading = ({ children }: IProps) => (
  <HeadingComp style={h1}>{children}</HeadingComp>
)
