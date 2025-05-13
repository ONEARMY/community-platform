import React from 'react'
import { Button as ButtonComp } from '@react-email/components'

const button = {
  alignText: 'center',
  backgroundColor: '#e9475a',
  borderRadius: '15px',
  border: '2px solid #27272c',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  padding: '19px 30px',
  textDecoration: 'none',
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
