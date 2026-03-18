export default class Cursor {
	r: number = 15
	containerEl: HTMLElement
	cursorEl: HTMLElement
	position: [number, number] = [-1, -1]
	scale: number = 1
	active: boolean = false
	running: boolean = false
	isTouch: boolean = false
	touchMq: MediaQueryList

	constructor(container: HTMLElement) {
		this.containerEl = container
		this.cursorEl = document.createElement("div")
		this.cursorEl.style = `transition: opacity 100ms; z-index: 9999; pointer-events: none; mix-blend-mode: difference; background: white;position: fixed;top: 0;left: 0;width: ${this.r}px; height: ${this.r}px; border-radius: ${this.r * 0.2}px`

		const styleEl = document.createElement("style")
		styleEl.innerText = "body, body * { cursor: none}"
		this.containerEl.appendChild(styleEl)

		this.containerEl.appendChild(this.cursorEl)

		this.touchMq = window.matchMedia("(pointer: coarse)")

		this.initUnlessTouch()
		this.registerEvents()
		this.loop()
	}

	initUnlessTouch() {
		this.isTouch = this.touchMq.matches
		if (this.isTouch) {
			this.active = false
			this.running = false
		} else {
			this.running = true
			this.loop()
		}
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
		this.touchMq.addEventListener("change", () => {
			this.initUnlessTouch()
		})
		window.addEventListener("mousemove", (e) => {
			this.position = [e.clientX, e.clientY]
			this.active = true
		})
		window.addEventListener("mouseover", () => {
			this.running = true
			this.loop()
		})
	}
}
