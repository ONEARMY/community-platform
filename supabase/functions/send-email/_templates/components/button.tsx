import React from 'react';
import { Button as ButtonComp, Section } from '@react-email/components';

const button = {
  backgroundColor: '#E2EDF7',
  borderRadius: '15px',
  border: '2px solid #27272c',
  color: '#27272c',
  fontSize: '16px',
  padding: '19px 30px',
  textDecoration: 'none',
};

interface IProps {
  children: React.ReactNode;
  href: string;
}

export const Button = ({ children, href }: IProps) => (
  <Section style={{ textAlign: 'center' }}>
    <ButtonComp style={button} href={href} target="_blank">
      {children}
    </ButtonComp>
  </Section>
);
