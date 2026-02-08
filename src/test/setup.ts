import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Mock ResizeObserver for Uppy Dashboard (not available in jsdom)
globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock HTMLDialogElement methods (not available in jsdom)
HTMLDialogElement.prototype.showModal = function () {
  this.open = true;
};

HTMLDialogElement.prototype.close = function () {
  this.open = false;
};

if (!globalThis.defined) {
  globalThis.defined = true;
}

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

globalThis.resetBeforeEachTest = true;
