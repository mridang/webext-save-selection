/**
 * @file Ambient FileReader typings for the service worker, which has no DOM lib.
 */

declare global {
  interface FileReader {
    addEventListener(type: string, listener: (event: unknown) => void): void;
    readAsDataURL(blob: Blob): void;
    onloadend: (() => void) | null;
    onerror: (() => void) | null;
    result: string | ArrayBuffer | null;
  }

  const FileReader: {
    new (): FileReader;
  };
}

export {};
