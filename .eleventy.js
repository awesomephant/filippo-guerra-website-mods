import { parse } from "csv-parse/sync"

export default function (eleventyConfig) {
	eleventyConfig.addDataExtension("csv", (contents) => {
		const records = parse(contents, {
			columns: true,
			skip_empty_lines: true
		})
		return records
	})
}
