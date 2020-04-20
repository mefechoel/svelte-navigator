import { getContext } from "svelte";
import { get } from "svelte/store";
import { resolve } from "./utils";

export const LOCATION = {};
export const ROUTER = {};

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

export function useResolve(path) {
  const routerBase = useRouterBase();
  const { uri: basePath } = get(routerBase);
  return path === "/" ? basePath : resolve(path, basePath);
}
