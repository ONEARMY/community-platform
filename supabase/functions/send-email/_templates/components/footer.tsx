import React from 'react'
import { Section, Text } from '@react-email/components'

const text = {
  alignText: 'center',
  color: '#27272c',
  fontSize: '14px',
}

interface IProps {
  children: React.ReactNode
}

export const Footer = ({ children }: IProps) => (
  <Section style={{ textAlign: 'center' }}>
    <Text style={text}>{children}</Text>
  </Section>
)
