import { ReactCountryFlag } from 'react-country-flag';
import { cn } from '@/lib/utils';

const flagIconSizes = {
  default: { width: '21px', height: '14px' },
  sm: { width: '14px', height: '9px' },
};

type FlagIconProps = {
  countryCode: string;
  size?: keyof typeof flagIconSizes;
  className?: string;
};

function FlagIcon({ countryCode, size = 'default', className }: FlagIconProps) {
  return (
    <ReactCountryFlag
      data-slot="flag-icon"
      data-cy={`country:${countryCode}`}
      countryCode={countryCode}
      title={countryCode}
      svg
      className={cn('rounded-flag', className)}
      style={flagIconSizes[size]}
    />
  );
}

export { FlagIcon };
