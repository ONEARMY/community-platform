import { Button, ReturnPathLink } from 'oa-components';

interface IProps {
  link: string;
  text: string;
  variant: string;
  sx?: any;
}

export const ProfileButtonItem = ({ link, text, variant, sx }: IProps) => {
  return (
    <ReturnPathLink to={link} style={{ minWidth: 'auto' }}>
      <Button type="button" variant={variant} data-cy={text.toLowerCase()} sx={sx}>
        {text}
      </Button>
    </ReturnPathLink>
  );
};
