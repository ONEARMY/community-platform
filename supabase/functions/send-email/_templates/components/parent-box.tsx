import React from 'react';
import { Container, Section } from '@react-email/components';

const section = {
  backgroundColor: '#e2edf7',
  border: '2px solid #2e2e2e',
  borderRadius: '99px',
  color: '#2e2e2e',
  display: 'block',
  marginBottom: '15px',
  padding: '12px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '600px',
};

const bar = {
  borderLeft: '2px solid #2e2e2e',
  borderRight: '2px solid #fff',
  height: '50px',
  marginBottom: '15px',
  width: '2px',
};

interface IProps {
  children: React.ReactNode;
}

export const ParentBox = ({ children }: IProps) => (
  <>
    <Section style={section}>{children}</Section>
    <Container style={bar} />
  </>
);
