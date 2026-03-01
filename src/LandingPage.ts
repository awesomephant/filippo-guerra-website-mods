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
           x    x                                     `

	constructor(container: Element) {
		console.log(this.logoRaw.trim())

		this.containerEl = container
		this.logo = this.parseLogo(this.logoRaw.trim())
		this.c = this.initCanvas()

		if (this.c) {
			this.render()
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

		const data = s.replace(/\.|-/gi, "").split("\n")

		letterOffsets.forEach((w, i) => {
			data.forEach((l, j) => {
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

		return { letters }
	}

	render() {
		this.logo.lettters.forEach((l) => {
			const 
		})
	}
}
