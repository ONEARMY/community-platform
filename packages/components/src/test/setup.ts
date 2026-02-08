// import matchers from '@testing-library/jest-dom/matchers'
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// extends Vitest's expect method with methods from react-testing-library
// expect.extend(matchers)

// Mock HTMLDialogElement methods (not available in jsdom)
HTMLDialogElement.prototype.showModal = function () {
  this.open = true;
};

HTMLDialogElement.prototype.close = function () {
  this.open = false;
};

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});
