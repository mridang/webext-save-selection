/**
 * @file Validation rules for selected text and generated download filenames.
 */
import { MAX_TEXT_LENGTH, MIN_TEXT_LENGTH } from './constants.js';
import type { Result } from './types.js';

const INVALID_FILENAME_CHARACTERS_PATTERN = /[<>:"/\\|?*]/;

export const validateSelectionText = (
  text: string | undefined,
): Result<string> => {
  if (typeof text !== 'string') {
    return {
      success: false,
      error: {
        type: 'INVALID_SELECTION',
        message: 'Selection text must be a string',
      },
    };
  }

  if (text.length < MIN_TEXT_LENGTH) {
    return {
      success: false,
      error: {
        type: 'INVALID_SELECTION',
        message: `Selection text must be at least ${MIN_TEXT_LENGTH} character`,
      },
    };
  }

  if (text.length > MAX_TEXT_LENGTH) {
    return {
      success: false,
      error: {
        type: 'INVALID_SELECTION',
        message: `Selection text cannot exceed ${MAX_TEXT_LENGTH} characters`,
      },
    };
  }

  return { success: true, value: text };
};

export const validateFilename = (filename: string): Result<string> => {
  const invalidChars = INVALID_FILENAME_CHARACTERS_PATTERN;
  let hasControlCharacter = false;
  for (const character of filename) {
    if ((character.codePointAt(0) ?? 0) <= 0x1f) {
      hasControlCharacter = true;
      break;
    }
  }

  if (invalidChars.test(filename) || hasControlCharacter) {
    return {
      success: false,
      error: {
        type: 'INVALID_SELECTION',
        message: 'Filename contains invalid characters',
      },
    };
  }

  if (filename.length === 0 || filename.length > 255) {
    return {
      success: false,
      error: {
        type: 'INVALID_SELECTION',
        message: 'Filename length must be between 1 and 255 characters',
      },
    };
  }

  return { success: true, value: filename };
};
