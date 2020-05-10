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

- Fix incorrect resolving of links after component initialization, when using `useLinkResolve`

## Breaking:

- Remove `name` prop from `Route`. Use `meta` prop instead
- Remove the apps basepath from the location, so the location always looks the same, no matter where the app is served from

## Other:

- Add tests
- Add module, umd and unpkg builds
- Add warnings for common usage mistakes
- Always dispatch action from history when updating location

# 1.1.0

- Add `name` prop to `Route`, to identify a specific `Route` for example, when using the `useActiveRoute` hook
- Always keep the `route.path` intact. Use `route.fullPath` for resolved absolute path in navigation
- Use a unique id internally for matching, instead of object identity

# 1.0.0

- Expose scoped `navigate` function as prop of `Route` `component` and in slots with `let:navigate`
- Allow configuration of `Router` history through `history` prop, and exposition of `createHistory` and `createMemorySource` functions
- Allow passing of custom `navigate` function to `link` and `links` actions via `use:link={myCustomNavigate}`
- Add more examples and improve documentation

# 0.4.0

- Remove default value for `to` prop in `Link`

# 0.3.0

- Remove confusing `useRouterBase` hook. Use `useActiveRoute` instead.
- Improve code documentation
- Improve Readme

# 0.2.0

- Fix link resolution

Checkout [svelte-routings Changelog](https://github.com/EmilTholin/svelte-routing/blob/master/CHANGELOG.md) for previous changes.
