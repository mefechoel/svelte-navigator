import { isFunction } from "./utils";

// We start from 1 here, so we can check if an origin id has been passed
// by using `originId || <fallback>`
export const LINK_ID = 1;
export const ROUTE_ID = 2;
export const ROUTER_ID = 3;
export const USE_FOCUS_ID = 4;
export const USE_LOCATION_ID = 5;
export const USE_MATCH_ID = 6;
export const USE_NAVIGATE_ID = 7;
export const USE_PARAMS_ID = 8;
export const USE_RESOLVABLE_ID = 9;
export const USE_RESOLVE_ID = 10;
export const NAVIGATE_ID = 11;
export const LINK_ACTION_ID = 12;
export const LINKS_ACTION_ID = 13;
export const BROWSER_ROUTER_ID = 14;
export const HASH_ROUTER_ID = 15;
export const MEMORY_ROUTER_ID = 16;
export const AUTO_ROUTER_ID = 17;

const labels = {
	[LINK_ID]: "Link",
	[ROUTE_ID]: "Route",
	[ROUTER_ID]: "Router",
	[USE_FOCUS_ID]: "useFocus",
	[USE_LOCATION_ID]: "useLocation",
	[USE_MATCH_ID]: "useMatch",
	[USE_NAVIGATE_ID]: "useNavigate",
	[USE_PARAMS_ID]: "useParams",
	[USE_RESOLVABLE_ID]: "useResolvable",
	[USE_RESOLVE_ID]: "useResolve",
	[NAVIGATE_ID]: "navigate",
	[LINK_ACTION_ID]: "use:link",
	[LINKS_ACTION_ID]: "use:links",
	[BROWSER_ROUTER_ID]: "BrowserRouter",
	[HASH_ROUTER_ID]: "HashRouter",
	[MEMORY_ROUTER_ID]: "MemoryRouter",
	[AUTO_ROUTER_ID]: "AutoRouter",
};

export const createLabel = labelId => labels[labelId];

export function createIdentifier(labelId, props) {
	let attr;
	let tag = createLabel(labelId);
	if (labelId === ROUTE_ID) {
		attr = props.path ? `path="${props.path}"` : "default";
	} else if (labelId === LINK_ID) {
		attr = `to="${props.to}"`;
	} else if (labelId === ROUTER_ID) {
		attr = `basepath="${props.basepath || ""}"`;
	} else if (labelId === LINK_ACTION_ID) {
		tag = "a use:link";
		attr = `href="${props.href || ""}"`;
		if (props.replace) {
			attr += " replace";
		}
	} else if (labelId === LINKS_ACTION_ID) {
		tag = "a";
		attr = `href="${props.href || ""}"`;
	}
	return `<${tag} ${attr || ""} />`;
}

export function createMessage(labelId, message, props, originId) {
	const origin = props && createIdentifier(originId || labelId, props);
	const originMsg = origin ? `\n\nOccurred in: ${origin}` : "";
	const label = createLabel(labelId);
	const msg = isFunction(message) ? message(label) : message;
	return `<${label}> ${msg}${originMsg}`;
}

export const createMessageHandler = handler => (...args) =>
	handler(createMessage(...args));

export const fail = createMessageHandler(message => {
	throw new Error(message);
});

// eslint-disable-next-line no-console
export const warn = createMessageHandler(console.warn);

export const failProd = componentId => {
	throw new Error(
		`<SvelteNavigator>: An error occurred in ${createLabel(componentId)}.`,
	);
};
