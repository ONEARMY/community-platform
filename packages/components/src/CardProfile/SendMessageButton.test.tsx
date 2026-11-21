import '@testing-library/jest-dom/vitest';

import { fireEvent } from '@testing-library/react';
import type { MapPin } from 'oa-shared';
import { describe, expect, it, vi } from 'vitest';

import { render } from '../test/utils';
import { SendMessageButton } from './SendMessageButton';

const item = {
  profile: {
    displayName: 'Alex Example',
    isContactable: true,
    username: 'alex-example',
  },
} as MapPin;

describe('SendMessageButton', () => {
  it('uses the callback instead of navigating when provided', () => {
    const onSendMessage = vi.fn();
    const { getByRole } = render(
      <SendMessageButton item={item} onSendMessage={onSendMessage} />,
    );

    fireEvent.click(getByRole('button', { name: 'Send Message' }));

    expect(onSendMessage).toHaveBeenCalledWith(item);
  });

  it('does not render for profiles that cannot be contacted', () => {
    const { container } = render(
      <SendMessageButton
        item={{ ...item, profile: { ...item.profile, isContactable: false } }}
        onSendMessage={vi.fn()}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
