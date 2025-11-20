import React from 'react';
import { Text } from '@react-email/components';

const heroText = {
  color: '#27272c',
  fontSize: '14px',
  fontWeight: 'bold',
  marginBottom: '6px',
};

interface IProps {
  children: React.ReactNode;
}

export const Hero = ({ children }: IProps) => <Text style={heroText}>{children}</Text>;
