import { stack, stringToBool } from "./utils"

class Particle {
	p: [number, number]
	r: number
	s: number
	st: number
	permanent: boolean

	constructor(p: [number, number], r: number, s: number, permanent: boolean) {
		this.p = p
		this.r = r
		this.s = 0
		this.st = 0
		this.permanent = permanent
	}

	draw(c: CanvasRenderingContext2D) {
		c.fillStyle = "green"
		c.translate(this.p[0] + this.r / 2, this.p[1] + this.r / 2)
		c.rotate(45 * (Math.PI / 180))
		c.beginPath()
		c.roundRect(
			(-this.r * this.s) / 2,
			(-this.r * this.s) / 2,
			this.r * this.s,
			this.r * this.s,
			this.r * 0.15
		)
		c.fill()
		c.resetTransform()
	}
}

export default class LandingPage {
	containerEl: Element
	c: CanvasRenderingContext2D | null
	attractors: any[]
	particles: Particle[]
	logo: any
	t: number
	running: boolean = true
	clock: number
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
		this.attractors = []
		this.particles = []

		this.c = this.initCanvas()
		this.t = 0

		if (this.c) {
			this.initAttractors()
			this.initParticles(this.c, this.logo.words, this.logo.width)
			this.loop()
		}

		this.clock = window.setInterval(() => {
			this.t += 100
		}, 100)
	}

	initCanvas() {
		const canvasEl = document.createElement("canvas")
		canvasEl.classList.add("mkvc--logo")

		const styleEl = document.createElement("style")
		styleEl.innerText = `.mkvc--logo{width: 40vw;position: absolute; left: 50%; transform: translateX(-50%) translateY(-120%); border: 1px solid red}`

		this.containerEl.appendChild(styleEl)
		this.containerEl.insertAdjacentElement("afterbegin", canvasEl)

		const c = canvasEl.getContext("2d")

		if (c) {
			c.canvas.width = c.canvas.clientWidth
			c.canvas.height = c.canvas.clientHeight
			return c
		}
		return null
	}

	initAttractors() {
		if (this.c) {
			this.attractors.push({
				start: 100,
				end: 5000,
				p: [this.c.canvas.width / 2, this.c.canvas.height + 10],
				v: [0, -1],
				active: true
			})
		}
	}

	parseLogo(s: string) {
		let letters: boolean[][][] = []
		let words = []

		const lines = s.split("\n")
		const letterWidths = lines[0].split(/\.|-/gi).map((s) => s.length)
		const letterOffsets = [0, ...stack(letterWidths.map((w) => w + 1))]

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

	initParticles(c: CanvasRenderingContext2D, words: any[], width: number) {
		const r = (c.canvas.width / width) * 0.81

		const letterSpacing = r * 0.7
		const wordSpacing = r * 7.25

		let letterOffset = 0

		for (let w = 0; w < words.length; w++) {
			const word = words[w]
			for (let i = 0; i < word.length; i++) {
				const letter = word[i]

				for (let j = 0; j < letter.length; j++) {
					const row = letter[j]
					row.forEach((isLogo: boolean, k: number) => {
						const x = wordSpacing * w + letterSpacing * i + (letterOffset + k) * r
						const y = j * r
						this.particles.push(new Particle([x, y], r, 1, isLogo))
					})
				}
				letterOffset += letter[0].length
			}
		}
		console.log(this.particles)
	}

	update() {
		for (let i = 0; i < this.attractors.length; i++) {
			this.attractors[i].p[0] += this.attractors[i].v[0]
			this.attractors[i].p[1] += this.attractors[i].v[1]
			if (this.t > this.attractors[i].end) {
				this.attractors.splice(i, 1)
			}
		}

		for (let i = 0; i < this.particles.length; i++) {
			this.particles[i].st = 0.75
			this.particles[i].s += (this.particles[i].st - this.particles[i].s) * 0.2
		}

		if (this.t > 10_000) {
			this.running = false
		}
	}

	loop() {
		this.update()
		//@ts-expect-error
		this.render(this.c, this.logo)
		if (this.running) {
			window.requestAnimationFrame(this.loop.bind(this))
		}
	}

	render(c: CanvasRenderingContext2D, logo: any) {
		c.clearRect(0, 0, c.canvas.width, c.canvas.height)
		this.attractors.forEach((a) => {
			c.fillStyle = "red"
			c.fillRect(a.p[0], a.p[1], 15, 15)
		})

		this.particles.forEach((p) => {
			p.draw(c)
		})
	}
}
