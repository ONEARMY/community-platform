import { Button } from '../Button/Button';

interface IProps {
  hidden?: boolean;
  title: string;
  directionIcon: 'chevron-left' | 'chevron-right' | 'double-arrow-left' | 'double-arrow-right';
  onClick: () => void;
}

export const PaginationIcons = ({ hidden, title, directionIcon, onClick }: IProps) => {
  return (
    <Button
      type="button"
      data-cy={`pagination-icon-${directionIcon}`}
      data-testid={`pagination-icon-${directionIcon}`}
      icon={directionIcon}
      onClick={onClick}
      title={title}
      sx={{
        display: hidden ? 'none' : 'flex',
        minWidth: '44px',
        minHeight: '44px',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0px',
      }}
      variant="subtle"
    />
  );
};
