import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

export default defineConfig({
  plugins: [preact()],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "HelloClaudiaWidget",
      formats: ["iife"],
      fileName: () => "widget.js",
    },
    outDir: "dist",
    minify: "esbuild",
    target: "es2018",
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
});
