/*
 * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
 *
 * https://github.com/reach/router/blob/master/LICENSE
 */

import { getContext } from "svelte";
import { derived, writable } from "svelte/store";
import { ROUTE } from "./contexts";

export const isUndefined = value => typeof value === "undefined";

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
export function createGlobalId() {
  return Math.random()
    .toString(36)
    .substring(2);
}

export function findClosest(tagName, element) {
  while (element && element.tagName !== tagName) {
    // eslint-disable-next-line no-param-reassign
    element = element.parentNode;
  }
  return element;
}

export const isSSR = isUndefined(window);

export const deriveDefault = (store, mapper, defaultValue) =>
  store ? derived(store, mapper) : writable(defaultValue);

export const deriveRouteBase = defaultValue => {
  const route = getContext(ROUTE);
  return deriveDefault(route, _route => _route.base, defaultValue);
};
