import { Button as ButtonComp, Section } from '@react-email/components';
import React from 'react';

interface IProps {
  children: React.ReactNode;
  href: string;
  customStyle?: React.CSSProperties;
}

export const Button = ({ children, href, customStyle }: IProps) => {
  const style = {
    backgroundColor: '#e2edf7',
    borderRadius: '15px',
    border: '2px solid #27272c',
    color: '#27272c',
    fontSize: '16px',
    padding: '19px 30px',
    textDecoration: 'none',
    ...customStyle,
  };

  return (
    <Section style={{ textAlign: 'center' }}>
      <ButtonComp style={style} href={href} target="_blank">
        {children}
      </ButtonComp>
    </Section>
  );
};
