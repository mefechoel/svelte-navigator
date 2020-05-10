[npm]: https://img.shields.io/npm/v/svelte-navigator.svg?style=flat-square
[npm-url]: https://npmjs.com/package/svelte-navigator

# Svelte Navigator

[![npm package][npm]][npm-url]
![npm bundle size](https://img.shields.io/bundlephobia/minzip/svelte-navigator?style=flat-square)
![NPM](https://img.shields.io/npm/l/svelte-navigator?style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/mefechoel/svelte-navigator?style=flat-square)

> Simple, declarative routing for single page apps built with Svelte.

This started as a fork of [svelte-routing](https://github.com/EmilTholin/svelte-routing), with added configuration options and access to parts of the Routers context through React-esque hooks.

## Features

- Declarative configuration inspired by [react-router](https://github.com/ReactTraining/react-router) and [@reach/router](https://github.com/reach/router)
- Relative routing (paths and links are relative to the current route and parent router)
- Automatic route ranking
- Route parameters `user/:id` and (namable) wildcards `blog/*`, `blog/*wildcardName`
- React-esque hooks api for accessing parts of the Router context
- Nestable Routers for seamless merging of many smaller apps
- HTML5 history mode by default (Memory mode as fallback, or for testing)

## Table of Contents

- [Getting started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
  - [Components](#components)
    - [Router](#router)
    - [Link](#link)
    - [Route](#route)
  - [Hooks](#hooks)
    - [useNavigate](#usenavigate)
    - [useLocation](#uselocation)
    - [useActiveRoute](#useactiveroute)
    - [useLinkResolve](#uselinkresolve)
    - [useMatch](#usematch)
    - [useBase](#usebase)
  - [Programmatic Navigation](#programmatic-navigation)
    - [navigate](#navigate)
  - [Actions](#actions)
    - [link](#link-1)
    - [links](#links)
  - [Custom History](#custom-history)
- [SSR Caveat](#ssr-caveat)

## Getting started

[example-folder-url]: https://github.com/mefechoel/svelte-navigator/tree/master/example
[example-basic-client-side]: https://github.com/mefechoel/svelte-navigator/tree/master/example/basic-client-side
[example-custom-hash-history]: https://github.com/mefechoel/svelte-navigator/tree/master/example/custom-hash-history
[example-private-routes]: https://github.com/mefechoel/svelte-navigator/tree/master/example/private-routes
[example-lazy-loading]: https://github.com/mefechoel/svelte-navigator/tree/master/example/lazy-loading
[example-ssr]: https://github.com/mefechoel/svelte-navigator/tree/master/example/ssr
[example-url-bar]: https://github.com/mefechoel/svelte-navigator/tree/master/example/url-bar

[repl-basic-client-side]: https://svelte.dev/repl/451fd183e0d3403cb7800101f7d799fb
[repl-custom-hash-history]: https://svelte.dev/repl/195011a49a714e22b1a335037e124458
[repl-private-routes]: https://svelte.dev/repl/c81d8f3dff584065a82b2d3ea7cd4aee
[repl-lazy-loading]: https://svelte.dev/repl/09abb8c287f745169f66f62d51f766d5
[repl-url-bar]: https://svelte.dev/repl/dc82bb89447647edb0d7ed8cbe7999ae

Look at the [example folder][example-folder-url] for a few example project setups, or checkout the examples in the Svelte REPL:

- Simple basic usage in a client side rendered app ([examples][example-basic-client-side], [REPL][repl-basic-client-side])
- Private Routes for authenticated users only ([examples][example-private-routes], [REPL][repl-private-routes])
- Using Routes to lazy load views ([examples][example-lazy-loading], [REPL][repl-lazy-loading])
- Reacting to changes in location using `useLocation` ([examples][example-url-bar], [REPL][repl-url-bar])
- SSR ([examples][example-ssr])
- Using hash based navigation with a custom history ([examples][example-custom-hash-history], [REPL][repl-custom-hash-history])


## Installation

With `yarn`:
```bash
yarn add svelte-navigator
```

With `npm`:
```bash
npm install --save svelte-navigator
```

## Usage

Basic Setup for a client-side SPA:

```html
<!-- App.svelte -->
<script>
  import { Router, Link, Route } from "svelte-navigator";
  import Home from "./routes/Home.svelte";
  import About from "./routes/About.svelte";
  import Blog from "./routes/Blog.svelte";
</script>

<Router>
  <nav>
    <Link to="/">Home</Link>
    <Link to="about">About</Link>
    <Link to="blog">Blog</Link>
  </nav>
  <div>
    <Route path="blog/:id" component={BlogPost} />
    <Route path="blog" component={Blog} />
    <Route path="about" component={About} />
    <Route path="/">
      <Home />
    </Route>
  </div>
</Router>
```

Svelte Navigator uses the HTML5 History API by default. For it to work properly, you need to setup your server correctly.
If you're using sirv, as is common with a lot of Svelte projects, you need to pass it the `--single` option.

You can read more about the History API here:
- [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/API/History)
- [Deep dive into client side routing](https://krasimirtsonev.com/blog/article/deep-dive-into-client-side-routing-navigo-pushstate-hash)

## API

- [Components](#components)
  - [Router](#router)
  - [Link](#link)
  - [Route](#route)
- [Hooks](#hooks)
  - [useNavigate](#usenavigate)
  - [useLocation](#uselocation)
  - [useActiveRoute](#useactiveroute)
  - [useLinkResolve](#uselinkresolve)
  - [useMatch](#usematch)
  - [useBase](#usebase)
- [Programmatic Navigation](#programmatic-navigation)
  - [navigate](#navigate)
- [Actions](#actions)
  - [link](#link-1)
  - [links](#links)
- [Custom History](#custom-history)

### Components

The main elements to configure and use routing in your Svelte app.

#### `Router`

The `Router` component supplies the `Link` and `Route` descendant components with routing information through context, so you need at least one `Router` at the top of your application. It assigns a score to all its `Route` descendants and picks the best match to render.

```html
<Router>
  <Link to="profile">Go to /profile</Link>
  <Link to="blog">Go to /blog</Link>
  <Route path="blog" component={Blog} />
  <Route path="profile" component={Profile} />
</Router>
```

`Router` components can also be nested to allow for seamless merging of many smaller apps.

```html
<Router>
  <Link to="profile">Go to /profile</Link>
  <Route path="profile" component="{Profile}" />
  <Route path="blog/*">
    <Router>
      <Link to="svelte">Go to /blog/svelte</Link>
      <!--
        The base of the parent Router is "/blog",
        so absolute links are resolved against the base
      -->
      <Link to="/navigator">Go to /blog/navigator</Link>
      <!-- Break out of the scope of the current Router -->
      <Link to="../profile">Go to /profile</Link>
      <Route path="svelte">Yeah, Svelte!</Route>
      <Route path="navigator">Yeah, Routing!</Route>
      <Route path=":id" let:params>
        <Blog id={params.id} />
      </Route>
    </Router>
  </Route>
</Router>
```

When you are serving your app from a subdirectory on your server, you can add a `basepath` prop to the router.
It will be prepended to all routes and to all resolved navigations (i.e. using `Link`, `useNavigate` or `useLinkResolve`).
A `basepath` should have a leading, but no trailing slash.

```html
<Router basepath="/base">
  <Link to="profile">Go to /base/profile</Link>
  <Link to="blog">Go to /base/blog</Link>
  <Route path="blog" component={Blog} />
  <Route path="profile" component={Profile} />
</Router>
```

By default `Router`s use the HTML5 history API for navigation. You can provide a different history through the `history` prop. Svelte Navigator ships with a memory based history, which is used, when the application does not seem to run in a browser (i.e. in a test environment). You can explicitly set the memory history or you can provide your own implementation (for example a [Hash based history][example-custom-hash-history]).

```html
<script>
  import { createHistory, createMemorySource } from 'svelte-navigator';

  const memoryHistory = createHistory(createMemorySource());
</script>

<Router history={memoryHistory}>
  <!-- ... -->
</Router>
```

###### Properties

|  Property  | Required | Default Value | Description                                                                                                                                                                                                                                                                                                                               |
| :--------: | :------: | :-----------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `basepath` |          |     `'/'`     | The `basepath` property will be added to all `path` properties of `Route` descendants and to every navigation, that has access to the Routers context (from a `Link` with a `to` property or via `useNavigate`). This property can be ignored in most cases, but if you host your application on e.g. `https://example.com/my-site`, the `basepath` should be set to `/my-site`. Note that `navigate` and the `link` and `links` actions don't have access to the context. You may resolve the link manually using the `useLinkResolve` hook. |
|   `url`    |          |     `''`      | The `url` property is used in SSR to force the current URL of the application and will be used by all `Link` and `Route` descendants. A falsy value will be ignored by the `Router`, so it's enough to declare `export let url = '';` for your topmost component and only give it a value in SSR.                                         |
|   `history`  |          | \<HTML5 History> | The `history` property can be used to use a navigation method other than the browsers History API (See [custom Hash based history][example-custom-hash-history]).              |

#### `Link`

A component used to navigate around the application. It will automatically resolve the `to` path relative to the current Route and to the Router `basepath`.

```html
<Router>
  <Route path="blog/*">
    <Link to="svelte">Go to /blog/svelte</Link>
    <Link to="/profile">Go to /profile</Link>
  </Route>
</Router>
```

```html
<Router basepath="/base">
  <Route path="blog/*">
    <Link to="svelte">Go to /base/blog/svelte</Link>
    <Link to="/profile">Go to /base/profile</Link>
  </Route>
</Router>
```

###### Properties

|  Property  | Required | Default Value | Description                                                                                                                                                                                                                                                                                                                                                                               |
| :--------: | :------: | :-----------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `to`    |   ✔ ️    |               | URL the component should link to. It will be resolved relative to the current Route.                                                                                                                                                                                                                                                                                                                       |
| `replace`  |          |    `false`    | When `true`, clicking the `Link` will replace the current entry in the history stack instead of adding a new one.                                                                                                                                                                                                                                                                         |
|  `state`   |          |     `{}`      | An object that will be pushed to the history stack when the `Link` is clicked. A state is arbitrary data, that you don't want to communicate through the url, much like the body of a HTTP POST request.                                                                          |
| `getProps` |          |    `null`    | A function that returns an object that will be spread on the underlying anchor element's attributes. The first argument given to the function is an object with the properties `location`, `href`, `isPartiallyCurrent`, `isCurrent`. Look at the [`NavLink` component in the example project setup][example-folder-navlink] to see how you can build your own link components with this. |

All other props will be passed to the underlying `<a />` element if no `getProps` function is provided.

#### `Route`

A component that will render its `component` property or children when its ancestor `Router` component decides it is the best match.

All properties other than `path` and `component` given to the `Route` will be passed to the rendered `component`.

A Route path can match parameters with `"path/:parameterName"` and wildcards with `"path/*"` or `"path/*wildcardName"`. All parameters and wildcard values will be provided to the `component` as props. They can also be accessed inside a Route slot via `let:params`.

The Route `component` will also receive the current `location`, as well as the `navigate` function, that is scoped to the current route as props. The can be accessed inside the Route slot, via `let:location` and `let:navigate`.

```html
<!-- Both variants will do the same -->
<Route path="blog/:id" component="{BlogPost}" />
<Route path="blog/:id" let:params>
  <BlogPost id="{params.id}" />
</Route>

<!-- Access the current location inside the slot -->
<Route path="search" let:location>
  <BlogPost queryString="{location.search}" />
</Route>

<!--
  Routes without a path are default routes.
  They will match if no other Route could be matched
-->
<Route component="{Home}">
```

You can also provide a `meta` prop to a `Route`, that you can use to identify the `Route` for example, when using `useActiveRoute`.

```html
<Route
  meta="{{ name: 'blog-post' }}"
  path="blog/:id"
  component="{BlogPost}"
/>

<!-- SomeComponent.svelte -->
<script>
  import { useActiveRoute } from "svelte-navigator";

  const activeRoute = useActiveRoute();

  $: if ($activeRoute && $activeRoute.meta.name === "blog-post") {
    const { id } = $activeRoute.params;
    // Do something with the id...
  }
</script>
```

###### Properties

|  Property   | Required | Default Value | Description                                                                                                                                                              |
| :---------: | :------: | :------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|   `path`    |          |      `''`     | The path for when this component should be rendered. If no `path` is given the `Route` will act as the default that matches if no other `Route` in the `Router` matches. |
| `component` |          |    `null`    | The component constructor that will be used for rendering when the `Route` matches. If `component` is not set, the children of `Route` will be rendered instead.         |
| `meta` |          |    `{}`    | An arbitrary object you can pass the `Route`, to later access it (for example using `useActiveRoute`).         |

### Hooks

Svelte Navigator exposes a few React-esque hooks to access parts of the `Router`s context. These hooks must always be called during component initialization, because thats when Sveltes `getContext` must be called.

All navigator hooks return either a readable store you can subscibe to, or a function, that internally interacts with the Routers context.

#### `useNavigate`

A hook, that returns a context-aware version of `navigate`. It will automatically resolve the given link relative to the current Route.

```html
<!-- App.svelte -->
<script>
  import { Router, Route } from "svelte-navigator";
  import RouteComponent from "./RouteComponent.svelte";
</script>

<Router>
  <Route path="routePath">
    <RouteComponent />
  </Route>
  <!-- ... -->
</Router>

<!-- RouteComponent.svelte --> 
<script>
  import { useNavigate } from "svelte-navigator";

  const navigate = useNavigate();
</script>

<button on:click="{() => navigate('relativePath')}">
  go to /routePath/relativePath
</button>
<button on:click="{() => navigate('/absolutePath')}">
  go to /absolutePath
</button>
```

It will also resolve a link against the `basepath` of the Router

```html
<!-- App.svelte -->
<Router basepath="/base">
  <Route path="routePath">
    <RouteComponent />
  </Route>
  <!-- ... -->
</Router>

<!-- RouteComponent.svelte --> 
<script>
  import { useNavigate } from "svelte-navigator";

  const navigate = useNavigate();
</script>

<button on:click="{() => navigate('relativePath')}">
  go to /base/routePath/relativePath
</button>
<button on:click="{() => navigate('/absolutePath')}">
  go to /base/absolutePath
</button>
```

The returned `navigate` function is identical to the `navigate` prop, that is passed to Route `component`s. `useNavigate`s advantage is, that you can use it easily in deeply nested components.

```html
<!-- App.svelte -->
<Router>
  <Route path="routeA" component={RouteA} />
  <Route path="routeB" let:navigate>
    <RouteB {navigate} />
  </Route>
  <Route path="routeC">
    <RouteC />
  </Route>
  <!-- ... -->
</Router>

<!-- All three components can use the navigate function in the same way --> 
<!-- RouteA.svelte --> 
<script>
  export let navigate;
</script>

<!-- RouteB.svelte --> 
<script>
  export let navigate;
</script>

<!-- RouteC.svelte --> 
<script>
  import { useNavigate } from "svelte-navigator";
  const navigate = useNavigate();
</script>
```

The returned `navigate` function accepts the same parameters as the global [`navigate`](#navigate) function.

###### Parameters

|  Parameter   | Type | Default Value | Description                                                                                                                                                              |
| :---------: | :------: | :------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|   `to`    | `string` \| `number` |           | The path you want to navigate to. If `to` is a number, it is used to navigate in through the existing history stack, to the entry with the index `currentStackIndex + to` (`navigate(-1)` is equivalent to hitting the back button in your browser) |
| `options` |    `object`    |        | The navigation options      |
| `options.state` |    `object`    |    `{}`    | An arbitrary object, that will be pushed to the history state stack |
| `options.replace` |    `boolean`    |    `false`    | If true, the current entry in the history stack will be replaced with the next navigation, instead of pushing the next navigation onto the stack |

#### `useLocation`

Access the current location via a readable store and react to changes in location.

```html
<!-- RouteComponent.svelte --> 
<script>
  import { useLocation } from "svelte-navigator";

  const location = useLocation();

  $: console.log($location);
  /*
    {
      pathname: "/blog",
      search: "?id=123",
      hash: "#comments",
      state: {}
    }
  */
</script>
```

#### `useActiveRoute`

Access the Route currently matched by the parent Router from anywhere inside the Routers context. You can for example access Route params from outside the rendered Route or from a deeply nested component without prop-drilling.

```html
<script>
  import { useActiveRoute } from "svelte-navigator";

  const activeRoute = useActiveRoute();

  $: console.log($activeRoute);
  /*
    {
      route: {
        path: "blog/:id/",
        fullPath: "[basepath/]blog/:id/",
        id: 1,
        name: "route-name",
        default: false
      },
      params: {
        id: "123"
      },
      uri: "/blog/123"
    }
  */
</script>
```

#### `useLinkResolve`

Resolve a given link relative to the current `Route` and the `Router` `basepath`. It is used under the hood in `Link` and `useNavigate`.
You can use it to manually resolve links, when using the `link` or `links` actions. (See [`link`](#link-1))

```html
<script>
  import { link, useLinkResolve } from "svelte-navigator";

  const resolve = useLinkResolve();
  // `resolvedLink` will be resolved relative to its parent Route
  // and the Router `basepath`
  const resolvedLink = resolve("relativePath");
</script>

<a href={resolvedLink} use:link>Relative link</a>
```

#### `useMatch`

Use Svelte Navigators matching without needing to use a `Route`.
Returns a readable store with the potential match, that changes, when the location changes.

```html
<script>
  import { useMatch } from "svelte-navigator";

  const relativeMatch = useMatch("relative/path/:to/*somewhere");
  const absoluteMatch = useMatch("/absolute/path/:to/*somewhere");

  $: console.log($relativeMatch.params.to);
  $: console.log($absoluteMatch.params.somewhere);
</script>
```

#### `useBase`

Access the parent `Router`s base via a readable store.

```html
<!-- Inside top-level Router -->
<script>
  import { useBase } from "svelte-navigator";

  const base = useBase();

  $: console.log($base);
  /*
    {
      path: "/base",
      uri: "/base"
    }
  */
</script>

<!-- Inside nested Router -->
<script>
  import { useBase } from "svelte-navigator";

  const base = useBase();

  $: console.log($base);
  /*
    {
      path: "base/blog/",
      uri: "/base/blog"
    }
  */
</script>
```

### Programmatic Navigation

Svelte Navigator exports a global `navigate` function, you can use to programmatically navigate around your application.

It will however not be able to perform relative navigation. Use the `useNavigate` hook instead.

If your using a custom history (for example with `createMemorySource`), the created history will have its own `navigate` function. Calling the globally exported function, will not work as intended.

If you're serving your app from a subdirectory or if you're using a custom history, it is not advised to use `navigate`. Use `useNavigate` instead.

#### `navigate`

A function that allows you to imperatively navigate around the application for those use cases where a `Link` component is not suitable, e.g. after submitting a form.

The first argument is a string denoting where to navigate to, and the second argument is an object with a `replace` and `state` property equivalent to those in the `Link` component.

Note that `navigate` does not have access to the Routers context, so it cannot automatically resolve relative links. You might prefer `useNavigate` instead.

```html
<script>
  import { navigate } from "svelte-navigator";

  function onSubmit() {
    login().then(() => {
      navigate("/success", { replace: true });
    });
  }
</script>
```

If the first parameter to `navigate` is a number, it is used to navigate the history stack (for example for a browser like "go back/go forward" functionality).

```html
<script>
  import { navigate } from "svelte-navigator";
</script>

<button on:click="{() => navigate(-1)}">Back</button>
<button on:click="{() => navigate(1)}">Forward</button>
```

###### Parameters

|  Parameter   | Type | Default Value | Description                                                                                                                                                              |
| :---------: | :------: | :------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|   `to`    | `string` \| `number` |           | The path you want to navigate to. If `to` is a number, it is used to navigate in through the existing history stack, to the entry with the index `currentStackIndex + to` (`navigate(-1)` is equivalent to hitting the back button in your browser) |
| `options` |    `object`    |        | The navigation options      |
| `options.state` |    `object`    |    `{}`    | An arbitrary object, that will be pushed to the history state stack |
| `options.replace` |    `boolean`    |    `false`    | If true, the current entry in the history stack will be replaced with the next navigation, instead of pushing the next navigation onto the stack |

### Actions

You can use the `link` and `links` actions, to use standard `<a href=".." />` elements for navigation.

#### `link`

An action used on anchor tags to navigate around the application. You can add an attribute `replace` to replace the current entry in the history stack instead of adding a new one.

```html
<!-- App.svelte -->
<script>
  import { link, Route, Router } from "svelte-navigator";
  import RouteComponent from "./RouteComponent.svelte";
</script>

<Router>
  <a href="/" use:link>Home</a>
  <a href="/replace" use:link replace>Replace this URL</a>
  <!-- ... -->
</Router>
```

You should note that an action has no access to sveltes context, so links will not automatically be resolved on navigation. This will be a problem when you want to take advantage of Svelte Navigators relative navigation or when your app is served from a subdirectory. You can use the `useLinkResolve` hook to resolve the link manually.

```html
<script>
  import { link, useLinkResolve } from "svelte-navigator";

  const resolve = useLinkResolve();
  // `resolvedLink` will be "/route1/relativePath"
  const resolvedLink = resolve("relativePath");
</script>

<a href={resolvedLink} use:link>Relative link</a>
```

`link` uses the global `navigate` function by default, so if you're not using the default history mode (for example, memory mode or a [custom history][example-custom-hash-history]), navigating with it will not work as intended. To fix this, you could either use a `Link` component, or you can pass a custom `navigate` function to the action.

```html
<!-- App.svelte -->
<script>
  import {
    link,
    Route,
    Router,
    createHistory,
    createMemorySource,
  } from "svelte-navigator";

  const memoryHistory = createHistory(createMemorySource());
  const { navigate } = memoryHistory;
</script>

<Router history={memoryHistory}>
  <a href="/" use:link={navigate}>Home</a>
  <!-- ... -->
</Router>
```

Because the issues with link resolution and the dependency on the global navigation function, it is generally advised, not to use the `link` and `links` actions if you're not using a standard app, with all the default configuration.

#### `links`

An action used on a root element to make all relative anchor elements navigate around the application. You can add an attribute `replace` on any anchor to replace the current entry in the history stack instead of adding a new one. You can add an attribute `noroute` for this action to skip over the anchor and allow it to use the native browser action.

```html
<!-- App.svelte -->
<script>
  import { links, Router } from "svelte-navigator";
</script>

<div use:links>
  <Router>
    <a href="/">Home</a>
    <a href="/replace" replace>Replace this URL</a>
    <a href="/native" noroute>Use the native action</a>
    <!-- ... -->
  </Router>
</div>
```

As with the `link` action, the `href` attribute of the used `<a />` elements will not be resolved automatically.

If you're using a custom history, you need to pass its `navigate` function to the `links` function, just like you have to do with `link`.

### Custom History

If you don't want to use the HTML5 History API for Navigation, you can use a custom history.

Svelte Navigator comes with a memory based history, you can use. It is practical for testing.

To create a custom history, pass a history source to the `createHistory` function.

You could use multiple Routers, that don't interfere with each other, by using a different history for each one.

```html
<script>
  import { Router, createHistory, createMemorySource } from 'svelte-navigator';

  const html5History = createHistory(window);
  const memoryHistory = createHistory(createMemorySource());
</script>

<Router history={html5History}>
  <!-- I will function like the standard Router -->
</Router>

<Router history={memoryHistory}>
  <!-- I store the history stack in memory -->
</Router>
```

For a more advanced example, checkout the [Custom Hash History example][example-custom-hash-history].

## SSR Caveat

In the browser we wait until all child `Route` components have registered with their ancestor `Router` component before we let the `Router` pick the best match. This approach is not possible on the server, because when all `Route` components have registered and it is time to pick a match the SSR has already completed, and a document with no matching Route will be returned.

We therefore resort to picking the first matching `Route` that is registered on the server, so it is of utmost importance that you `sort your Route components from the most specific to the least specific if you are using SSR`.

[npm-url]: https://npmjs.com/package/svelte-navigator
[example-folder-navlink]: https://github.com/mefechoel/svelte-navigator/tree/master/example/ssr/src/components/NavLink.svelte
