import { Button } from '../Button/Button';

interface IProps {
  hidden?: boolean;
  title: string;
  ariaLabel: string;
  directionIcon: 'chevron-left' | 'chevron-right' | 'double-arrow-left' | 'double-arrow-right';
  onClick: () => void;
}

export const PaginationIcons = ({ hidden, title, ariaLabel, directionIcon, onClick }: IProps) => {
  if (hidden) return null;

  return (
    <Button
      type="button"
      data-cy={`pagination-icon-${directionIcon}`}
      data-testid={`pagination-icon-${directionIcon}`}
      icon={directionIcon}
      onClick={onClick}
      title={title}
      aria-label={ariaLabel}
      sx={{
        display: 'flex',
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
