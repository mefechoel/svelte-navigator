## Custom Hash History

An example for creating a custom history.

The basic-client-side example but using a custom Hash based history.

We use the Hash-history from the
[`history`](https://www.npmjs.com/package/history) package. This is what's used
in [`react-router`](https://www.npmjs.com/package/react-router). You could
reimplement `svelte-navigator`s Memory and HTML5 history modes in much the same
way with the provided modules from `history` if you're curious.

Were creating a `HistorySource` object to use with `svelte-navigator`s
`createHistory` function. A `HistorySource` is an object that resembles a subset
of `window.history`. It looks like this:

```js
const source = {
  // The current location object.
  // A location must at least have a "pathname" property
  get location() {},
  // An event source, that potentially emits a "popstate" event.
  // "popstate" is the event a browser fires,
  // if you press the back or forward button next to your url bar
  addEventListener(name, handler) {},
  removeEventListener(name, handler) {},
  // An Object to interact with the history
  history: {
    // Access the current state.
    // The state is an arbitrary object
    get state() {},
    // Navigate to a new path and add a new state to the stack
    // The "title" parameter is part of the HTML5 History spec,
    // but only safari supports it. svelte-navigator ignores it
    pushState(state, title, uri) {},
    // Navigate to a path and replace the current state the stack
    replaceState(state, title, uri) {},
    // Go to an existing stack entry.
    // The "to" parameter is a number,
    // that should be added to the current stack index.
    // -> `go(-1)` goes back one step
    go(to) {},
  },
};
```

### Try it out

```bash
git clone https://github.com/mefechoel/svelte-navigator.git
cd svelte-navigator/example/custom-hash-history
yarn install # if you're using npm run 'npm install'
yarn start # 'npm start'
# open browser at 'http://localhost:6061'
```
