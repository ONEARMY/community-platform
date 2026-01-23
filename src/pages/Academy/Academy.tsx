import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import ExternalEmbed from 'src/pages/Academy/ExternalEmbed/ExternalEmbed';

export const getFrameSrc = (base: string, path: string): string =>
  `${base}${path
    .split('/')
    .filter((str) => str !== 'academy' && Boolean(str))
    .join('/')}`;

const Academy = () => {
  const location = useLocation();

  const [initial, setInitial] = useState<string>(
    import.meta.env.VITE_ACADEMY_RESOURCE || process.env.VITE_ACADEMY_RESOURCE || '',
  );

  useEffect(() => {
    // set initial only once
    const newInitial = getFrameSrc(
      import.meta.env.VITE_ACADEMY_RESOURCE || process.env.VITE_ACADEMY_RESOURCE || '',
      location.pathname,
    );

    if (newInitial !== initial) {
      setInitial(newInitial);
    }
  }, []);

  return <ExternalEmbed src={initial} />;
};

export default Academy;
