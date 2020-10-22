import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import livereload from "rollup-plugin-livereload";

const production = !process.env.ROLLUP_WATCH;

export default {
	input: "src/main.js",
	output: {
		sourcemap: true,
		format: "es",
		name: "app",
		dir: "public/build",
	},
	plugins: [
		svelte({
			// Enable run-time checks when not in production
			dev: true,
			css: css => {
				css.write("public/build/bundle.css");
			},
		}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration —
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: importee =>
				importee === "svelte" || importee.startsWith("svelte/"),
		}),
		commonjs(),

		// In dev mode, call `yarn serve` once
		// the bundle has been generated
		// eslint-disable-next-line no-use-before-define
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload("public"),
	],
	watch: {
		clearScreen: false,
	},
};

function serve() {
	let started = false;

	return {
		writeBundle() {
			if (!started) {
				started = true;
				// eslint-disable-next-line global-require
				require("child_process").spawn(
					"yarn",
					["run", "serve", "--", "--dev"],
					{
						stdio: ["ignore", "inherit", "inherit"],
						shell: true,
					},
				);
			}
		},
	};
}
