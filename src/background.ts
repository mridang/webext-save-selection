/* global chrome */
import type { ContextMenuInfo, Tab, Result } from './types.js';
import {
  MENU_ID,
  MENU_TITLE,
  FILE_PREFIX,
  FILE_EXTENSION,
  MIME_TYPE,
} from './constants.js';
import { validateSelectionText, validateFilename } from './validation.js';

export const formatTimestamp = (date: Date): string => {
  return date.toISOString().replace(/[:.]/g, '-');
};

export const createFilename = (
  prefix: string,
  timestamp: string,
): Result<string> => {
  const filename = `${prefix}${timestamp}${FILE_EXTENSION}`;
  return validateFilename(filename);
};

export const createTextBlob = (text: string): Blob => {
  return new Blob([text], { type: MIME_TYPE });
};

export const downloadFile = async (
  blob: Blob,
  filename: string,
): Promise<Result<number>> => {
  try {
    const url = URL.createObjectURL(blob);
    const downloadId = await chrome.downloads.download({
      url,
      filename,
      saveAs: false,
    });
    return { success: true, value: downloadId };
  } catch (error) {
    return {
      success: false,
      error: {
        type: 'DOWNLOAD_FAILED',
        message:
          error instanceof Error ? error.message : 'Unknown download error',
      },
    };
  }
};

export const handleContextMenuClick = async (
  info: ContextMenuInfo,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _tab?: Tab,
): Promise<void> => {
  if (info.menuItemId !== MENU_ID) {
    return;
  }

  const validationResult = validateSelectionText(info.selectionText);
  if (!validationResult.success) {
    console.error('Validation failed:', validationResult.error.message);
    return;
  }

  const text = validationResult.value;
  const timestamp = formatTimestamp(new Date());

  const filenameResult = createFilename(FILE_PREFIX, timestamp);

  if (!filenameResult.success) {
    console.error('Filename creation failed');
    return;
  }

  const blob = createTextBlob(text);
  const downloadResult = await downloadFile(blob, filenameResult.value);

  if (!downloadResult.success) {
    console.error('Download failed:', downloadResult.error.message);
  }
};

export const initializeContextMenu = (): void => {
  try {
    chrome.contextMenus.create({
      id: MENU_ID,
      title: MENU_TITLE,
      contexts: ['selection'],
    });
  } catch (error) {
    console.error(
      'Failed to create context menu:',
      error instanceof Error ? error.message : 'Unknown error',
    );
  }
};

const handleContextMenuClickSync = (info: ContextMenuInfo, tab?: Tab): void => {
  void handleContextMenuClick(info, tab);
};

chrome.runtime.onInstalled.addListener(initializeContextMenu);
chrome.contextMenus.onClicked.addListener(handleContextMenuClickSync);
