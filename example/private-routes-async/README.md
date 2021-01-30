## Private Routes - Asynchronous

Build a simple custom component to protect routes, that can only be viewed by a
logged in user.

In a `PrivateRoute` we use a `PrivateRouteGuard` component that redirects to a
login page if no user is set.

The `PrivateRouteGuard` in this example runs an asynchronous method to check authentication status. This could be something like [AWS Amplify's currentauthenticateduser](https://aws-amplify.github.io/amplify-js/api/classes/authclass.html#currentauthenticateduser), or another required async call. For the purposes of demonstration, this example uses a simple dummy async call that takes 1 second to respond.

The `PrivateRouteGuard` sets the current location pathname as a state in the redirect, 
so that we know from which private page we came. The `Login` component can then, 
upon successful login, redirect back to the private page.

### Try it out

```bash
git clone https://github.com/mefechoel/svelte-navigator.git
cd svelte-navigator/example/private-routes-async
npm install # if you're using yarn run 'yarn install'
npm start # 'yarn start'
# open browser at 'http://localhost:6062'
```

### Background

This example was created from the result of the conversation in [issue 29 on github](https://github.com/mefechoel/svelte-navigator/issues/29)