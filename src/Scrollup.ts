import arrow from "./assets/arrow.svg"

export default class ScrollUp {
	containerEl: Element
	buttonId: string = "mkvc-scroll-top"

	constructor(container: Element) {
		this.containerEl = container

		if (this.containerEl.querySelector(`#${this.buttonId}`)) {
			return
		}

		const buttonEl = document.createElement("button")
		buttonEl.setAttribute("id", "mkvc-scroll-top")

		const iconEl = document.createElement("img")
		iconEl.setAttribute("alt", "")
		iconEl.setAttribute("src", arrow)
		iconEl.setAttribute("style", `display: block; height: .55em; width: auto`)
		buttonEl.appendChild(iconEl)

		const labelEl = document.createElement("span")
		labelEl.innerText = "Scroll to top"
		labelEl.setAttribute("style", "font-size: 0; position: absolute; left: -9999px")

		buttonEl.addEventListener("click", (e) => {
			e.preventDefault()
			window.scrollTo({ top: 0, behavior: "smooth" })
		})

		buttonEl.setAttribute(
			"style",
			`display: inline-flex; font-size: inherit; appearance: none; border: 0; background: transparent; cursor: pointer`
		)

		this.containerEl.querySelector("div:last-child")?.insertAdjacentElement("beforebegin", buttonEl)
	}
}
