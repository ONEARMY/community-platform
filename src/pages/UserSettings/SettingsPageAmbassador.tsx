import { useEffect, useState } from 'react';

export const SettingsPageAmbassador = () => {
  const [code, setCode] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/settings/ambassador')
      .then((response) => (response.ok ? response.json() : null))
      .then((body) => setCode(body?.code ?? null))
      .catch(() => setCode(null));
  }, []);

  if (!code) {
    return null;
  }

  return <p data-cy="AmbassadorLink">{`${window.location.origin}/support?ref=${code}`}</p>;
};
