import path from "path";
import rimraf from "rimraf";
import svelte from "rollup-plugin-svelte";
import babel from "@rollup/plugin-babel";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import css from "rollup-plugin-css-only";
import replace from "@rollup/plugin-replace";

rimraf.sync(path.join(__dirname, "public/build"));

export default {
	input: path.join(__dirname, "src/main.js"),
	output: {
		sourcemap: true,
		format: "iife",
		name: "app",
		dir: path.join(__dirname, "public/build"),
	},
	plugins: [
		svelte({
			compilerOptions: {
				dev: true,
			},
		}),
		css({ output: "bundle.css" }),
		nodeResolve({
			browser: true,
			dedupe: ["svelte"],
		}),
		commonjs(),
		replace({ "process.env.NODE_ENV": JSON.stringify("development") }),
		babel({
			babelHelpers: "bundled",
			babelrc: false,
			extensions: [".js", ".mjs", ".html", ".svelte"],
			include: ["src/**", "node_modules/svelte/**"],
			plugins: [
				"@babel/plugin-proposal-object-rest-spread",
				[
					"istanbul",
					{
						exclude: ["**/*.spec.js"],
						extension: [
							".js",
							".cjs",
							".mjs",
							".ts",
							".tsx",
							".jsx",
							".svelte",
						],
					},
				],
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
		}),
	],
};
