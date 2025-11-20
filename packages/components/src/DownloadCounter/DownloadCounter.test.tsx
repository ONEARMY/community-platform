import '@testing-library/jest-dom/vitest';

import { describe, expect, it } from 'vitest';

import { render } from '../test/utils';
import { DownloadCounter } from './DownloadCounter';

describe('DownloadCounter', () => {
  it('Adds commas for larger download counts', () => {
    const { getByText } = render(<DownloadCounter total={1888999} />);

    expect(getByText('1,888,999 downloads')).toBeInTheDocument();
  });

  it('Adds "download" when total is one', () => {
    const { getByText } = render(<DownloadCounter total={1} />);

    expect(getByText('1 download')).toBeInTheDocument();
  });

  it('Adds a zero for undefined total', () => {
    const { getByText } = render(<DownloadCounter total={undefined} />);

    expect(getByText('0 downloads')).toBeInTheDocument();
  });
});
