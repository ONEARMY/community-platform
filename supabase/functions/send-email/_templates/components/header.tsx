import React from 'react'
import { Section } from '@react-email/components'

const section = {
  padding: '10px',
}

interface IProps {
  children: React.ReactNode
}

export const Header = ({ children }: IProps) => (
  <Section style={section}>{children}</Section>
)
