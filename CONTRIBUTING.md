## Pull Requests

Please don't send pull requests for new features, open an issue, so we can
discuss how we want to go forward.

If you're submitting a PR, make sure to add tests for your feature/fix.

## Running tests

This repo uses Jest and Cypress.

Jest:

```bash
# Run the tests in watch mode
yarn test:watch
# Or in release mode
yarn test:unit
```

Cypress:

```bash
# Start the test server
yarn cy:start
# Run the tests in watch mode
yarn cy:open
# Or in release mode
yarn test:integ
```

Make sure to run all tests before submitting a PR:

```bash
# Start the test server
yarn cy:start
# Run all tests
yarn test
```

## Developing new examples

- Copy the setup for one of the existing examples.
- Replace all imports from "svelte-navigator" with "../../../src", if you want
  to edit the Routers source for debugging purposes
- Create an example and add a README for it
- Add a link to it (and if possible a link to the example running in the Svelte
  REPL) to the main README
- Change all imports back to "svelte-navigator"

```bash
# From your example directory
yarn start
```
