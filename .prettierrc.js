module.exports = {
	plugins: ["prettier-plugin-svelte"],
	overrides: [{ files: "*.svelte", options: { parser: "svelte" } }],
	trailingComma: "all",
	proseWrap: "always",
	arrowParens: "avoid",
	useTabs: true,
};
