import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

if (!globalThis.defined) {
  globalThis.defined = true;
}

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

globalThis.resetBeforeEachTest = true;
