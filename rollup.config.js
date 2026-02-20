import typescript from "@rollup/plugin-typescript"
import terser from "@rollup/plugin-terser"

export default {
	input: {
		main: "src/index.ts"
	},
	output: {
		dir: "_site",
		entryFileNames: "[name].js"
	},
	plugins: [typescript(), terser()]
}
