import { ReactCountryFlag } from 'react-country-flag';

interface IProps {
  countryCode: string;
  height?: string;
  width?: string;
}

export const FlagIcon = ({ countryCode, height = '14px', width = '21px' }: IProps) => {
  return (
    <ReactCountryFlag
      data-cy={`country:${countryCode}`}
      countryCode={countryCode}
      title={countryCode}
      svg={true}
      style={{
        borderRadius: '3px',
        backgroundSize: 'cover',
        height,
        width,
      }}
    />
  );
};
