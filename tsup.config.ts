import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],
	outDir: "package/standard",
	format: "esm",
	dts: true,
	clean: true,
	sourcemap: true,
	minify: "terser",
});
