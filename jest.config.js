module.exports = {
	transform: {
		"^.+\\.js$": "babel-jest",
		"^.+\\.svelte$": "svelte-jester",
	},
	testRegex: "/test/.*\\.(test)\\.m?jsx?$",
	moduleFileExtensions: ["js", "mjs", "svelte"],
	setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
	moduleDirectories: ["node_modules", "src"],
	collectCoverageFrom: ["src/**/*"],
	collectCoverage: true,
	coverageDirectory: "coverage-jest",
};
