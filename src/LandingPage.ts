import { stack, stringToBool } from "./utils"

class Cell {
	x: number
	y: number
	s: number
	st: number

	constructor(x: number, y: number, s: number) {
		this.x = x
		this.y = y
		this.s = s
		this.st = s
	}

	draw(c: CanvasRenderingContext2D) {}
}

export default class LandingPage {
	containerEl: Element
	c: CanvasRenderingContext2D | null
	logo: any
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
			this.loop()
		}
	}

	initCanvas() {
		const canvasEl = document.createElement("canvas")
		canvasEl.classList.add("mkvc--logo")

		const styleEl = document.createElement("style")
		styleEl.innerText = `.mkvc--logo{width: 40vw;position: absolute; left: 50%; transform: translateX(-50%) translateY(-120%)}`

		this.containerEl.appendChild(styleEl)
		this.containerEl.insertAdjacentElement("afterbegin", canvasEl)

		return canvasEl.getContext("2d")
	}

	stringToCells(s: string): Cell[] {
		return s.split("").map((c) => {
			const s = c === "x" ? Math.random() : 0
			return new Cell(0, 0, s)
		})
	}

	parseLogo(s: string) {
		let letters: Cell[][][] = []
		let words = []

		const lines = s.split("\n")
		const letterWidths = lines[0].split(/\.|-/gi).map((s) => s.length)
		const letterOffsets = [0, ...stack(letterWidths.map((w) => w + 1))]

		letterOffsets.forEach((w, i) => {
			lines.forEach((l, j) => {
				const chunk = this.stringToCells(l.slice(letterOffsets[i], letterOffsets[i + 1])).slice(
					0,
					-1
				)
				if (letters[i]) {
					letters[i][j] = chunk
				} else {
					letters[i] = [chunk]
				}
			})
		})

		const wordOffsets = stack(lines[0].split("-").map((s) => (s.match(/\./g) || []).length + 1))
		for (let i = 0; i < wordOffsets.length; i++) {
			words.push(letters.slice(wordOffsets[i - 1] || 0, wordOffsets[i]))
		}

		return {
			words,
			width: letterWidths.reduce((partialSum, a) => partialSum + a, 0),
			height: lines.length
		}
	}

	drawCell(c: CanvasRenderingContext2D, x: number, y: number, r: number, s: number) {
		c.translate(x + r / 2, y + r / 2)
		c.rotate(45 * (Math.PI / 180))
		c.beginPath()
		c.roundRect((-r * s) / 2, (-r * s) / 2, r * s, r * s, r * 0.15)
		c.fill()
		c.resetTransform()
	}

	update() {}

	loop() {
		this.update()
		//@ts-expect-error
		this.render(this.c, this.logo)
		// window.requestAnimationFrame(this.loop)
	}

	render(c: CanvasRenderingContext2D, logo: any) {
		c.canvas.width = c.canvas.clientWidth
		c.canvas.height = c.canvas.clientHeight

		const r = (c.canvas.width / logo.width) * 0.8

		const letterSpacing = r * 0.7
		const wordSpacing = r * 7.25

		let letterOffset = 0

		for (let w = 0; w < logo.words.length; w++) {
			const word = logo.words[w]
			for (let i = 0; i < word.length; i++) {
				const letter = word[i]

				for (let j = 0; j < letter.length; j++) {
					const row = letter[j]

					row.forEach((cell: Cell, k: number) => {
						const x = wordSpacing * w + letterSpacing * i + (letterOffset + k) * r
						const y = j * r
						this.drawCell(c, x, y, r, cell.s)
					})
				}
				letterOffset += letter[0].length
			}
		}
	}
}
