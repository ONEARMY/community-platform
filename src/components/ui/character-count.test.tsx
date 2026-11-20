import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CharacterCount } from '@/components/ui/character-count';

describe('CharacterCount', () => {
  it('shows the current length over the maximum', () => {
    const { getByText } = render(<CharacterCount current={25} max={100} />);

    expect(getByText('25 / 100')).toBeInTheDocument();
  });

  it('stays muted below the maximum', () => {
    const { getByText } = render(<CharacterCount current={99} max={100} />);

    expect(getByText('99 / 100')).toHaveClass('text-muted-foreground');
  });

  it('turns bold and destructive at the maximum', () => {
    const { getByText } = render(<CharacterCount current={100} max={100} />);

    expect(getByText('100 / 100')).toHaveClass('font-bold', 'text-destructive');
  });
});
