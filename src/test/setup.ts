import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Mock HTMLDialogElement methods (not available in jsdom)
HTMLDialogElement.prototype.showModal = function () {
  this.open = true;
};

HTMLDialogElement.prototype.close = function () {
  this.open = false;
};

// jsdom has no PointerEvent implementation; Base UI's Checkbox forwards clicks
// by dispatching one on its hidden input, so it needs the constructor to exist.
if (typeof window !== 'undefined' && typeof window.PointerEvent === 'undefined') {
  class PointerEventPolyfill extends MouseEvent {
    pointerId: number;
    pointerType: string;
    isPrimary: boolean;

    constructor(type: string, init: PointerEventInit = {}) {
      super(type, init);
      this.pointerId = init.pointerId ?? 1;
      this.pointerType = init.pointerType ?? 'mouse';
      this.isPrimary = init.isPrimary ?? true;
    }
  }

  window.PointerEvent = PointerEventPolyfill as unknown as typeof PointerEvent;
}

if (!globalThis.defined) {
  globalThis.defined = true;
}

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

globalThis.resetBeforeEachTest = true;
