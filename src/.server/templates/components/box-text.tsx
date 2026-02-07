import { Section } from '@react-email/components';
import React from 'react';

const section = {
  backgroundColor: '#f4f4f4',
  borderRadius: '10px',
  lineHeight: 1.66,
  marginBottom: '15px',
  padding: '20px',
};

interface IProps {
  children: React.ReactNode;
}

export const BoxText = ({ children }: IProps) => <Section style={section}>{children}</Section>;
