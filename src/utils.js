/*
 * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
 *
 * https://github.com/reach/router/blob/master/LICENSE
 */

export const isUndefined = value => typeof value === "undefined";

export const isFunction = value => typeof value === "function";

export const isNumber = value => typeof value === "number";

/**
 * Decides whether a given `event` should result in a navigation or not.
 * @param {object} event
 */
export function shouldNavigate(event) {
  return (
    !event.defaultPrevented &&
    event.button === 0 &&
    !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
  );
}

export function createCounter() {
  let i = 0;
  /**
   * Returns an id and increments the internal state
   * @returns {number}
   */
  return () => i++;
}

/**
 * Create a globally unique id
 *
 * @returns {string} An id
 */
export const createGlobalId = () =>
  Math.random()
    .toString(36)
    .substring(2);

export function findClosest(tagName, element) {
  while (element && element.tagName !== tagName) {
    // eslint-disable-next-line no-param-reassign
    element = element.parentNode;
  }
  return element;
}

export const isSSR = typeof window === "undefined";

export function addListener(target, type, handler) {
  target.addEventListener(type, handler);
  return () => target.removeEventListener(type, handler);
}

export function query(selector, parent = document) {
  return parent.querySelector(selector);
}

export const waitForElement = hash =>
  // eslint-disable-next-line consistent-return
  new Promise(res => {
    if (!hash) return res();

    let observer;
    let timeoutId;

    const resolve = () => {
      observer.disconnect();
      clearTimeout(timeoutId);
      res();
    };

    // Push onto callback queue so it runs after the DOM is updated
    // eslint-disable-next-line consistent-return
    setTimeout(() => {
      if (query(hash)) return res();
      observer = new MutationObserver(() => {
        if (query(hash)) resolve();
      });
      observer.observe(document, {
        attributes: true,
        childList: true,
        subtree: true,
      });
      // if the element doesn't show up in 3 seconds, stop checking
      timeoutId = setTimeout(resolve, 3000);
    }, 0);
  });

export function forceJumpToFragment(hash, timeout = 0) {
  if (!hash) return;
  waitForElement(hash)
    .then(() => {
      setTimeout(() => {
        console.log("RE-HASH");
        // eslint-disable-next-line no-self-assign
        window.location.href = window.location.href;
      }, timeout);
    })
    .catch(() => {
      console.log("FAIL");
    });
}
