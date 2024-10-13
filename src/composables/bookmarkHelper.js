import browser from 'webextension-polyfill'

/** Get bookmark (folder or not) by title
 * @param {string} title The bookmark title to search for
*/
export function searchBookmarkByTitle (title) {
  return browser.bookmarks.search({ title })
}

export function getBookmarkById (bookmarkId) {
  return browser.bookmarks.get(bookmarkId).then(res => res[0])
}

/**
 * Update a bookmark toolbar name
 * @param {string} name Toolbar name
 */
export function updateBarName (barId, name) {
  return browser.bookmarks.update(barId, { title: name })
}

/**
 * Create a new bookmark folder
 * @param {string} folderName string The folder name
 * @param {string} parentId The bookmark folder id as parent
 */
export function createBookmarkFolder (folderName, parentId) {
  return browser.bookmarks.create({
    parentId: parentId,
    title: folderName,
  })
}

/** Remove a bookmark (folder or not)
 * @param {string} folderId The bookmark id to remove
 */
export function removeFolder (folderId) {
  return browser.bookmarks.removeTree(folderId)
}

export async function removeAllChildren (folderId) {
  const children = await getFolderChildren(folderId)
  return Promise.all(
    children.map(child => browser.bookmarks.remove(child.id))
  )
}

/**
 * Switch two bookmark folder's childrens
 * @param {string} srcFolderId The source bookmark folder id
 * @param {string} targetFolderId The target bookmark folder id
 */
export async function switchFolders (srcFolderId, targetFolderId, exceptions = []) {
  exceptions ||= []
  if (!srcFolderId || !targetFolderId) throw new Error('Source or target id is undefined!', srcFolderId, targetFolderId)

  const srcBookmarks = await getFolderChildren(srcFolderId)
  const srcBookmarksWithoutExceptions = srcBookmarks.filter(target => !exceptions.includes(target.id))
  const targetBookmarksWithoutExceptions = targetBookmarks.filter(target => !exceptions.includes(target.id))

  console.debug('SRC', srcFolderId, 'TARGET', targetFolderId)
  const moveToSrcFolder = moveToFolder(srcFolderId)
  const moveToTargetFolder = moveToFolder(targetFolderId)

  // Move to src folder before to avoid having a complete empty folder at a moment
  for (const targetBookmark of targetBookmarksWithoutExceptions) {
    await moveToSrcFolder(targetBookmark)
  }
  for (const srcBookmark of srcBookmarksWithoutExceptions) {
    await moveToTargetFolder(srcBookmark)
  }
}

/** Get children bookmarks from a bookmark folder
 * @param {string} folderId The folder id to get childrens from
 */
export function getFolderChildren (folderId) {
  return browser.bookmarks.getChildren(folderId)
}

export function moveToFolder (targetFolderId) {
  return (bookmark) => browser.bookmarks.move(bookmark.id, { parentId: targetFolderId })
}

export function copyToFolder (targetFolderId) {
  return (bookmark) => browser.bookmarks.create({
    index: bookmark.index,
    title: bookmark.title,
    url: bookmark.url,
    parentId: targetFolderId,
  })
}

export async function setAllChildrenFromTo (fromFolderId, targetFolderId) {
  await removeAllChildren(targetFolderId)
  
  const copyToTargetFolder = copyToFolder(targetFolderId)
  
  const children = await getFolderChildren(fromFolderId)
  for(const bookmark of children) {
    await copyToTargetFolder(bookmark)
  }
}
