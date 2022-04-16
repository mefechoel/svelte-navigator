/*
 * Adapted from https://github.com/EmilTholin/svelte-routing
 *
 * https://github.com/EmilTholin/svelte-routing/blob/master/LICENSE
 */

import { shouldNavigate, addListener, isFunction } from "./utils";
import {
	createLabel,
	fail,
	failProd,
	LINKS_ACTION_ID,
	LINK_ACTION_ID,
	warn,
} from "./warning";

const adjustHref = (node, history, labelId) => {
	const nodeHref = node.getAttribute("href");
	if (nodeHref[0] !== "/" && nodeHref[0] !== "?" && nodeHref[0] !== "#") {
		if (process.env.NODE_ENV !== "production") {
			fail(
				labelId,
				`Unexpected relative link ${nodeHref}. Relative links ` +
					`are not supported in ${createLabel(labelId)} actions. ` +
					"They may cause unexpected routing behaviour. Use absolute links or " +
					'resolve a relative link yourself using "useResolve".',
			);
		} else {
			failProd(labelId);
		}
	}
	if (
		nodeHref &&
		nodeHref !== history.createHref(node.dataset.svnvHref || "")
	) {
		// eslint-disable-next-line no-param-reassign
		node.dataset.svnvHref = nodeHref;
		node.setAttribute("href", history.createHref(nodeHref));
	}
};

const walkChildren = (node, cb) => {
	if (!node) return;
	cb(node);
	[...node.childNodes].forEach(child => {
		walkChildren(child, cb);
	});
};

const isNoRoute = node =>
	isFunction(node.hasAttribute) && node.hasAttribute("noroute");

const isLink = node => !!node && node.tagName === "A";

const findClosestLink = element => {
	while (element && !isLink(element)) {
		// eslint-disable-next-line no-param-reassign
		element = element.parentNode;
	}
	return element;
};

const createActionFactory = (getAnchor, setup, labelId) => defaultHistory => (
	node,
	options,
) => {
	let { history = defaultHistory } = options || {};
	const handleClick = event => {
		const anchor = getAnchor(event);
		if (anchor && anchor.target === "" && shouldNavigate(event)) {
			event.preventDefault();
			const to = anchor.dataset.svnvHref;
			history.navigate(to, { replace: anchor.hasAttribute("replace") });
		}
	};

	const unlisten = addListener(node, "click", handleClick);

	setup(node, history);

	let observer;
	if (process.env.NODE_ENV !== "production") {
		observer = new MutationObserver(mutations => {
			mutations.forEach(({ type, target }) => {
				if (type === "attributes" && isLink(target) && !isNoRoute(target)) {
					warn(
						labelId,
						"You cannot update the href attributes when using the " +
							`"${createLabel(labelId)}" action. Consider using a <Link /> ` +
							"component instead.",
						{
							href: target.dataset.svnvHref,
							replace: target.hasAttribute("replace"),
						},
					);
				}
			});
		});
		observer.observe(node, {
			attributes: true,
			attributeFilter: ["href"],
			subtree: true,
		});
	}

	return {
		update(nextOptions) {
			history = (nextOptions && nextOptions.history) || defaultHistory;
			setup(node, history);
		},
		destroy() {
			unlisten();
			if (process.env.NODE_ENV !== "production") {
				observer.disconnect();
			}
		},
	};
};

export const createLink = createActionFactory(
	event => event.currentTarget,
	(node, history) => {
		if (process.env.NODE_ENV !== "production") {
			if (!isLink(node)) {
				const truncate = (str, length) =>
					str.substr(0, length) + (str.length >= length ? " ..." : "");
				warn(
					LINK_ACTION_ID,
					'You can only use the "use:link" action on <a> elements.\n' +
						`Got ${truncate(node.outerHTML, 80)}`,
				);
			}
		}
		adjustHref(node, history, LINK_ACTION_ID);
	},
	LINK_ACTION_ID,
);

export const createLinks = createActionFactory(
	event => {
		const anchor = findClosestLink(event.target);
		if (anchor && !isNoRoute(anchor)) {
			return anchor;
		}
		return null;
	},
	(node, history) => {
		walkChildren(node, child => {
			if (isLink(child) && !isNoRoute(child)) {
				adjustHref(child, history, LINKS_ACTION_ID);
			}
		});
	},
	LINKS_ACTION_ID,
);
