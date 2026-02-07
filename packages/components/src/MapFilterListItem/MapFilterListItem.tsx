import type { ThemeUIStyleObject } from 'theme-ui';
import { CardButton } from '../CardButton/CardButton';

interface IProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  filterType: string;
  sx?: ThemeUIStyleObject | undefined;
}

export const MapFilterListItem = (props: IProps) => {
  const { active, onClick, children, filterType, sx } = props;
  return (
    <CardButton
      data-cy={`MapFilterListItem-${filterType}${active ? '-active' : ''}`}
      onClick={onClick}
      extrastyles={{
        display: 'flex',
        maxWidth: ['100%', '49%'],
        width: '500px',
        flexDirection: 'row',
        backgroundColor: 'offWhite',
        padding: 1,
        alignItems: 'center',
        gap: 2,
        ...(active
          ? {
              borderColor: 'green',
              ':hover': { borderColor: 'green' },
            }
          : {
              borderColor: 'offWhite',
              ':hover': { borderColor: 'offWhite' },
            }),
        ...sx,
      }}
    >
      {children}
    </CardButton>
  );
};
