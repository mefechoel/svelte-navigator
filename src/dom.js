import { warn, ROUTER_ID } from "./warning";

/*
 * `focus` Adapted from https://github.com/oaf-project/oaf-side-effects/blob/master/src/index.ts
 *
 * https://github.com/oaf-project/oaf-side-effects/blob/master/LICENSE
 */
export function focus(elem) {
  if (!elem) return false;
  try {
    if (!elem.hasAttribute("tabindex")) {
      elem.setAttribute("tabindex", "-1");
      // We remove tabindex after blur to avoid weird browser behavior
      // where a mouse click can activate elements with tabindex="-1".
      const blurListener = () => {
        elem.removeAttribute("tabindex");
        elem.removeEventListener("blur", blurListener);
      };
      elem.addEventListener("blur", blurListener);
    }
    elem.focus();
    return document.activeElement === elem;
  } catch (e) {
    // Apparently trying to focus a disabled element in IE can throw.
    // See https://stackoverflow.com/a/1600194/2476884
    return false;
  }
}

export function resetFocus() {
  if (document.activeElement) {
    try {
      document.activeElement.blur();
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }
}

export function isEndMarker(elem, id) {
  return Number(elem.dataset.svnavRouteEnd) === id;
}

export function isHeading(elem) {
  return /^H[1-6]$/i.test(elem.tagName);
}

function query(selector, parent = document) {
  return parent.querySelector(selector);
}

export function queryHeading(id) {
  const marker = query(`[data-svnav-route-start="${id}"]`);
  let current = marker.nextElementSibling;
  while (!isEndMarker(current, id)) {
    if (isHeading(current)) {
      return current;
    }
    const heading = query("h1,h2,h3,h4,h5,h6", current);
    if (heading) {
      return heading;
    }
    current = current.nextElementSibling;
  }
  return null;
}

export function handleFocus(route) {
  const focusHeading = queryHeading(route.id);
  if (!focusHeading) {
    const routeAttr = route.default ? "default" : `path="${route.path}"`;
    warn(
      ROUTER_ID,
      `Could not find a heading to focus in <Route ${routeAttr} />. ` +
        "You should always render a header for accessibility reasons. " +
        "If you don't want this Route or Router to manage focus, " +
        // eslint-disable-next-line quotes
        'pass "primary={false}" to it',
    );
  }
  const headingFocused = focus(focusHeading);
  if (headingFocused) return;
  const documentFocused = focus(document.documentElement);
  if (documentFocused) return;
  resetFocus();
}
