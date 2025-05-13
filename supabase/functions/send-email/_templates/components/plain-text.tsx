import React from 'react'
import { Text } from '@react-email/components'

const text = {
  color: '#27272c',
  fontSize: '14px',
  whiteSpace: 'pre-line',
}

interface IProps {
  children: React.ReactNode
}

export const PlainText = ({ children }: IProps) => (
  <Text style={text}>{children}</Text>
)
