export function focusElement(elem) {
  // See: https://developer.paciellogroup.com/blog/2014/08/using-the-tabindex-attribute/
  // See: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElem/focus#Browser_compatibility
  // See: https://github.com/whatwg/html/issues/834
  try {
    // Set tabindex="-1" if necessary.
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
