function stringToBool(s: string): boolean[] {
	return s.split("").map((c) => c === "x")
}

function stack(arr: number[]): number[] {
	let res: number[] = []
	let total = 0
	arr.forEach((n) => {
		total += n
		res.push(total)
	})
	return res
}

export { stringToBool, stack }
