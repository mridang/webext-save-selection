/**
 * @file Unit tests for the selection and filename validation rules.
 */
import { describe, it, expect } from '@jest/globals';
import { validateSelectionText, validateFilename } from '../src/validation.js';

describe('validateSelectionText', () => {
  it('should accept valid text', () => {
    const result = validateSelectionText('Hello World');

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value).toBe('Hello World');
    }
  });

  it('should reject undefined text', () => {
    const result = validateSelectionText(undefined);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe('INVALID_SELECTION');
    }
  });

  it('should reject empty text', () => {
    const result = validateSelectionText('');

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe('INVALID_SELECTION');
    }
  });

  it('should reject text exceeding maximum length', () => {
    const longText = 'a'.repeat(1_000_001);
    const result = validateSelectionText(longText);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe('INVALID_SELECTION');
    }
  });

  it('should accept text at maximum length', () => {
    const maxText = 'a'.repeat(1_000_000);
    const result = validateSelectionText(maxText);

    expect(result.success).toBe(true);
  });
});

const oldPattern = new RegExp(
  String.raw`[<>:"/\\|?*${String.fromCodePoint(0)}-${String.fromCodePoint(0x1f)}]`,
);

describe('validateFilename', () => {
  it('should accept valid filename', () => {
    const result = validateFilename('test.txt');

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value).toBe('test.txt');
    }
  });

  it('should reject filename with invalid characters', () => {
    const invalidFilenames = [
      'test<.txt',
      'test>.txt',
      'test".txt',
      'test/.txt',
      String.raw`test\.txt`,
      'test|.txt',
      'test?.txt',
      'test*.txt',
    ];

    invalidFilenames.forEach((filename) => {
      const result = validateFilename(filename);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('INVALID_SELECTION');
      }
    });
  });

  it('should reject every control character and accept every other ASCII character the old pattern accepted', () => {
    for (let code = 0; code < 592; code += 1) {
      const filename = `a${String.fromCodePoint(code)}b`;
      expect(validateFilename(filename).success).toBe(
        !oldPattern.test(filename),
      );
    }
  });

  it('should answer like the old pattern on a long adversarial filename', () => {
    const clean = 'a'.repeat(250);
    for (const filename of [
      clean,
      `${clean}\u0001`,
      `${clean}:`,
      clean.replace(/a$/, '\n'),
    ]) {
      expect(validateFilename(filename).success).toBe(
        !oldPattern.test(filename),
      );
    }
  });

  it('should reject empty filename', () => {
    const result = validateFilename('');

    expect(result.success).toBe(false);
  });

  it('should reject filename exceeding 255 characters', () => {
    const longFilename = 'a'.repeat(256);
    const result = validateFilename(longFilename);

    expect(result.success).toBe(false);
  });
});
