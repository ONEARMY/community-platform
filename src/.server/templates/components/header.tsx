import { Section } from '@react-email/components';
import React from 'react';

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
