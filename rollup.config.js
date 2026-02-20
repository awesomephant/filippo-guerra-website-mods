import typescript from "@rollup/plugin-typescript"
import terser from "@rollup/plugin-terser"
import copy from "@guanghechen/rollup-plugin-copy"
import serve from "rollup-plugin-serve"

export default {
	input: {
		main: "src/index.ts"
	},
	output: {
		dir: "dist",
		entryFileNames: "[name].js"
	},
	plugins: [
		copy({
			watch: "views",
			targets: [{ src: "views/*.html", dest: "dist" }]
		}),
		typescript(),
		terser(),
		serve("dist")
	]
}
