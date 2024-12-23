import fs from 'fs-extra'
import type { Manifest } from 'webextension-polyfill'
import type PkgType from '../package.json'
import { isDev, isFirefox, port, r } from '../scripts/utils'

export async function getManifest() {
  const pkg = await fs.readJSON(r('package.json')) as typeof PkgType

  // update this file to update this manifest.json
  // can also be conditional based on your need
  const manifest: Manifest.WebExtensionManifest = {
    manifest_version: 3,
    name: pkg.displayName || pkg.name,
    version: pkg.version,
    description: pkg.description,
    default_locale: 'en',
    action: {
      default_icon: './assets/bookmark-switcher-logo-plain.png',
      default_popup: './dist/popup/index.html',
      default_title: 'Switch bookmark bar',
    },
    options_ui: {
      page: './dist/options/index.html',
      open_in_tab: true,
      browser_style: true,
    },
    browser_specific_settings: {
      gecko: {
        id: `{${process.env.ADDON_ID || 'missing id'}}`,
      },
    },
    background: isFirefox
      ? {
          scripts: ['dist/background/index.mjs'],
          type: 'module',
        }
      : {
          service_worker: './dist/background/index.mjs',
        },
    icons: {
      16: './assets/icons/bookmark-switcher-logo-plain-16.png',
      32: './assets/icons/bookmark-switcher-logo-plain-32.png',
      64: './assets/icons/bookmark-switcher-logo-plain-64.png',
    },
    permissions: [
      'bookmarks',
      'storage',
    ],
    commands: {
      next_bar: {
        suggested_key: {
          mac: 'Alt+Shift+B',
          default: 'Ctrl+Shift+B',
        },
        description: 'Switch bookmark toolbars',
      },
    },
    host_permissions: isDev ? ['*://*/*'] : [],
    // content_scripts: [
    //   {
    //     matches: [
    //       '<all_urls>',
    //     ],
    //     js: [
    //       'dist/contentScripts/index.global.js',
    //     ],
    //   },
    // ],
    // web_accessible_resources: [
    //   {
    //     resources: ['dist/contentScripts/style.css'],
    //     matches: ['<all_urls>'],
    //   },
    // ],
    content_security_policy: {
      extension_pages: isDev
        // this is required on dev for Vite script to load
        ? `script-src \'self\' http://localhost:${port}; object-src \'self\'`
        : 'script-src \'self\'; object-src \'self\'',
    },
  }

  // FIXME: not work in MV3
  if (isDev && false) {
    // for content script, as browsers will cache them for each reload,
    // we use a background script to always inject the latest version
    // see src/background/contentScriptHMR.ts
    delete manifest.content_scripts
    manifest.permissions?.push('webNavigation')
  }

  return manifest
}
