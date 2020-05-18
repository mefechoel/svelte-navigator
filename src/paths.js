export const paramRegex = /^:(.+)/;

/**
 * Check if `string` starts with `search`
 * @param {string} string
 * @param {string} search
 * @return {boolean}
 */
export function startsWith(string, search) {
  return string.substr(0, search.length) === search;
}

/**
 * Check if `segment` is a root segment
 * @param {string} segment
 * @return {boolean}
 */
export function isRootSegment(segment) {
  return segment === "";
}

/**
 * Check if `segment` is a dynamic segment
 * @param {string} segment
 * @return {boolean}
 */
export function isDynamic(segment) {
  return paramRegex.test(segment);
}

/**
 * Check if `segment` is a splat
 * @param {string} segment
 * @return {boolean}
 */
export function isSplat(segment) {
  return segment[0] === "*";
}

/**
 * Strip potention splat and splatname of the end of a path
 * @param {string} str
 * @return {string}
 */
export function stripSplat(str) {
  return str.replace(/\*.*$/, "");
}

/**
 * Strip `str` of potential start and end `/`
 * @param {string} str
 * @return {string}
 */
export function stripSlashes(str) {
  return str.replace(/(^\/+|\/+$)/g, "");
}

/**
 * Split up the URI into segments delimited by `/`
 * @param {string} uri
 * @return {string[]}
 */
export function segmentize(uri) {
  return stripSlashes(uri).split("/");
}

/**
 * Add the query to the pathname if a query is given
 * @param {string} pathname
 * @param {string} [query]
 * @return {string}
 */
export function addQuery(pathname, query) {
  return pathname + (query ? `?${query}` : "");
}

/**
 * Combines the `basepath` and the `path` into one path.
 * @param {string} basepath
 * @param {string} path
 */
export function combinePaths(basepath, path) {
  const barePath =
    path === "/" ? basepath : `${stripSlashes(basepath)}/${stripSlashes(path)}`;
  return `${stripSlashes(barePath)}/`;
}

/**
 * Normalizes a basepath
 *
 * @param {string} path
 * @returns {string}
 *
 * @example
 * normalizePath("base/path/") // -> "/base/path"
 */
export function normalizePath(path) {
  return `/${stripSlashes(path)}`;
}

/**
 * Joins and normalizes multiple path fragments
 *
 * @param  {...string} pathFragments
 * @returns {string}
 */
export function join(...pathFragments) {
  const joinFragment = fragment =>
    segmentize(fragment)
      .filter(Boolean)
      .join("/");
  const joinedSegments = pathFragments.map(joinFragment).join("/");
  return normalizePath(joinedSegments);
}
