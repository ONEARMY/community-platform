import { Section } from '@react-email/components';
import { Button } from './button';
import { Heading } from './heading';

interface IProps {
  href: string;
}

export const ButtonCallToAction = ({ href }: IProps) => {
  return (
    <Section style={{ paddingTop: '15px' }}>
      <Heading as="h2" customStyle={{ textAlign: 'center' }}>
        Liked this post?
      </Heading>
      <Button customStyle={{ fontSize: '14px', padding: '12px 24px' }} href={href}>
        Join the discussion
      </Button>
    </Section>
  );
};
