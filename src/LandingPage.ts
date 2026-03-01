export default class LandingPage {
	containerEl: Element
	c: CanvasRenderingContext2D | null
	logo: any = {
		letters: []
	}
	logoRaw: string = `
xxxx.x.x.x.    .    .    -xxx.    .    .   .   .     
x      x                  x                          
xxx  x x x xxx  xxx   xx  x xx x  x  xx   xx  xx xxx 
x    x x x x  x x  x x  x x  x x  x x  x x   x      x
x    x x x x  x x  x x  x x  x x  x xxxx x   x    xxx
x    x x x x  x x  x x  x x  x x  x x    x   x   x  x
x    x x x xxx  xxx   xx   xxx  xxx  xxx x   x    xxx
x    x x x x    x                                    
           x    x                                    
           x    x                                   .
`

	constructor(container: Element) {
		console.log(this.logoRaw.trim())

		this.containerEl = container
		this.logo = this.parseLogo(this.logoRaw.trim())
		this.c = this.initCanvas()

		if (this.c) {
			this.render(this.c, this.logo)
		}
	}

	initCanvas() {
		const canvasEl = document.createElement("canvas")
		canvasEl.classList.add("mkvc--logo")

		const styleEl = document.createElement("style")
		styleEl.innerText = `.mkvc--logo{border: 1px solid red; height: 300px}`

		this.containerEl.appendChild(styleEl)
		this.containerEl.insertAdjacentElement("afterbegin", canvasEl)

		return canvasEl.getContext("2d")
	}

	stringToBool(s: string): boolean[] {
		return s.split("").map((c) => c === "x")
	}

	stack(arr: number[]): number[] {
		let res: number[] = []
		let total = 0
		arr.forEach((n) => {
			total += n
			res.push(total)
		})
		return res
	}

	parseLogo(s: string) {
		const lines = s.split("\n")

		// find boundaries
		const letterWidths = lines[0].split(/\.|-/gi).map((s) => s.length)
		const letterOffsets = [0, ...this.stack(letterWidths)]

		let letters: boolean[][][] = []

		letterOffsets.forEach((w, i) => {
			lines.forEach((l, j) => {
				const chunk = this.stringToBool(l.slice(letterOffsets[i], letterOffsets[i + 1]))

				if (letters[i]) {
					letters[i][j] = chunk
				} else {
					letters[i] = [chunk]
				}
			})
		})

		const wordOffsets = this.stack([
			...lines[0]
				.split("-")
				.map((s) => s.length)
				.map((v, _, arr) => v + arr.length - 1)
		])

		console.log(lines)
		console.log(letters)

		return { letters, width: lines[0].length, height: lines.length }
	}

	render(c: CanvasRenderingContext2D, logo: any) {
		c.canvas.width = c.canvas.clientWidth
		c.canvas.height = c.canvas.clientHeight

		const r = c.canvas.width / logo.width
		// const ph = c.canvas.height / logo.height
		const padding = 2
		let letterOffset = 0

		for (let i = 0; i < logo.letters.length; i++) {
			const letter = logo.letters[i]

			for (let j = 0; j < letter.length; j++) {
				const row = letter[j]

				row.forEach((cell: boolean, k: number) => {
					c.fillStyle = cell ? "red" : "lightgray"
					const x = (letterOffset + k) * r
					const y = j * r
					c.fillRect(x, y, r - padding, r - padding)
				})
			}

			letterOffset += letter[0].length
		}

		// logo.lettters.forEach((l) => {
		// 	// const
		// })
	}
}
