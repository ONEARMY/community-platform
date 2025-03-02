import { Text } from 'npm:@react-email/components@0.0.22'
import React from 'npm:react@18.3.1'

const heroText = {
  color: '#27272c',
  fontSize: '14px',
  fontWeight: 'bold',
  marginBottom: '6px',
}

interface IProps {
  children: React.ReactNode
}

export const Hero = ({ children }: IProps) => (
  <Text style={heroText}>{children}</Text>
)
