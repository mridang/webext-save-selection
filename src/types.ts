/**
 * @file Type aliases for Chrome context menu and tab payloads, and the result shape.
 */

// eslint-disable-next-line @typescript-eslint/no-deprecated -- the chrome namespace in @types/chrome is flagged as Chrome Apps platform, but extensions use it; the preset's allow entry does not cover namespace references
export type ContextMenuInfo = chrome.contextMenus.OnClickData;

// eslint-disable-next-line @typescript-eslint/no-deprecated -- the chrome namespace in @types/chrome is flagged as Chrome Apps platform, but extensions use it; the preset's allow entry does not cover namespace references
export type Tab = chrome.tabs.Tab;

type ExtensionError =
  | { readonly type: 'INVALID_SELECTION'; readonly message: string }
  | { readonly type: 'DOWNLOAD_FAILED'; readonly message: string }
  | { readonly type: 'MENU_CREATION_FAILED'; readonly message: string };

export type Result<T, E = ExtensionError> =
  | { readonly success: true; readonly value: T }
  | { readonly success: false; readonly error: E };
