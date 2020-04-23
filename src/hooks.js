import { getContext } from "svelte";
import { get } from "svelte/store";
import { LOCATION, ROUTER } from "./contexts";
import { resolveLink } from "./utils";
import { navigate } from "./history";

export function useLocation() {
  const { subscribe } = getContext(LOCATION);
  return { subscribe };
}

export function useActiveRoute() {
  const { activeRoute } = getContext(ROUTER);
  return { subscribe: activeRoute.subscribe };
}

export function useRouterBase() {
  const { routerBase } = getContext(ROUTER);
  return routerBase;
}

export function useBase() {
  const { base } = getContext(ROUTER);
  return base;
}

export function useLinkResolve() {
  const base = useBase();
  const routerBase = useRouterBase();
  /**
   * Resolves the path relative to the current route and basepath.
   *
   * @param {string} path The path to navigate to
   * @returns {string} The resolved path
   */
  const resolve = path => {
    const { uri: basepath } = get(base);
    const { uri } = get(routerBase);
    return resolveLink(path, basepath, uri);
  };
  return resolve;
}

export function useNavigate() {
  const resolve = useLinkResolve();
  /**
   * Navigate to a new route.
   * Resolves the link relative to the current route and basepath.
   *
   * @param {string} to The path to navigate to
   * @param {Object} options
   * @param {*} [options.state]
   * @param {boolean} [options.replace=false]
   */
  const navigateRelative = (to, { state, replace = false } = {}) =>
    navigate(resolve(to), { state, replace });
  return navigateRelative;
}
