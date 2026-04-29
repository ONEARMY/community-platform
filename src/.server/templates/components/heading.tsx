import { Heading as HeadingComp } from '@react-email/components';
import React from 'react';

interface IProps {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | undefined;
  customStyle?: React.CSSProperties;
}

export const Heading = ({ as, children, customStyle }: IProps) => (
  <HeadingComp
    style={{
      color: '#2e2e2e',
      lineHeight: 1.2,
      fontWeight: 'normal',
      fontFamily: '"Helvetica", serif',
      marginBottom: '12px',
      padding: '0',
      ...customStyle,
    }}
    as={as || 'h1'}
  >
    {children}
  </HeadingComp>
);
