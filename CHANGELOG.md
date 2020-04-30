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
