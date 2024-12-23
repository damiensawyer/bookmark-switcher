import { isFirefox } from '~/env'

/** Bookmark folder ids */
export const TOOLBAR_FOLDER_ID = isFirefox ? 'toolbar_____' : '1'

export const MENU_BOOKMARK_FOLDER = 'menu________'
export const OTHER_BOOKMARK_FOLDER = 'unfiled_____'

export const TOOLBARS_SWITCHER_NAME = '_BookmarksSwitcher'
export const NEXT_BAR_COMMAND_NAME = 'next_bar'

/** Storage keys */
export const STORAGE_CURRENT_TOOLBAR_ATTR = 'currentToolbar'
export const STORAGE_EXCLUDED_BOOKMARK_ATTR = 'excludedBookmarks'
export const OPTION_KEY_SYNC_BAR = 'optionSyncCurrentBar'

export const EMOJI_API_KEY = '6c792eaeefc25ec25414405f3d1c30d1fd0516f9'
/** Last unicode emojis version supported */
export const MAX_EMOJI_VERSION = 13
