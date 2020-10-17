import path from "path";
import rimraf from "rimraf";
import svelte from "rollup-plugin-svelte";
import babel from "@rollup/plugin-babel";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

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
      dev: true,
      css: css => {
        css.write("bundle.css");
      },
    }),
    nodeResolve({
      browser: true,
      dedupe: importee =>
        importee === "svelte" || importee.startsWith("svelte/"),
    }),
    commonjs(),
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
