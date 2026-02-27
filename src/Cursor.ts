export default class Cursor {
	r: number = 25
	containerEl: HTMLElement
	cursorEl: HTMLElement
	position: [number, number] = [0, 0]
	scale: number = 1
	active: boolean = false
	running: boolean = false

	constructor(container: HTMLElement) {
		this.containerEl = container
		this.cursorEl = document.createElement("div")
		this.cursorEl.style = `transition: opacity 100ms; pointer-events: none; mix-blend-mode: difference; background: white;position: fixed;top: 0;left: 0;width: ${this.r}px; height: ${this.r}px; border-radius: ${this.r * 0.2}px`

		const styleEl = document.createElement("style")
		styleEl.innerText = "body, body * { cursor: none}"
		this.containerEl.appendChild(styleEl)

		this.containerEl.appendChild(this.cursorEl)

		this.registerEvents()
		this.loop()
	}

	loop() {
		this.render()
		if (this.running) {
			window.requestAnimationFrame(this.loop.bind(this))
		}
	}

	render() {
		this.cursorEl.style.transform = `translateX(${this.position[0]}px) translateY(${this.position[1]}px) translateX(-50%) translateY(-50%)`
		this.cursorEl.style.opacity = this.active ? "1" : "0"
	}

	registerEvents() {
		window.addEventListener("mousemove", (e) => {
			this.position = [e.clientX, e.clientY]
		})
		window.addEventListener("mouseover", () => {
			this.active = true
			this.running = true
			this.loop()
		})
		window.addEventListener("mouseout", () => {
			this.active = false
			this.running = false
			this.render()
		})
	}
}
