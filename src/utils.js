/*
 * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
 *
 * https://github.com/reach/router/blob/master/LICENSE
 */

const paramRegex = /^:(.+)/;

const SEGMENT_POINTS = 4;
const STATIC_POINTS = 3;
const DYNAMIC_POINTS = 2;
const SPLAT_PENALTY = 1;
const ROOT_POINTS = 1;

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
 * Score a route depending on how its individual segments look
 * @param {object} route
 * @param {number} index
 * @return {object}
 */
export function rankRoute(route, index) {
  const score = route.default
    ? 0
    : segmentize(route.fullPath).reduce((acc, segment) => {
        let nextScore = acc;
        nextScore += SEGMENT_POINTS;

        if (isRootSegment(segment)) {
          nextScore += ROOT_POINTS;
        } else if (isDynamic(segment)) {
          nextScore += DYNAMIC_POINTS;
        } else if (isSplat(segment)) {
          nextScore -= SEGMENT_POINTS + SPLAT_PENALTY;
        } else {
          nextScore += STATIC_POINTS;
        }

        return nextScore;
      }, 0);

  return { route, score, index };
}

/**
 * Give a score to all routes and sort them on that
 * @param {object[]} routes
 * @return {object[]}
 */
export function rankRoutes(routes) {
  return (
    routes
      .map(rankRoute)
      // If two routes have the exact same score, we go by index instead
      .sort((a, b) => {
        if (a.score < b.score) {
          return 1;
        }
        if (a.score > b.score) {
          return -1;
        }
        return a.index - b.index;
      })
  );
}

/**
 * Ranks and picks the best route to match. Each segment gets the highest
 * amount of points, then the type of segment gets an additional amount of
 * points where
 *
 *  static > dynamic > splat > root
 *
 * This way we don't have to worry about the order of our routes, let the
 * computers do it.
 *
 * A route looks like this
 *
 *  { fullPath, default, value }
 *
 * And a returned match looks like:
 *
 *  { route, params, uri }
 *
 * @param {object[]} routes
 * @param {string} uri
 * @return {?object}
 */
export function pick(routes, uri) {
  let bestMatch;
  let defaultMatch;

  const [uriPathname] = uri.split("?");
  const uriSegments = segmentize(uriPathname);
  const isRootUri = uriSegments[0] === "";
  const ranked = rankRoutes(routes);

  for (let i = 0, l = ranked.length; i < l; i++) {
    const { route } = ranked[i];
    let missed = false;

    if (route.default) {
      defaultMatch = {
        route,
        params: {},
        uri,
      };
      continue;
    }

    const routeSegments = segmentize(route.fullPath);
    const params = {};
    const max = Math.max(uriSegments.length, routeSegments.length);
    let index = 0;

    for (; index < max; index++) {
      const routeSegment = routeSegments[index];
      const uriSegment = uriSegments[index];

      if (typeof routeSegment !== "undefined" && isSplat(routeSegment)) {
        // Hit a splat, just grab the rest, and return a match
        // uri:   /files/documents/work
        // route: /files/* or /files/*splatname
        const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);

        params[splatName] = uriSegments
          .slice(index)
          .map(decodeURIComponent)
          .join("/");
        break;
      }

      if (typeof uriSegment === "undefined") {
        // URI is shorter than the route, no match
        // uri:   /users
        // route: /users/:userId
        missed = true;
        break;
      }

      const dynamicMatch = paramRegex.exec(routeSegment);

      if (dynamicMatch && !isRootUri) {
        const value = decodeURIComponent(uriSegment);
        params[dynamicMatch[1]] = value;
      } else if (routeSegment !== uriSegment) {
        // Current segments don't match, not dynamic, not splat, so no match
        // uri:   /users/123/settings
        // route: /users/:id/profile
        missed = true;
        break;
      }
    }

    if (!missed) {
      bestMatch = {
        route,
        params,
        uri: `/${uriSegments.slice(0, index).join("/")}`,
      };
      break;
    }
  }

  return bestMatch || defaultMatch || null;
}

/**
 * Check if the `route.fullPath` matches the `uri`.
 * @param {Object} route
 * @param {string} uri
 * @return {?object}
 */
export function match(route, uri) {
  return pick([route], uri);
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
 * Resolve URIs as though every path is a directory, no files. Relative URIs
 * in the browser can feel awkward because not only can you be "in a directory",
 * you can be "at a file", too. For example:
 *
 *  browserSpecResolve('foo', '/bar/') => /bar/foo
 *  browserSpecResolve('foo', '/bar') => /foo
 *
 * But on the command line of a file system, it's not as complicated. You can't
 * `cd` from a file, only directories. This way, links have to know less about
 * their current path. To go deeper you can do this:
 *
 *  <Link to="deeper"/>
 *  // instead of
 *  <Link to=`{${props.uri}/deeper}`/>
 *
 * Just like `cd`, if you want to go deeper from the command line, you do this:
 *
 *  cd deeper
 *  # not
 *  cd $(pwd)/deeper
 *
 * By treating every path as a directory, linking to relative paths should
 * require less contextual information and (fingers crossed) be more intuitive.
 * @param {string} to
 * @param {string} base
 * @return {string}
 */
export function resolve(to, base) {
  // /foo/bar, /baz/qux => /foo/bar
  if (startsWith(to, "/")) {
    return to;
  }

  const [toPathname, toQuery] = to.split("?");
  const [basePathname] = base.split("?");
  const toSegments = segmentize(toPathname);
  const baseSegments = segmentize(basePathname);

  // ?a=b, /users?b=c => /users?a=b
  if (toSegments[0] === "") {
    return addQuery(basePathname, toQuery);
  }

  // profile, /users/789 => /users/789/profile
  if (!startsWith(toSegments[0], ".")) {
    const pathname = baseSegments.concat(toSegments).join("/");
    return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
  }

  // ./       , /users/123 => /users/123
  // ../      , /users/123 => /users
  // ../..    , /users/123 => /
  // ../../one, /a/b/c/d   => /a/b/one
  // .././one , /a/b/c/d   => /a/b/c/one
  const allSegments = baseSegments.concat(toSegments);
  const segments = [];

  allSegments.forEach(segment => {
    if (segment === "..") {
      segments.pop();
    } else if (segment !== ".") {
      segments.push(segment);
    }
  });

  return addQuery(`/${segments.join("/")}`, toQuery);
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

/**
 * Normalizes a location for consumption by `Route` children and the `Router`.
 * It removes the apps basepath from the pathnam
 * and sets default values for `search` and `hash` properties.
 *
 * @param {Object} location The current global location supplied by the history component
 * @param {string} basepath The applications basepath (i.e. when serving from a subdirectory)
 *
 * @returns The normalized location
 */
export function normalizeLocation(location, basepath) {
  const { pathname, hash = "", search = "", state, key } = location;
  const baseSegments = segmentize(basepath).filter(Boolean);
  const pathSegments = segmentize(pathname).filter(Boolean);
  while (baseSegments.length) {
    if (baseSegments[0] !== pathSegments[0]) {
      throw new Error(
        `<Router> Invalid state: All locations must begin with the basepath "${basepath}", found "${pathname}"`,
      );
    }
    baseSegments.shift();
    pathSegments.shift();
  }
  return {
    pathname: join(...pathSegments),
    hash,
    search,
    state,
    key,
  };
}

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

/**
 * Checks if a clicked link triggers a navigation to a route from the same application.
 * Returns `false` if link leads to a different website.
 *
 * @param {Element} anchor The `<a />` element
 * @returns {boolean}
 */
export function hostMatches(anchor) {
  const { host } = window.location;
  return (
    anchor.host === host ||
    // svelte seems to kill anchor.host value in ie11, so fall back to checking href
    startsWith(anchor.href, `https://${host}`) ||
    startsWith(anchor.href, `http://${host}`)
  );
}

/**
 * Resolves a link relative to the router basepath and the uri of the current router.
 *
 * @param {string} path The given path, that will be resolved against a router base
 * @param {string} basepath The basepath of the router (i.e. from calling `useBase`)
 * @param {string} routerBase The current router base (i.e. from calling `useRouterBase`)
 * @returns {string} The resolved path
 *
 * @example
 * resolveLink("relative", "/", "/currentBase") // -> "/currentBase/relative"
 * resolveLink("/absolute", "/", "/currentBase") // -> "/absolute"
 * resolveLink("/absolute", "/base", "/currentBase") // -> "/base/absolute"
 */
export function resolveLink(path, basepath, routerBase, appBase) {
  let resolvedLink;
  if (path === "/") {
    resolvedLink = basepath;
  } else if (startsWith(path, "/")) {
    resolvedLink = resolve(stripSlashes(path), basepath);
  } else {
    resolvedLink = resolve(path, routerBase);
  }
  return join(appBase, resolvedLink);
}

/**
 * Create a locally unique id
 *
 * @returns {number} An id
 */
export const createLocalId = (() => {
  let id = 0;
  return () => id++;
})();

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
