import { Button as ButtonComp } from 'npm:@react-email/components@0.0.22'
import React from 'npm:react@18.3.1'

const button = {
  backgroundColor: '#e9475a',
  borderRadius: '15px',
  border: '2px solid #27272c',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  padding: '19px 30px',
  textDecoration: 'none',
  textAlign: 'center',
  display: 'block',
}

interface IProps {
  children: React.ReactNode
  href: string
}

export const Button = ({ children, href }: IProps) => (
  <ButtonComp style={button} href={href} target="_blank">
    {children}
  </ButtonComp>
)
