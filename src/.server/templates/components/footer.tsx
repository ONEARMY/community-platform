import React from 'react';
import { Section, Text } from '@react-email/components';

interface IProps {
  children: React.ReactNode;
}

export const Footer = ({ children }: IProps) => (
  <Section style={{ textAlign: 'center' }}>
    <Text
      style={{
        textAlign: 'center',
        color: '#27272c',
        fontSize: '14px',
      }}
    >
      {children}
    </Text>
  </Section>
);
