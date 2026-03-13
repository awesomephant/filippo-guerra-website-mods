import typescript from "@rollup/plugin-typescript"
import terser from "@rollup/plugin-terser"
import image from "@rollup/plugin-image"

export default {
	input: {
		main: "src/index.ts"
	},
	output: {
		dir: "_site",
		entryFileNames: "[name].js",
		strict: false,
		format: "cjs"
	},
	plugins: [typescript(), image(), terser()]
}
