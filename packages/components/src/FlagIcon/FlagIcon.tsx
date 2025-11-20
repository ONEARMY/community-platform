import { ReactCountryFlag } from 'react-country-flag';

interface IProps {
  countryCode: string;
}

export const FlagIcon = ({ countryCode }: IProps) => {
  return (
    <ReactCountryFlag
      data-cy={`country:${countryCode}`}
      countryCode={countryCode}
      title={countryCode}
      svg={true}
      style={{
        borderRadius: '3px',
        backgroundSize: 'cover',
        height: '14px',
        width: '21px',
      }}
    />
  );
};
