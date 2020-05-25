import path from "path";
import svelte from "rollup-plugin-svelte";
import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

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
        css.write(path.join(__dirname, "public/build/bundle.css"));
      },
    }),
    resolve({
      browser: true,
      dedupe: importee =>
        importee === "svelte" || importee.startsWith("svelte/"),
    }),
    commonjs(),
    babel({
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
