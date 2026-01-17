import React from 'react';
import { Section } from '@react-email/components';

interface IProps {
  children: React.ReactNode;
}

export const Header = ({ children }: IProps) => (
  <Section
    style={{
      padding: '10px',
    }}
  >
    {children}
  </Section>
);
