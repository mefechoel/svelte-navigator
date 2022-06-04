const { join } = require("path");
const rimraf = require("rimraf");
const { rollup } = require("rollup");
const svelte = require("rollup-plugin-svelte");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");

rimraf.sync(join(__dirname, "../dist"));

async function main() {
	const bundle = await rollup({
		input: join(__dirname, "../ssrApp/App.svelte"),
		plugins: [
			svelte({ compilerOptions: { generate: "ssr" } }),
			nodeResolve(),
			commonjs(),
		],
	});
	await bundle.write({
		format: "umd",
		name: "ssrApp",
		file: join(__dirname, "../dist/App.js"),
	});
}

main();
