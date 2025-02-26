import { Text } from 'npm:@react-email/components@0.0.22'
import React from 'npm:react@18.3.1'

const text = {
  color: '#27272c',
  fontSize: '14px',
}

interface IProps {
  children: React.ReactNode
}

export const PlainText = ({ children }: IProps) => (
  <Text style={text}>{children}</Text>
)
