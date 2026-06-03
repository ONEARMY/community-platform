import { Button, ReturnPathLink } from 'oa-components';

interface IProps {
  link: string;
  text: string;
  variant: string;
  small?: boolean;
}

export const ProfileButtonItem = ({ link, text, variant, small }: IProps) => {
  return (
    <ReturnPathLink to={link} style={{ minWidth: 'auto' }}>
      <Button type="button" variant={variant} small={small} data-cy={text.toLowerCase()}>
        {text}
      </Button>
    </ReturnPathLink>
  );
};
