/*
 * Adapted from https://github.com/EmilTholin/svelte-routing
 *
 * https://github.com/EmilTholin/svelte-routing/blob/master/LICENSE
 */

// Use strings instead of objects, so different versions of
// svelte-navigator can potentially still work together
export const LOCATION = "@@svelte-navigator-ctx-location";
export const ROUTER = "@@svelte-navigator-ctx-router";
export const ROUTE = "@@svelte-navigator-ctx-route";
