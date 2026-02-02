import React from 'react';
import { Heading as HeadingComp } from '@react-email/components';

interface IProps {
  children: React.ReactNode;
}

export const Heading = ({ children }: IProps) => (
  <HeadingComp
    style={{
      color: '#2e2e2e',
      lineHeight: 1.2,
      fontWeight: 'normal',
      fontFamily: '"Helvetica", serif',
      marginBottom: '12px',
      padding: '0',
    }}
    as="h1"
  >
    {children}
  </HeadingComp>
);
