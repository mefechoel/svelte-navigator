export const NAVIGATE_TO_TYPE = 0;
export const NAVIGATE_GO_TO_IS_INT = 1;
export const NAVIGATE_STARTS_WITH_SLASH = 2;
export const PARSE_PATH_TYPE = 3;
export const PARSE_PATH_STARTS_WITH_SLASH = 4;
export const STRINGIFY_PATH_TYPE = 5;
export const HISTORY_PUSH_URI_IS_STRING = 6;
export const HISTORY_PUSH_URI_STARTS_WITH_SLASH = 7;
export const HISTORY_REPLACE_URI_IS_STRING = 8;
export const HISTORY_REPLACE_URI_STARTS_WITH_SLASH = 9;
export const HISTORY_GO_DELTA_IS_NUM = 10;
export const HISTORY_GO_DELTA_IS_INT = 11;

export const errorMessages = {
	[NAVIGATE_TO_TYPE]:
		"<navigate> First argument is expected to be a string or a number.",
	[NAVIGATE_GO_TO_IS_INT]:
		"<navigate> When supplying a number, the first argument is expected to " +
		"be a whole number.",
	[NAVIGATE_STARTS_WITH_SLASH]:
		'<navigate> First argument must start with "/". ' +
		"Relative and search/hash only navigation is not supported",
	[PARSE_PATH_TYPE]: "<parsePath> First argument is expected to be a string.",
	[PARSE_PATH_STARTS_WITH_SLASH]:
		'<parsePath> First argument must start with "/", "?" or "#".',
	[STRINGIFY_PATH_TYPE]:
		"<stringifyPath> First argument is expected to be a location object " +
		"with `pathname`, `search` and `hash` properties of type string.",
	[HISTORY_PUSH_URI_IS_STRING]:
		"<History.push> First argument is expected to be a string.",
	[HISTORY_PUSH_URI_STARTS_WITH_SLASH]:
		'<History.push> First argument must start with "/". ' +
		"Relative and search/hash only navigation is not supported",
	[HISTORY_REPLACE_URI_IS_STRING]:
		"<History.replace> First argument is expected to be a string.",
	[HISTORY_REPLACE_URI_STARTS_WITH_SLASH]:
		'<History.replace> First argument must start with "/". ' +
		"Relative and search/hash only navigation is not supported",
	[HISTORY_GO_DELTA_IS_NUM]:
		"<History.go> First argument is expected to be a number.",
	[HISTORY_GO_DELTA_IS_INT]:
		"<History.go> First argument is expected to be a whole number.",
};
