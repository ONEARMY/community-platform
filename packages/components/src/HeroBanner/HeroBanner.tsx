import { Image } from 'theme-ui';

import Celebration from '../../assets/images/celebration.svg';
import Email from '../../assets/images/email.svg';

export interface IProps {
  type: 'celebration' | 'email';
}

export const HeroBanner = ({ type }: IProps) => {
  const src = {
    celebration: Celebration,
    email: Email,
  };

  return <Image loading="lazy" src={src[type]} />;
};
