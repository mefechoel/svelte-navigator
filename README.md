# Svelte Navigator

Svelte Navigator is declarative routing library for single page applications built with Svelte.

It is a fork of [svelte-routing](https://github.com/EmilTholin/svelte-routing).
I had a few issues with `link`s and `navigate`, when using a `basepath` in Router, and absolute `Link`s in a nested Router. 
Svelte Navigator tries to always resolve links relative to the Routers `basepath` and to the parent Route.

It also exposes a react-esque hooks api for accessing parts of the Router context. 

## Getting started

Look at the [example folder][example-folder-url] for an example project setup.

## Install

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

Basic Setup for a server-side rendered app:

```html
<!-- App.svelte -->
<script>
  import { Router, Link, Route } from "svelte-navigator";
  import Home from "./routes/Home.svelte";
  import About from "./routes/About.svelte";
  import Blog from "./routes/Blog.svelte";

  export let url = "";
</script>

<Router url={url}>
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

```javascript
// main.js
import App from "./App.svelte";

const app = new App({
  target: document.getElementById("app"),
  hydrate: true,
});
```

```javascript
// server.js
const { createServer } = require("http");
const app = require("./dist/App.js");

createServer((req, res) => {
  const { html } = app.render({ url: req.url });

  res.write(`
    <!DOCTYPE html>
    <div id="app">${html}</div>
    <script src="/dist/bundle.js"></script>
  `);

  res.end();
}).listen(3000);
```

## API

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

###### Properties

|  Property  | Required | Default Value | Description                                                                                                                                                                                                                                                                                                                               |
| :--------: | :------: | :-----------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `basepath` |          |     `'/'`     | The `basepath` property will be added to all `path` properties of `Route` descendants and to every navigation, that has access to the Routers context (from a `Link` with a `to` property or via `useNavigate`). This property can be ignored in most cases, but if you host your application on e.g. `https://example.com/my-site`, the `basepath` should be set to `/my-site`. Note that `navigate` and the `link` and `links` actions don't have access to the context. You may resolve the link manually using the `useLinkResolve` hook. |
|   `url`    |          |     `''`      | The `url` property is used in SSR to force the current URL of the application and will be used by all `Link` and `Route` descendants. A falsy value will be ignored by the `Router`, so it's enough to declare `export let url = '';` for your topmost component and only give it a value in SSR.                                         |

#### `Link`

A component used to navigate around the application. It will automatically resolve the `to` path relative to the current Route and to the Router `basepath`.

```html
<Route path="blog/*">
  <Link to="svelte">Go to /blog/svelte</Link>
  <Link to="/profile">Go to /profile</Link>
</Route>
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
|  `state`   |          |     `{}`      | An object that will be pushed to the history stack when the `Link` is clicked.                                                                                                                                                                                                                                                                                                            |
| `getProps` |          |    `null`    | A function that returns an object that will be spread on the underlying anchor element's attributes. The first argument given to the function is an object with the properties `location`, `href`, `isPartiallyCurrent`, `isCurrent`. Look at the [`NavLink` component in the example project setup][example-folder-navlink] to see how you can build your own link components with this. |

All other props will be passed to the underlying `<a />` element if no `getProps` function is provided.

#### `Route`

A component that will render its `component` property or children when its ancestor `Router` component decides it is the best match.

All properties other than `path` and `component` given to the `Route` will be passed to the rendered `component`.

Potential path parameters will be passed to the rendered `component` as properties. A wildcard `*` can be given a name with `*wildcardName` to pass the wildcard string as the `wildcardName` property instead of as the `*` property.

Potential path parameters are passed back to the parent using props, so they can be exposed to the slot template using `let:params`.

The current location is exposed to a slot via `let:location`

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

###### Properties

|  Property   | Required | Default Value | Description                                                                                                                                                              |
| :---------: | :------: | :------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|   `path`    |          | `''`          | The path for when this component should be rendered. If no `path` is given the `Route` will act as the default that matches if no other `Route` in the `Router` matches. |
| `component` |          | `null`        | The component constructor that will be used for rendering when the `Route` matches. If `component` is not set, the children of `Route` will be rendered instead.         |

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

#### `link`

An action used on anchor tags to navigate around the application. You can add an attribute `replace` to replace the current entry in the history stack instead of adding a new one.

You should note that an action has no access to sveltes context, so links will not automatically be resolved on navigation. This will be a problem when your app is served from a subdirectory. You can use the `useLinkResolve` hook to resolve the link manually.

```html
<!-- App.svelte -->
<script>
  import { link, Route } from "svelte-navigator";
  import RouteComponent from "./RouteComponent.svelte";
</script>

<Router>
  <a href="/" use:link>Home</a>
  <a href="/replace" use:link replace>Replace this URL</a>
  <Route path="route1">
    <RouteComponent />
  </Route>
  <!-- ... -->
</Router>

<!-- RouteComponent.svelte --> 
<script>
  import { link, useLinkResolve } from "svelte-navigator";

  const resolve = useLinkResolve();
  // `resolvedLink` will be "/route1/relativePath"
  const resolvedLink = resolve("relativePath");
</script>

<a href={resolvedLink} use:link>Relative link</a>
```

#### `links`

An action used on a root element to make all relative anchor elements navigate around the application. You can add an attribute `replace` on any anchor to replace the current entry in the history stack instead of adding a new one. You can add an attribute `noroute` for this action to skip over the anchor and allow it to use the native browser action.

As for the `link` action, the `href` attribute of the used `<a />` elements will not be resolved automativcally.

```html
<!-- App.svelte -->
<script>
  import { links } from "svelte-navigator";
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

#### `useNavigate`

A hook, that returns a context-aware version of `navigate`. It will automatically resolve the given link relative to the current Route.

```html
<!-- App.svelte -->
<script>
  import { link, Route } from "svelte-navigator";
  import RouteComponent from "./RouteComponent.svelte";
</script>

<Router>
  <Route path="route1">
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
  go to /route1/relativePath
</button>
<button on:click="{() => navigate('/absolutePath')}">
  go to /absolutePath
</button>
```

It will also resolve a link against the `basepath` of the Router

```html
<!-- App.svelte -->
<script>
  import { link, Route } from "svelte-navigator";
  import RouteComponent from "./RouteComponent.svelte";
</script>

<Router basepath="/base">
  <Route path="route1">
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
  go to /base/route1/relativePath
</button>
<button on:click="{() => navigate('/absolutePath')}">
  go to /base/absolutePath
</button>
```

#### `useLocation`

Access the current location via a readable store.

```html
<!-- RouteComponent.svelte --> 
<script>
  import { useLocation } from "svelte-navigator";

  const location = useLocation();

  $: console.log($location);
  /*
    {
      href: "http://localhost:5000/blog?id=123#comments",
      origin: "http://localhost:5000",
      protocol: "http:",
      host: "localhost:5000",
      hostname: "localhost",
      port: "5000",
      pathname: "/blog",
      search: "?id=123",
      hash: "#comments",
      state: {}
    }
  */
</script>
```

#### `useActiveRoute`

Access the Route currenty matched by the Router from anywhere inside the Router context. You can for example access Route params from outside the rendered Route or from a deeply nested component without prop-drilling.

```html
<script>
  import { useActiveRoute } from "svelte-navigator";

  const activeRoute = useActiveRoute();

  $: console.log($activeRoute);
  /*
    {
      route: {
        path: "blog/:id/",
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

#### `useBase`

Access the parent `Router`s base.

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

## SSR Caveat

In the browser we wait until all child `Route` components have registered with their ancestor `Router` component before we let the `Router` pick the best match. This approach is not possible on the server, because when all `Route` components have registered and it is time to pick a match the SSR has already completed, and a document with no matching Route will be returned.

We therefore resort to picking the first matching `Route` that is registered on the server, so it is of utmost importance that you `sort your Route components from the most specific to the least specific if you are using SSR`.

[npm-url]: https://npmjs.com/package/svelte-navigator
[example-folder-url]: https://github.com/mefechoel/svelte-navigator/tree/master/example
[example-folder-navlink]: https://github.com/mefechoel/svelte-navigator/tree/master/example/src/components/NavLink.svelte
