import { join } from "path";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import svelte from "rollup-plugin-svelte";
import babel from "@rollup/plugin-babel";
import replace from "@rollup/plugin-replace";
import { terser } from "rollup-plugin-terser";
import rimraf from "rimraf";
import mainPkg from "./package.json";
import browserPkg from "./browser/package.json";
import hashPkg from "./hash/package.json";
import memoryPkg from "./memory/package.json";
import autoPkg from "./auto/package.json";

// eslint-disable-next-line no-console
console.log("\nCleaning previous build...");
rimraf.sync(join(__dirname, "./dist"));
rimraf.sync(join(__dirname, "./browser/dist"));
rimraf.sync(join(__dirname, "./hash/dist"));
rimraf.sync(join(__dirname, "./memory/dist"));
rimraf.sync(join(__dirname, "./auto/dist"));

const babelConfig = {
	babelrc: false,
	babelHelpers: "bundled",
	extensions: [".js", ".mjs", ".html", ".svelte"],
	include: ["src/**", "node_modules/svelte/**"],
	plugins: [
		"@babel/plugin-proposal-object-rest-spread",
		["@babel/plugin-transform-template-literals", { loose: true }],
	],
	presets: [
		[
			"@babel/preset-env",
			{
				targets: [
					"last 2 Chrome versions",
					"last 2 Safari versions",
					"last 2 iOS versions",
					"last 2 Firefox versions",
					"last 2 Edge versions",
				],
			},
		],
	],
};

function createSingleConfig({ input, file, format, minify = false }) {
	const isUmd = format === "umd";
	return {
		input,
		output: {
			file,
			format,
			...(isUmd ? { name: "SvelteNavigator", exports: "named" } : {}),
		},
		external: ["svelte", "svelte/store", "svelte/internal"],
		plugins: [
			svelte(),
			nodeResolve({
				dedupe: importee =>
					importee === "svelte" || importee.startsWith("svelte/"),
			}),
			commonjs(),
			minify &&
				replace({ "process.env.NODE_ENV": JSON.stringify("production") }),
			isUmd && babel(babelConfig),
			minify && terser(),
		],
	};
}

const createBundleConfig = (input, pkg, base = ".") => [
	createSingleConfig({ input, file: join(base, pkg.module), format: "es" }),
	createSingleConfig({ input, file: join(base, pkg.main), format: "umd" }),
	createSingleConfig({
		input,
		file: join(base, pkg.unpkg),
		format: "umd",
		minify: true,
	}),
];

export default [
	// Main package
	...createBundleConfig("src/index.js", mainPkg),
	// Packages bound to the specific history type
	...createBundleConfig("browser/index.js", browserPkg, "./browser"),
	...createBundleConfig("hash/index.js", hashPkg, "./hash"),
	...createBundleConfig("memory/index.js", memoryPkg, "./memory"),
	...createBundleConfig("auto/index.js", autoPkg, "./auto"),
];
