import React from 'react'
import { Container, Section, Text } from '@react-email/components'

const mainContainer = {
  maxWidth: '600px',
}

const text = {
  alignText: 'center',
  color: '#27272c',
  fontSize: '14px',
  whiteSpace: 'pre-line',
}

interface IProps {
  children: React.ReactNode
}

export const Footer = ({ children }: IProps) => (
  <Container style={mainContainer}>
    <Section style={{ textAlign: 'center' }}>
      <Text style={text}>{children}</Text>
    </Section>
  </Container>
)
