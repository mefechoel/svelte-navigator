# Svelte Navigator

[![npm package](https://img.shields.io/npm/v/svelte-navigator.svg?style=flat-square)](https://npmjs.com/package/svelte-navigator)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/svelte-navigator?style=flat-square)](https://bundlephobia.com/result?p=svelte-navigator)
[![NPM](https://img.shields.io/npm/l/svelte-navigator?style=flat-square)](https://github.com/mefechoel/svelte-navigator/blob/main/LICENSE)
[![GitHub last commit](https://img.shields.io/github/last-commit/mefechoel/svelte-navigator?style=flat-square)](https://github.com/mefechoel/svelte-navigator/commits/main)
[![Code Style Prettier](https://img.shields.io/badge/code%20style-prettier-ff7fe1.svg?style=flat-square)](https://github.com/prettier/prettier#readme)
[![Build Status](https://img.shields.io/github/workflow/status/mefechoel/svelte-navigator/Test?style=flat-square)](https://github.com/mefechoel/svelte-navigator/actions?query=workflow%3ATest)

> Simple, accessible routing for Svelte.

Svelte Navigator is an accessible and relatively lightweight Single Page App
Router inspired by [react-router](https://github.com/ReactTraining/react-router)
and [@reach/router](https://github.com/reach/router).

This started as a fork of
[svelte-routing](https://github.com/EmilTholin/svelte-routing), with added
configuration options and access to parts of the Routers context through
React-esque hooks.

## Features

- Accessible routing: The `Router` manages focus in your app automatically and
  makes announcements to screen reader users
- Relative routing: Paths and links are relative to the parent `Route` and
  `Router`
- Nestable `Route`s for easy, flexible and reusable component composition
- Automatic route ranking: The `Router` chooses the best match automatically, so
  you don't need to worry about the order of your `Route`s
- Route parameters `user/:id` and (namable) wildcards `blog/*`,
  `blog/*wildcardName`
- React-esque hooks api for accessing parts of the Router context
- Nestable Routers for seamless merging of many smaller apps
- HTML5 history mode by default (Memory mode as fallback, or for testing)
- SSR (**S**erver **S**ide **R**endering) support
- TypeScript ready 🎉

## Table of Contents

- [Getting started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [SSR Caveat](#ssr-caveat)
- [FAQ](#faq)
- [Testing](#testing)
- [API](#api)
  - [Components](#components)
    - [`Router`](#router)
    - [`Link`](#link)
    - [`Route`](#route)
  - [Hooks](#hooks)
    - [`useNavigate`](#usenavigate)
    - [`useLocation`](#uselocation)
    - [`useResolve`](#useresolve)
    - [`useResolvable`](#useresolvable)
    - [`useMatch`](#usematch)
    - [`useParams`](#useparams)
    - [`useFocus`](#usefocus)
  - [Programmatic Navigation](#programmatic-navigation)
    - [`navigate`](#navigate)
  - [Actions](#actions)
    - [`link`](#link-1)
    - [`links`](#links)
  - [Custom History](#custom-history)

## Getting started

[example-folder-url]:
	https://github.com/mefechoel/svelte-navigator/tree/master/example
[example-basic-client-side]:
	https://github.com/mefechoel/svelte-navigator/tree/master/example/basic-client-side
[example-custom-hash-history]:
	https://github.com/mefechoel/svelte-navigator/tree/master/example/custom-hash-history
[example-private-routes]:
	https://github.com/mefechoel/svelte-navigator/tree/master/example/private-routes
[example-private-routes-async]:
	https://github.com/mefechoel/svelte-navigator/tree/master/example/private-routes-async
[example-lazy-loading]:
	https://github.com/mefechoel/svelte-navigator/tree/master/example/lazy-loading
[example-ssr]:
	https://github.com/mefechoel/svelte-navigator/tree/master/example/ssr
[example-url-bar]:
	https://github.com/mefechoel/svelte-navigator/tree/master/example/url-bar
[example-transitions]:
	https://github.com/mefechoel/svelte-navigator/tree/master/example/transitions
[repl-basic-client-side]:
	https://svelte.dev/repl/451fd183e0d3403cb7800101f7d799fb
[repl-custom-hash-history]:
	https://svelte.dev/repl/195011a49a714e22b1a335037e124458
[repl-private-routes]: https://svelte.dev/repl/c81d8f3dff584065a82b2d3ea7cd4aee
[repl-private-routes-async]:
	https://svelte.dev/repl/5fe05802b7ad468188cb41f5df5bd5d5
[repl-lazy-loading]: https://svelte.dev/repl/09abb8c287f745169f66f62d51f766d5
[repl-url-bar]: https://svelte.dev/repl/dc82bb89447647edb0d7ed8cbe7999ae
[repl-transitions]: https://svelte.dev/repl/321f1f8a46f1437eb171ece35681c66a

Look at the [example folder][example-folder-url] for a few example project
setups, or checkout the examples in the Svelte REPL:

- Simple basic usage in a client side rendered app
  ([examples][example-basic-client-side], [REPL][repl-basic-client-side])
- Private Routes for authenticated users only
  ([examples][example-private-routes], [REPL][repl-private-routes], [async
  example][example-private-routes-async])
- Private Routes for authenticated users only (async auth check)
  ([examples][example-private-routes-async], [REPL][repl-private-routes-async])
- Using Routes to lazy load views ([examples][example-lazy-loading],
  [REPL][repl-lazy-loading])
- Reacting to changes in location using `useLocation`
  ([examples][example-url-bar], [REPL][repl-url-bar])
- SSR ([examples][example-ssr])
- Using hash based navigation with a custom history
  ([examples][example-custom-hash-history], [REPL][repl-custom-hash-history])
- Smoothly transitioning between route views using svelte transitions
  ([examples][example-transitions], [REPL][repl-transitions])

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
	import Search from "./routes/Search.svelte";
</script>

<Router>
	<nav>
		<Link to="/">Home</Link>
		<Link to="about">About</Link>
		<Link to="blog">Blog</Link>
	</nav>
	<div>
		<Route path="/">
			<Home />
		</Route>
		<Route path="about" component={About} />
		<Route path="blog/*">
			<Route path="/">
				<Blog />
			</Route>
			<Route path=":id" component={BlogPost} />
		</Route>
		<Route path="search/:query" let:params>
			<Search query={params.query} />
		</Route>
	</div>
</Router>
```

Svelte Navigator uses the HTML5 History API by default. For it to work properly,
you need to setup your server correctly. If you're using sirv, as is common with
a lot of Svelte projects, you need to pass it the `--single` option.

You can read more about the History API here:

- [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/API/History)
- [Deep dive into client side routing](https://krasimirtsonev.com/blog/article/deep-dive-into-client-side-routing-navigo-pushstate-hash)

## SSR Caveat

In the browser we wait until all child `Route` components have registered with
their ancestor `Router` component before we let the `Router` pick the best
match. This approach is not possible on the server, because when all `Route`
components have registered and it is time to pick a match the SSR has already
completed, and a document with no matching Route will be returned.

We therefore resort to picking the first matching `Route` that is registered on
the server, so it is of utmost importance that you **sort your Route components
from the most specific to the least specific if you are using SSR**.

## FAQ

### I'm using Vite. Why am I getting errors with `svelte-navigator`?

Vite tries to optimize the dependencies of your app. Unfortunately, this process
can break `svelte-navigator`, because it creates two versions of a variable,
`svelte-navigator` uses internally. To fix this update your `vite.config.js` (or
`vite.config.ts`) file:

```js
import { defineConfig } from "vite";
import svelte from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
	// ... your config ...
	plugins: [svelte() /* ... your plugins ... */],
	// Add this line:
	optimizeDeps: { exclude: ["svelte-navigator"] },
});
```

### I'm coming from `svelte-routing`. How can I switch to `svelte-navigator`?

`svelte-navigator` started as a fork of
[`svelte-routing`](https://github.com/EmilTholin/svelte-routing). Its API is
largely identical. Svelte Navigator mainly adds functionality through hooks.
Things that work in Svelte Routing should just work in Svelte Navigator as well.
Switching libraries is as easy as updating your imports:

```js
// Change your imports from
import { Router, Route /* , ... */ } from "svelte-routing";
// to
import { Router, Route /* , ... */ } from "svelte-navigator";
```

Enjoy added functionality, like access to the current location or params through
hooks, scoped paths in `navigate` with `useNavigate`, nested `Route`s, improved
accessibility and more.

### Why am I getting a warning about unused props for my route components?

To be precise, this warning:
`<Svelte component> was created with unknown prop 'location' & 'navigate'`.

This happens, because Svelte Navigator injects the current `location` and a
scoped `navigate` function to components rendered via the `Route`'s `component`
prop. To avoid the warning, you can instead render your components as `Route`
children:

```html
<!-- No unknown props will be injected -->
<Route path="my/path">
	<MyComponent />
</Route>

<!-- `location` and `navigate` props will be injected -->
<Route path="my/path" component="{MyComponent}" />
```

Read more in the [`Route` section of the API docs](#route).

### Why don't CSS classes work with `Link`?

```html
<style>
	/*
		Svelte will mark this class as unused and will remove it from
		the CSS output.
	*/
	.my-link { /* ... */ }
</style>

<Link class="my-link" to="my-path">...</Link>
```

Having a class attribute on Svelte components does not work with Svelte's CSS
scoping. Svelte does not treat class props to components as special props and
does not recognize them as classnames either. Theoretically `Link` could use the
`class` prop for something entirely different than styling, so Svelte can't make
any assumptions about it. As far as Svelte is concerned the `class="my-link"`
attribute and the `.my-link` are totally unrelated.

To work around this, you can often make use of the scoping of a wrapping or an
inner html element:

```html
<style>
	/*
		`.wrapper` is a standard html element, so Svelte will recognize its
		`class` attribute and scope any styles accordingly.
		Since part of the selector is scoped you don't need to worry about the
		global part leaking styles.
	*/
	.wrapper :global(.my-link) { /* ... */ }

	/*
		Again, scoping works just fine with `.link-content`, so it can be styled
		as expected. This way you don't have direct access to the `<a />` tag of
		the `Link` however.
	*/
	.link-content { /* ... */ }
</style>

<div class="wrapper">
	<Link class="my-link" to="my-path">...</Link>
</div>

<Link to="my-path">
	<span class="link-content">...</span>
</Link>
```

If that does not work for you, you can use the `use:link` action instead (which
has its limitations though, see [`link` section in the API docs](#link-1)).

```html
<script>
	import { link } from "svelte-navigator";
</script>

<style>
	/* This works as expected */
	.my-link {
		/* ... */
	}
</style>

<a class="my-link" href="my-path" use:link>...</a>
```

### What are the weird rectangles around the headings in my app?

<img
	alt="Focus outline around heading"
	src="./assets/focus-ring.png"
	width="300"
/>

These outlines appear, because Svelte Navigator focuses a heading inside the
`Route` that was rendered after a navigation. This helps people relying on
assistive technology, such as screen reader users, orientate on your website. If
the router didn't take focus, and you were to click a link, it would remain
focused after the navigation. Screenreader users would just not know that
something changed on the page. (This is a
[common problem with spa routers](https://medium.com/@robdel12/single-page-apps-routers-are-broken-255daa310cf)).
The idea of focusing a heading is, that it gives the user a starting point from
where they can tab to the changed content. Since it is just the starting point,
you can disable the focus ring for just the headers, which aren't focusable by
default anyway. Or you could style them to better suit your design (see this
[article about styling focus indicators](https://css-tricks.com/having-a-little-fun-with-custom-focus-styles/)).
But please, don't disable focus rings alltogether!

## Testing

When testing your app's components it is sometimes necessary to have them
rendered inside an instance of `Router` or `Route`. A component could for
example use the `useNavigate` hook to redirect after some user interaction. This
will however fail if the component is not somewhere inside a `Router`. Similarly
using the `useFocus` hook will only work when the component is somewhere inside
a `Route`.

If you're testing your app with
[`@testing-library/svelte`](https://github.com/testing-library/svelte-testing-library)
a custom `render` function and a `WrapRouter` component can do the trick:

```js
// renderWithRouter.js
import { render } from "@testing-library/svelte";
import WrapRouter from "./WrapRouter.svelte";

/**
 * Test-render a component, that relies on some of svelte-navigator's
 * features, inside a Router.
 *
 * @param component The component you want to wrap in a Router
 * @param componentProps The props you want to pass to it
 * @param routerOptions Futher configuration (`onNavigate`,
 * `withRoute`, `initialPathname`)
 * @param options Options for testing library's `render` function
 */
const renderWithRouter = (component, componentProps, routerOptions, options) =>
	render(WrapRouter, { component, componentProps, ...routerOptions }, options);

export default renderWithRouter;
```

```html
<!-- WrapRouter.svelte -->
<script>
	import { onDestroy } from "svelte";
	import {
		Router,
		Route,
		createMemorySource,
		createHistory,
	} from "svelte-navigator";

	/** The component you want to wrap in a Router */
	export let component;
	/** The props you want to pass to it */
	export let componentProps;
	/**
	 * A callback you can use to check if a navigation has occurred.
	 * It will be called with the new location and the action that lead
	 * to the navigation.
	 */
	export let onNavigate = () => {};
	/**
	 * If true, the component will be wrapped in a Route component as well.
	 * Some features of svelte-navigator can only be used inside a Route,
	 * for example `useParams`.
	 */
	export let withRoute = false;
	/** Supply an initial location to the Router */
	export let initialPathname = "/";

	const history = createHistory(createMemorySource(initialPathname));

	const unlisten = history.listen(onNavigate);

	onDestroy(unlisten);
</script>

<Router {history}>
	{#if withRoute}
	<Route path="*">
		<svelte:component this="{component}" {...componentProps} />
	</Route>
	{:else}
	<svelte:component this="{component}" {...componentProps} />
	{/if}
</Router>
```

Then import it in your test script:

```js
import MyComponent from "./MyComponent.svelte";
import renderWithRouter from "../test/renderWithRouter";

it("works", () => {
	const { getByTestId } = renderWithRouter(MyComponent);
	expect(getByTestId("my-input")).toHaveValue("my-value");
});
```

## API

- [Components](#components)
  - [`Router`](#router)
  - [`Link`](#link)
  - [`Route`](#route)
- [Hooks](#hooks)
  - [`useNavigate`](#usenavigate)
  - [`useLocation`](#uselocation)
  - [`useResolve`](#useresolve)
  - [`useResolvable`](#useresolvable)
  - [`useMatch`](#usematch)
  - [`useParams`](#useparams)
  - [`useFocus`](#usefocus)
- [Programmatic Navigation](#programmatic-navigation)
  - [`navigate`](#navigate)
- [Actions](#actions)
  - [`link`](#link-1)
  - [`links`](#links)
- [Custom History](#custom-history)

### Components

The main elements to configure and use routing in your Svelte app.

#### `Router`

The `Router` component supplies the `Link` and `Route` descendant components
with routing information through context, so you need at least one `Router` at
the top of your application. It assigns a score to all its `Route` descendants
and picks the best match to render.

```html
<Router>
	<Link to="profile">Go to /profile</Link>
	<Link to="blog">Go to /blog</Link>
	<Route path="blog" component={Blog} />
	<Route path="profile" component={Profile} />
</Router>
```

The `Router` will automatically manage focus in your app. When you change
`Route`s, it will focus the first heading in the matched `Route`.

If you have multiple `Router`s, for example one for a navigation bar and one for
the main content, make sure to pass `primary={false}` to all `Router`s, you
don't want to manage focus (in this case the nav `Router`).

```html
<Router primary={false}>
	<nav>
		<Link to="profile">Go to /profile</Link>
		<Link to="blog">Go to /blog</Link>
	</nav>
</Router>
<!-- ... -->
<Router>
	<main>
		<Route path="blog" component={Blog} />
		<Route path="profile" component={Profile} />
	</main>
</Router>
```

If you want to focus a different element, like a skip-navigtion-link or an info
text, you can use the `useFocus` hook, to specify a custom focus element.

Svelte navigator also announces navigations to a screen reader. You can
customize its message (i.e. for localization) via the `a11y.createAnnouncement`
prop.

If you're interested in accessibility concerns in SPA routers you can check out
[this article](https://www.gatsbyjs.org/blog/2019-07-11-user-testing-accessible-client-routing/),
which provided much of the information, regarding focus management, used for
implementing Svelte Navigators focus management.

```html
<!-- App.svelte -->
<script>
	import { Router, Route, Link } from "svelte-navigator";

	// Provide a custom message when navigating using
	// a routes `meta` information
	function createAnnouncement(route, location) {
		const viewName = route.meta.name;
		const { pathname } = location;
		return `Navigated to the ${viewName} view at ${pathname}`;
	}
</script>

<Router a11y="{{ createAnnouncement }}">
	<Link to="profile">Go to /profile</Link>
	<Route
		path="profile"
		component="{Profile}"
		meta="{{ name: 'user profile' }}"
	/>
	<Route path="blog/*" meta="{{ name: 'blog' }}">
		<Blog />
	</Route>
</Router>

<!-- Blog.svelte -->
<script>
	import { Route, Link, useFocus } from "svelte-navigator";

	// Provide a custom element to focus when this Route is navigated to
	const registerFocus = useFocus();

	function skipNavigation() { /* ... */ }
</script>

<button use:registerFocus on:click={skipNavigation}>
	Skip navigation
</button>
<Link to="svelte">Go to /blog/svelte</Link>
<Link to="navigator">Go to /blog/navigator</Link>
<Route path="svelte">Yeah, Svelte!</Route>
<Route path="navigator">Yeah, Routing!</Route>
```

`Router` components can also be nested to allow for seamless merging of many
smaller apps. Just make sure not to forget the wildcard (`*`) in the parent
`Route`s path.

It's probably easier to nest `Route`s though.

```html
<!-- App.svelte -->
<Router>
	<Link to="profile">Go to /profile</Link>
	<Route path="profile" component="{Profile}" />
	<Route path="blog/*">
		<Blog />
	</Route>
</Router>

<!-- Blog.svelte -->
<Router>
	<Link to="svelte">Go to /blog/svelte</Link>
	<Link to="navigator">Go to /blog/navigator</Link>
	<!-- Break out of the scope of the current Router -->
	<Link to="../profile">Go to /profile</Link>
	<Route path="svelte">Yeah, Svelte!</Route>
	<Route path="navigator">Yeah, Routing!</Route>
	<Route path=":id" let:params>
		<BlogPost id={params.id} />
	</Route>
</Router>
```

When you are serving your app from a subdirectory on your server, you can add a
`basepath` prop to the router. It will be prepended to all routes and to all
resolved navigations (i.e. using `Link`, `useNavigate` or `useResolve`). A
properly formatted `basepath` should have a leading, but no trailing slash.

```html
<Router basepath="/base">
	<Link to="profile">Go to /base/profile</Link>
	<Link to="blog">Go to /base/blog</Link>
	<Route path="blog" component={Blog} />
	<Route path="profile" component={Profile} />
</Router>
```

By default `Router`s use the HTML5 history API for navigation. You can provide a
different history through the `history` prop. Svelte Navigator ships with a
memory based history, which is used, when the application does not seem to run
in a browser (i.e. in a test environment) or in an embedded page, like the
Svelte REPL. You can explicitly set the memory history or you can provide your
own implementation (for example a [Hash based
history][example-custom-hash-history]).

```html
<script>
	import { createHistory, createMemorySource } from "svelte-navigator";

	const memoryHistory = createHistory(createMemorySource());
</script>

<Router history="{memoryHistory}">
	<!-- ... -->
</Router>
```

If you have a strict Content Security Policy, inline styles might be forbidden.
Svelte-Navigator makes some use of inline styles though for internal marker
elements and for screen reader announcements. If that is the case, you can
disable inline styles, though you need to import those styles manually. If you
have a bundler set up, that will be as easy as adding one import statement to
your applications entry point. Otherwise, you might need to copy the contents of
[`svelte-navigator.css`](https://github.com/mefechoel/svelte-navigator/blob/main/svelte-navigator.css)
into your applications css.

```js
// In your applications entrypoint, such as `index.js` or `main.js`
import "svelte-navigator/svelte-navigator.css";
```

###### Properties

|         Property          |         Type         |             Default Value              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| :-----------------------: | :------------------: | :------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|        `basepath`         |       `string`       |                 `'/'`                  | The `basepath` property will be added to all `path` properties of `Route` descendants and to every navigation, that has access to the Routers context (from a `Link` with a `to` property or via `useNavigate`). This property can be ignored in most cases, but if you host your application on e.g. `https://example.com/my-site`, the `basepath` should be set to `/my-site`. Note that `navigate` and the `link` and `links` actions don't have access to the context. You may resolve the link manually using the `useResolve` hook. |
|           `url`           |       `string`       |                  `''`                  | The `url` property is used in SSR to force the current URL of the application and will be used by all `Link` and `Route` descendants. A falsy value will be ignored by the `Router`, so it's enough to declare `export let url = '';` for your topmost component and only give it a value in SSR.                                                                                                                                                                                                                                         |
|         `history`         |   `HistorySource`    |            \<HTML5 History>            | The `history` property can be used to use a navigation method other than the browsers History API (See [custom Hash based history][example-custom-hash-history]).                                                                                                                                                                                                                                                                                                                                                                         |
|         `primary`         |      `boolean`       |                 `true`                 | If set to false, the `Router` will not manage focus for its children. Analougus to the `Route`s `primary` prop.                                                                                                                                                                                                                                                                                                                                                                                                                           |
|          `a11y`           |       `object`       |                                        | Configuration object for Svelte Navigators accessibility features                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `a11y.createAnnouncement` | `CreateAnnouncement` | `route => 'Navigated to ${route.uri}'` | Function to create an announcement message, that is read by screen readers on navigation. It takes the matched `Route` and the current `location` as arguments and returns a `string` or a `Promise`, that resolves to a `string`.                                                                                                                                                                                                                                                                                                        |
|   `a11y.announcements`    |      `boolean`       |                 `true`                 | Set it to false, to disable screen reader announcements                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
|   `disableInlineStyles`   |      `boolean`       |                `false`                 | Disable the inline styles, that are used internally by svelte-navigator. This might be necessary when your Content Security Policy disallows inline styles. To still remain functional, be sure to include the [`svelte-navigator.css`](https://github.com/mefechoel/svelte-navigator/blob/main/svelte-navigator.css) in your application.                                                                                                                                                                                                |

Where:

```ts
interface Route {
	uri: string;
	path: string;
	meta: object;
	params: object;
}

interface Location {
	pathname: string;
	search: string;
	hash: string;
	state: object;
}

type CreateAnnouncement = (
	route: Route,
	location: Location,
) => string | Promise<string>;

interface HistorySource {
	readonly location: Location;
	addEventListener(event: "popstate", handler: () => void): void;
	removeEventListener(event: "popstate", handler: () => void): void;
	history: {
		readonly state: object;
		pushState(state: object, title: string, uri: string): void;
		replaceState(state: object, title: string, uri: string): void;
		go(to: number): void;
	};
}
```

#### `Link`

A component used to navigate around the application. It will automatically
resolve the `to` path relative to the current `Route` and to the `Router`s
`basepath`.

```html
<Router>
	<Route path="blog/*">
		<Link to="svelte">Go to /blog/svelte</Link>
		<Link to="../profile">Go to /profile</Link>
	</Route>
</Router>
```

```html
<Router basepath="/base">
	<Route path="blog/*">
		<Link to="svelte">Go to /base/blog/svelte</Link>
		<Link to="../profile">Go to /base/profile</Link>
	</Route>
</Router>
```

###### Properties

|  Property  |    Type    | Default Value | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| :--------: | :--------: | :-----------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `to`    | `string` ️ |               | URL the component should link to. It will be resolved relative to the current Route.                                                                                                                                                                                                                                                                                                                                                                                   |
| `replace`  | `boolean`  |    `false`    | When `true`, clicking the `Link` will replace the current entry in the history stack instead of adding a new one.                                                                                                                                                                                                                                                                                                                                                      |
|  `state`   |  `object`  |     `{}`      | An object that will be pushed to the history stack when the `Link` is clicked. A state is arbitrary data, that you don't want to communicate through the url, much like the body of a HTTP POST request.                                                                                                                                                                                                                                                               |
| `getProps` | `GetProps` |    `null`     | A function that returns an object that will be spread on the underlying anchor element's attributes. The first argument given to the function is an object with the properties `location`, `href`, `isPartiallyCurrent`, `isCurrent`. Look at the [`NavLink` component in the example project setup](https://github.com/mefechoel/svelte-navigator/tree/master/example/ssr/src/components/NavLink.svelte) to see how you can build your own link components with this. |

Where:

```ts
interface Location {
	pathname: string;
	search: string;
	hash: string;
	state: object;
}

type GetProps = ({
	location: Location;
	href: string;
	isPartiallyCurrent: boolean;
	isCurrent: boolean;
}) => object;
```

All other props will be passed to the underlying `<a />` element. If the passed
props and the props returned from `getProps` contain clashing keys, the values
returned from `getProps` will be used.

#### `Route`

A component that will render its `component` property or children when its
ancestor `Router` component decides it is the best match.

All properties other than `path`, `component`, `meta` and `primary` given to the
`Route` will be passed to the rendered `component`.

A `Route` path can match parameters with `"path/:parameterName"` and wildcards
with `"path/*"` or `"path/*wildcardName"`. All parameters and wildcard values
will be provided to the `component` as props. They can also be accessed inside a
`Route` slot via `let:params`.

The `Route` `component` will also receive the current `location`, as well as the
`navigate` function, that is scoped to the current `Route` as props. They can be
accessed inside the `Route` slot, via `let:location` and `let:navigate`.

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
  Navigate programatically using relative links
  (See also `navigate` and `useNavigate`)
-->
<Route path="search" let:navigate>
	<BlogPost {navigate} />
</Route>

<!--
  Routes without a path are default routes.
  They will match if no other Route could be matched
-->
<Route component="{Home}"></Route>
```

You can nest `Route`s, to easily define a routing structure for your app. Just
remember to add a splat (`*`) to the end of the parent `Route`s `path`.

```html
<!-- Don't forget the '*' -->
<Route path="blog/*">
	<!-- Render specific post with id "123" at /blog/post/123 -->
	<Route path="post/:id" component="{BlogPost}" />
	<!-- Index Route for /blog -->
	<Route path="/" component="{Favourites}" />
</Route>
<Route component="{Home}"></Route>
```

You can also provide a `meta` prop to a `Route`, that you can use to identify
the `Route` for example, when providing a custom `a11y.createAnnouncement`
function the the parent `Router`.

```html
<script>
	import { Router, Route, Link } from "svelte-navigator";

	// Provide a custom message when navigating using
	// a routes `meta` information
	function createAnnouncement(route, location) {
		const viewName = route.meta.name;
		const { pathname } = location;
		return `Navigated to the ${viewName} view at ${pathname}`;
	}
</script>

<Router a11y="{{ createAnnouncement }}">
	<Link to="profile">Go to /profile</Link>
	<Route
		path="profile"
		component="{Profile}"
		meta="{{ name: 'user profile' }}"
	/>
	<Route path="blog/*" meta="{{ name: 'blog' }}">
		<Blog />
	</Route>
</Router>
```

###### Properties

|  Property   |       Type        | Default Value | Description                                                                                                                                                              |
| :---------: | :---------------: | :-----------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|   `path`    |     `string`      |     `''`      | The path for when this component should be rendered. If no `path` is given the `Route` will act as the default that matches if no other `Route` in the `Router` matches. |
| `component` | `SvelteComponent` |    `null`     | The component constructor that will be used for rendering when the `Route` matches. If `component` is not set, the children of `Route` will be rendered instead.         |
|   `meta`    |     `object`      |     `{}`      | An arbitrary object you can pass the `Route`, to later access it (for example in `a11y.createAnnouncement`).                                                             |
|  `primary`  |     `boolean`     |    `true`     | If set to false, the parent `Router` will not manage focus for this `Route` or any child `Route`s.                                                                       |

### Hooks

Svelte Navigator exposes a few React-esque hooks to access parts of the
`Router`s context. These hooks **must always be called during component
initialization**, because thats when Sveltes `getContext` must be called.

All navigator hooks return either a readable store you can subscibe to, or a
function, that internally interacts with the Routers context.

#### `useNavigate`

A hook, that returns a context-aware version of `navigate`. It will
automatically resolve the given link relative to the current Route.

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

The returned `navigate` function is identical to the `navigate` prop, that is
passed to a `Route`s `component`. `useNavigate`s advantage is, that you can use
it easily in deeply nested components.

```html
<!-- App.svelte -->
<Router>
	<Route path="routeA" component="{RouteA}" />
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

The returned `navigate` function accepts the same parameters as the global
[`navigate`](#navigate) function.

###### Parameters

|     Parameter     |        Type        | Default Value | Description                                                                                                                                                                                                                                           |
| :---------------: | :----------------: | :-----------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|       `to`        | `string \| number` |               | The path you want to navigate to. If `to` is a `number`, it is used to navigate in through the existing history stack, to the entry with the index `currentStackIndex + to` (`navigate(-1)` is equivalent to hitting the back button in your browser) |
|     `options`     |      `object`      |               | The navigation options                                                                                                                                                                                                                                |
|  `options.state`  |      `object`      |     `{}`      | An arbitrary object, that will be pushed to the history state stack                                                                                                                                                                                   |
| `options.replace` |     `boolean`      |    `false`    | If `true`, the current entry in the history stack will be replaced with the next navigation, instead of pushing the next navigation onto the stack                                                                                                    |

#### `useLocation`

Access the current location via a readable store and react to changes in
location.

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

#### `useResolve`

Resolve a given link relative to the current `Route` and the `Router`s
`basepath`. It is used under the hood in `Link` and `useNavigate`. You can use
it to manually resolve links, when using the `link` or `links` actions. (See
[`link`](#link-1))

```html
<script>
	import { link, useResolve } from "svelte-navigator";

	export let path;

	const resolve = useResolve();
	// `resolvedLink` will be resolved relative to its parent Route
	// and the Router `basepath`
	$: resolvedLink = resolve(path);
</script>

<a href="{resolvedLink}" use:link>Relative link</a>
```

Note, that you might need to re-resolve the link, to avoid stale links on
location changes. You can achive this by deriving a store from the `$location`
store, or by forcing Svelte to recompute the reactive `resolvedLink` variable,
by passing `$location` as a second argument to `resolve`:

```html
<script>
	import { link, useResolve, useLocation } from "svelte-navigator";

	export let path;

	const resolve = useResolve();
	const location = useLocation();
	// Force Svelte to re-run this assignement, when location changes
	$: resolvedLink = resolve(path, $location);
</script>

<a href="{resolvedLink}" use:link>Relative link</a>
```

#### `useResolvable`

Resolve a given link relative to the current `Route` and the `Router`s
`basepath`. It works very similar to `useResolve`, but returns a store of the
resolved path, that updates, when location changes. You will prabably want to
use `useResolvable`, when the path you want to resolve does not change, and
`useResolve`, when you're path is changing, for example, when you get it from a
prop.

You can use `useResolvable` to manually resolve links, when using the `link` or
`links` actions. (See [`link`](#link-1))

```html
<script>
	import { link, useResolvable } from "svelte-navigator";

	// `resolvedLink` will be resolved relative to its parent Route
	// and the Router `basepath`
	const resolvedLink = useResolvable("relativePath");
</script>

<a href="{$resolvedLink}" use:link>Relative link</a>
```

#### `useMatch`

Use Svelte Navigators matching without needing to use a `Route`. Returns a
readable store with the potential match, that changes, when the location
changes.

```html
<script>
	import { useMatch } from "svelte-navigator";

	const relativeMatch = useMatch("relative/path/:to/*somewhere");
	const absoluteMatch = useMatch("/absolute/path/:to/*somewhere");

	$: console.log($relativeMatch.params.to);
	$: console.log($absoluteMatch.params.somewhere);
</script>
```

#### `useParams`

Access the parent Routes matched params and wildcards via a readable store.

```html
<!--
	Somewhere inside <Route path="user/:id/*splat" />
	with a current url of "/myApp/user/123/pauls-profile"
-->
<script>
	import { useParams } from "svelte-navigator";

	const params = useParams();

	$: console.log($params); // -> { id: "123", splat: "pauls-profile" }
</script>

<h3>Welcome user {$params.id}! bleep bloop...</h3>
```

#### `useFocus`

Provide a custom element to focus, when the parent route is visited. It returns
the `registerFocus` action you can apply to an element via the `use` directive:

```html
<!-- Somewhere inside a Route -->
<script>
	import { useFocus } from "svelte-navigator";

	const registerFocus = useFocus();
</script>

<h1>Don't worry about me...</h1>
<p use:registerFocus>Here, look at me!</p>
```

You can also use `registerFocus` asynchronously:

```html
<!-- Somewhere inside a Route -->
<script>
	import { onMount } from "svelte";
	import { useFocus } from "svelte-navigator";

	const registerFocus = useFocus();

	const lazyImport = import("./MyComponent.svelte").then(
		module => module.default,
	);
</script>

{#await lazyImport then MyComponent}
<MyComponent {registerFocus} />
{/await}

<!-- MyComponent.svelte -->
<script>
	export let registerFocus;
</script>

<h1 use:registerFocus>Hi there!</h1>
```

You should however only use it asynchronously, if you **know**, that the focus
element will register soon. Otherwise, focus will remain at the clicked link,
and randomly change a few seconds later without explanation, which is a very bad
experience for screen reader users.

When you need to wait for data, before you can render a component, you should
consider providing a hidden heading, that informs a screen reader user about the
current loading process.

```html
<!-- Somewhere inside a Route -->
<script>
	import { onMount } from "svelte";
	import { useFocus } from "svelte-navigator";
	import BlogPost from "./BlogPost.svelte";

	const registerFocus = useFocus();

	const blogPostRequest = fetch("some/blog/post");
</script>

<style>
	.visuallyHidden {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
</style>

{#await blogPostRequest}
<h1 class="visuallyHidden" use:registerFocus>
	The blog post is being loaded...
</h1>
{:then data}
<BlogPost {data} />
{/await}
```

### Programmatic Navigation

Svelte Navigator exports a global `navigate` function, you can use to
programmatically navigate around your application.

It will however not be able to perform relative navigation. Use the
`useNavigate` hook instead.

If your using a custom history (for example with `createMemorySource`), the
created history will have its own `navigate` function. Calling the globally
exported function, will not work as intended.

If you're serving your app from a subdirectory or if you're using a custom
history, it is not advised to use `navigate`. Use `useNavigate` instead.

#### `navigate`

A function that allows you to imperatively navigate around the application for
those use cases where a `Link` component is not suitable, e.g. after submitting
a form.

The first argument is a string denoting where to navigate to, and the second
argument is an object with a `replace` and `state` property equivalent to those
in the `Link` component.

Note that `navigate` does not have access to the Routers context, so it cannot
automatically resolve relative links. You might prefer `useNavigate` instead.

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

If the first parameter to `navigate` is a number, it is used to navigate the
history stack (for example for a browser like "go back/go forward"
functionality).

```html
<script>
	import { navigate } from "svelte-navigator";
</script>

<button on:click="{() => navigate(-1)}">Back</button>
<button on:click="{() => navigate(1)}">Forward</button>
```

###### Parameters

|     Parameter     |        Type        | Default Value | Description                                                                                                                                                                                                                                         |
| :---------------: | :----------------: | :-----------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|       `to`        | `string \| number` |               | The path you want to navigate to. If `to` is a number, it is used to navigate in through the existing history stack, to the entry with the index `currentStackIndex + to` (`navigate(-1)` is equivalent to hitting the back button in your browser) |
|     `options`     |      `object`      |               | The navigation options                                                                                                                                                                                                                              |
|  `options.state`  |      `object`      |     `{}`      | An arbitrary object, that will be pushed to the history state stack                                                                                                                                                                                 |
| `options.replace` |     `boolean`      |    `false`    | If true, the current entry in the history stack will be replaced with the next navigation, instead of pushing the next navigation onto the stack                                                                                                    |

### Actions

You can use the `link` and `links` actions, to use standard `<a href="..." />`
elements for navigation.

#### `link`

An action used on anchor tags to navigate around the application. You can add an
attribute `replace` to replace the current entry in the history stack instead of
adding a new one.

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

You should note that an action has no access to sveltes context, so links will
not automatically be resolved on navigation. This will be a problem when you
want to take advantage of Svelte Navigators relative navigation or when your app
is served from a subdirectory. You can use the `useResolve` hook to resolve the
link manually.

```html
<script>
	import { link, useResolve } from "svelte-navigator";

	const resolve = useResolve();
	// `resolvedLink` will be "/route1/relativePath"
	const resolvedLink = resolve("relativePath");
</script>

<a href="{resolvedLink}" use:link>Relative link</a>
```

`link` uses the global `navigate` function by default, so if you're not using
the default history mode (for example, memory mode or a [custom
history][example-custom-hash-history]), navigating with it will not work as
intended. To fix this, you could either use a `Link` component, or you can pass
a custom `navigate` function to the action.

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

<Router history="{memoryHistory}">
	<a href="/" use:link="{navigate}">Home</a>
	<!-- ... -->
</Router>
```

Because of the issues with link resolution and the dependency on the global
navigation function, it is generally advised, not to use the `link` and `links`
actions if you're not using a standard app, with all the default configuration.

#### `links`

An action used on a root element to make all relative anchor elements navigate
around the application. You can add an attribute `replace` on any anchor to
replace the current entry in the history stack instead of adding a new one. You
can add an attribute `noroute` for this action to skip over the anchor and allow
it to use the native browser action.

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

As with the `link` action, the `href` attribute of the used `<a />` elements
will not be resolved automatically.

If you're using a custom history, you need to pass its `navigate` function to
the `links` function, just like you have to do with `link`.

### Custom History

If you don't want to use the HTML5 History API for Navigation, you can use a
custom history.

Svelte Navigator comes with a memory based history, you can use. It is practical
for testing.

To create a custom history, pass a history source to the `createHistory`
function.

You could use multiple Routers, that don't interfere with each other, by using a
different history for each one.

```html
<script>
	import { Router, createHistory, createMemorySource } from "svelte-navigator";

	const html5History = createHistory(window);
	const memoryHistory = createHistory(createMemorySource());
</script>

<Router history="{html5History}">
	<!-- I will function like the standard Router -->
</Router>

<Router history="{memoryHistory}">
	<!-- I store the history stack in memory -->
</Router>
```

For a more advanced example, checkout the [Custom Hash History
example][example-custom-hash-history].

## License

MIT
