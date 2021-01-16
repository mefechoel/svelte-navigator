# 3.1.5

## Fix:

- Prevent status div messing with layout
  [#28](https://github.com/mefechoel/svelte-navigator/issues/28)

## Other:

- Update dependencies

# 3.1.4

## Fix:

- Fix untyped Link and Route props
  [#21](https://github.com/mefechoel/svelte-navigator/issues/21)

# 3.1.3

## Fix:

- Support hash fragments in memory locations

## Other:

- Add more tests [#19](https://github.com/mefechoel/svelte-navigator/issues/19)
- Update dependencies
- Add prepublish hook

# 3.1.2

## Fix:

- Fix incorrect search string when parsing url with empty search and hash in ssr

## Other:

- Remove unused ref binding to announcement live region in `Router`

# 3.1.1

## Fix:

- Prevent navigations getting lost, that occur before the `Router` mounts
  [#16](https://github.com/mefechoel/svelte-navigator/issues/16)

# 3.1.0

## Features:

- TypeScript support 🎉
  [#14](https://github.com/mefechoel/svelte-navigator/issues/14)

## Other:

- Provide a warning when passing a `basepath` prop to a non-top-level `Router`
- Provide a warning when passing a NavigationOptions object to `navigate`, when
  the first argument is a number

# 3.0.11

## Fix:

- Check if an element, that might be an anchor is null, when using `use:links`,
  to avoid error [#12](https://github.com/mefechoel/svelte-navigator/issues/12)

# 3.0.10

## Other:

- Update dependencies
- Fix serialize-javascript security alert (originating from
  rollup-plugin-terser)
- Bump svelte-navigator version in examples

# 3.0.9

## Other:

- Update dependencies
- Fix lodash security alert

# 3.0.8

## Fix:

- In-page jumps via fragment links work properly now
  [#3](https://github.com/mefechoel/svelte-navigator/issues/3):
  - Focus management is disabled, when jumpin in-page, so the browser can move
    focus correctly
  - Navigation is not announced, when a fragment is added to the url, but the
    `Route` does not change

# 3.0.7

## Fix:

- Fix `window is undefined` in SSR mode

# 3.0.6

## Fix:

- Server side rendering works properly now:
  - `window is undefined` error is fixed
  - All matched Routes and nested Routes will be rendered
  - Accessing params in slots and Route component is fixed
  - Search string is extracted from url and can be accessed in location
  - Update SSR example

## Other:

- Fix typo in README [#2](https://github.com/mefechoel/svelte-navigator/pull/2)
  ([hidde](https://github.com/hidde))

# 3.0.5

## Other:

- Refactor Route and Link component to be 'sveltier'
- Slightly improve bundle size

# 3.0.4

## Other:

- Warn, when hooks are called outside of a required context

# 3.0.3

## Fix:

- Asyncronous focus now works correctly, when location changes, but the
  component does not

# 3.0.2

## Other:

- Fix cased links in README

# 3.0.1

## Other:

- Add `useFocus` link in README

# 3.0.0

## Features:

- `Router` now automatically manages focus in your app
  - It focuses an appropriate heading, when changing `Route`s
  - It makes an announcement to screen reader users when changing `Route`s
  - You can customize which element should be focused after the `Route`
    transition via the `useFocus` hook
  - You can customize the screen reader announcement via the
    `a11y.createAnnouncement` prop
- `Route`s can now be nested
- The `useParams` hook allows access to url params, matched by the parent
  `Route`
- The `useResolvable` hook allows to subscribe to a resolved path

## Breaking:

- Link props and getProps return value will be merged, with getProps taking
  precedent
- Path resolution now does not treat the base of a nested Router as an absolute
  base any more
- The `useActiveRoute` has been removed. You should use `useMatch` or
  `useParams` instead
- The `useBase` hook has been removed
- The `useLinkResolve` hook has been renamed to `useResolve`

# 2.0.3

## Other:

- Mark package as side effect free

# 2.0.2

## Other:

- Add URL Bar example
- Add REPL Links to all examples

# 2.0.1

## Fixes:

- Fix automatic usage of memory history in Svelte REPL

## Other:

- Add Lazy Loading example

# 2.0.0

## Features:

- Add `useMatch` hook
- Add `meta` prop to `Route`

## Fixes:

- Fix incorrect resolving of links after component initialization, when using
  `useLinkResolve`

## Breaking:

- Remove `name` prop from `Route`. Use `meta` prop instead
- Remove the apps basepath from the location, so the location always looks the
  same, no matter where the app is served from

## Other:

- Add tests
- Add module, umd and unpkg builds
- Add warnings for common usage mistakes
- Always dispatch action from history when updating location

# 1.1.0

- Add `name` prop to `Route`, to identify a specific `Route` for example, when
  using the `useActiveRoute` hook
- Always keep the `route.path` intact. Use `route.fullPath` for resolved
  absolute path in navigation
- Use a unique id internally for matching, instead of object identity

# 1.0.0

- Expose scoped `navigate` function as prop of `Route` `component` and in slots
  with `let:navigate`
- Allow configuration of `Router` history through `history` prop, and exposition
  of `createHistory` and `createMemorySource` functions
- Allow passing of custom `navigate` function to `link` and `links` actions via
  `use:link={myCustomNavigate}`
- Add more examples and improve documentation

# 0.4.0

- Remove default value for `to` prop in `Link`

# 0.3.0

- Remove confusing `useRouterBase` hook. Use `useActiveRoute` instead.
- Improve code documentation
- Improve Readme

# 0.2.0

- Fix link resolution

Checkout
[svelte-routings Changelog](https://github.com/EmilTholin/svelte-routing/blob/master/CHANGELOG.md)
for previous changes.
