/*
 * Define NPM dependencies first.
 * Always use the ES6 `import/export` syntax instead of the
 * commonJS/NPM syntax. Mainly, because webpack doesn't allow
 * any sort of dynamic dependency injection. Simply because
 * the dependencies are gatherd by Webpack using a static code-
 * analysis technique that doesn't actually run any code. This
 * way we have a syntactic difference between node.js (where
 * dynamic `require`s is no problem) and webpack depencency
 * injection.
 */
import bespoke from 'bespoke'
import bespokeKeys from 'bespoke-keys'
import bespokeHash from 'bespoke-hash'
import bespokeThemeCube from 'bespoke-theme-cube'
import bespokeProgress from 'bespoke-progress'
import bespokeNotes from 'bespoke-notes'
import bespokeTouch from 'bespoke-touch'

/*
 * After NPM dependencies come internal ones.
 * In node.js and webpack, modules have almost zero overhead, so no
 * modules is too small. `markdown-parser.js` contains ~10 LOC but
 * having it a seperate module makes this one much more readable
 */
import markdownParser from './markdown-parser'

markdownParser(document.getElementById('presentation'))

bespoke.from(
  '#presentation',
  [
    bespokeKeys(),
    bespokeTouch(),
    bespokeHash(),
    bespokeProgress(),
    bespokeThemeCube(),
    bespokeNotes()
  ]
)

