import { ReactCountryFlag } from 'react-country-flag';

interface IProps {
  countryCode: string;
  width?: string;
  height?: string;
}

export const FlagIcon = ({ countryCode, width = '21px', height = '14px' }: IProps) => {
  return (
    <ReactCountryFlag
      data-cy={`country:${countryCode}`}
      countryCode={countryCode}
      title={countryCode}
      svg={true}
      style={{
        borderRadius: '3px',
        backgroundSize: 'cover',
        width,
        height,
      }}
    />
  );
};
