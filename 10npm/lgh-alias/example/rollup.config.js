import { alias } from "tutorial-rollup-plugin-alias";
import nodeResolvePlugin from '@rollup/plugin-node-resolve';
export default {
  input: "./index.js",
  output: {
    format: "es",
    file: "./dist/index.js",
  },
  plugins: [
    alias({
      entries: [{
        find: "@",
        replacement: "./utils",
      }],
    }),
    nodeResolvePlugin()
  ],
};
