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
