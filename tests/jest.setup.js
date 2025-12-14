import { jest } from '@jest/globals';

const mockChrome = {
  runtime: {
    onInstalled: {
      addListener: jest.fn(),
    },
  },
  contextMenus: {
    create: jest.fn(),
    onClicked: {
      addListener: jest.fn(),
    },
  },
  downloads: {
    download: jest.fn(),
  },
};

globalThis.chrome = mockChrome;

globalThis.Blob = class Blob {
  constructor(parts, options) {
    this.size = parts.reduce((acc, part) => {
      if (typeof part === 'string') {
        return acc + new TextEncoder().encode(part).length;
      }
      return acc;
    }, 0);
    this.type = options?.type || '';
  }
};

globalThis.URL = {
  createObjectURL: jest.fn(() => 'blob:test'),
  revokeObjectURL: jest.fn(),
};
