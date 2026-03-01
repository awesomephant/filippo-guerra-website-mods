import { stack, stringToBool } from "./utils"

export default class LandingPage {
	containerEl: Element
	c: CanvasRenderingContext2D | null
	logo: any = {
		letters: []
	}
	logoRaw: string = `
xxxx.x.x.x.    .    .    - xxx.    .    .   .   .     
x      x                  x                           
xxx  x x x xxx  xxx   xx  x xx x  x  xx   xx  xx xxx  
x    x x x x  x x  x x  x x  x x  x x  x x   x      x 
x    x x x x  x x  x x  x x  x x  x xxxx x   x    xxx 
x    x x x x  x x  x x  x x  x x  x x    x   x   x  x 
x    x x x xxx  xxx   xx   xxx  xxx  xxx x   x    xxx 
x    x x x x    x                                     
           x    x                                     
           x    x                                    .
`
	constructor(container: Element) {
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

	parseLogo(s: string) {
		const lines = s.split("\n")

		// find boundaries
		const letterWidths = lines[0].split(/\.|-/gi).map((s) => s.length)
		const letterOffsets = [0, ...stack(letterWidths.map((w) => w + 1))]

		let letters: boolean[][][] = []

		letterOffsets.forEach((w, i) => {
			lines.forEach((l, j) => {
				const chunk = stringToBool(l.slice(letterOffsets[i], letterOffsets[i + 1])).slice(0, -1)
				if (letters[i]) {
					letters[i][j] = chunk
				} else {
					letters[i] = [chunk]
				}
			})
		})

		let words = []
		const wordOffsets = stack([
			...lines[0].split("-").map((s) => (s.match(/\./g) || []).length + 1)
		])
		for (let i = 0; i < wordOffsets.length; i++) {
			words.push(letters.slice(wordOffsets[i - 1] || 0, wordOffsets[i]))
		}

		return {
			words,
			letters,
			width: letterWidths.reduce((partialSum, a) => partialSum + a, 0),
			height: lines.length
		}
	}

	drawCell(c: CanvasRenderingContext2D, x, y, r, padding) {
		c.translate(x + r, y + r / 2)
		c.rotate(45 * (Math.PI / 180))
		c.beginPath()
		c.roundRect(-r / 2, r / r, r - padding, r - padding, r * 0.15)
		c.fill()
		c.resetTransform()
	}

	render(c: CanvasRenderingContext2D, logo: any) {
		c.canvas.width = c.canvas.clientWidth
		c.canvas.height = c.canvas.clientHeight

		const r = (c.canvas.width / logo.width) * 0.81

		const padding = r * 0.3
		const letterSpacing = r * 0.75
		const wordSpacing = r * 7

		let letterOffset = 0
		let wordOffset = 0

		for (let w = 0; w < logo.words.length; w++) {
			const word = logo.words[w]

			for (let i = 0; i < word.length; i++) {
				const letter = word[i]

				for (let j = 0; j < letter.length; j++) {
					const row = letter[j]

					row.forEach((cell: boolean, k: number) => {
						if (cell) {
							const x = wordSpacing * w + letterSpacing * i + (letterOffset + k) * r
							const y = j * r
							this.drawCell(c, x, y, r, padding)
						}
					})
				}
				letterOffset += letter[0].length
			}
		}
	}
}
