import React from 'react'
import { Section } from '@react-email/components'

const section = {
  backgroundColor: '#f4f4f4',
  borderRadius: '10px',
  marginBottom: '15px',
  padding: '12px',
}

interface IProps {
  children: React.ReactNode
}

export const BoxText = ({ children }: IProps) => (
  <Section style={section}>{children}</Section>
)
