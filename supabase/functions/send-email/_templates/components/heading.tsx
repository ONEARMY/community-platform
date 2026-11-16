import React from 'react';
import { emailFontFamily } from '../styles.ts';
import { Heading as HeadingComp } from 'react-email';

const h1 = {
  color: '#2e2e2e',
  lineHeight: 1.2,
  fontWeight: 'normal',
  fontFamily: emailFontFamily,
  marginBottom: '12px',
  padding: '0',
};

interface IProps {
  children: React.ReactNode;
}

export const Heading = ({ children }: IProps) => (
  <HeadingComp style={h1} as="h1">
    {children}
  </HeadingComp>
);
