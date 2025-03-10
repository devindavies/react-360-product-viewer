import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/**/*.{tsx,jsx,ts,js}", "!src/stories/**/*"],
	splitting: true,
	skipNodeModulesBundle: true,
	sourcemap: true,
	clean: true,
	dts: true,
	format: ["cjs", "esm"],
});
