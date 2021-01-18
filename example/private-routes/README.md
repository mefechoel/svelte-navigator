## Private Routes

Build a simple custom component to protect routes, that can only be viewed by a
logged in user.

In a `PrivateRoute` we use a `PrivateRouteGuard` component that redirects to a
login page if no user is set. The `PrivateRouteGuard` sets the current location
pathname as a state in the redirect, so that we know from which private page we
came. The `Login` component can then, upon successful login, redirect back to
the private page.

### Try it out

```bash
git clone https://github.com/mefechoel/svelte-navigator.git
cd svelte-navigator/example/protected-routes
npm install # if you're using yarn run 'yarn install'
npm start # 'yarn start'
# open browser at 'http://localhost:6062'
```
