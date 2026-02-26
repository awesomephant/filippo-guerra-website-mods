export default class ScrollUp {
	containerEl: Element

	constructor(container: Element) {
		this.containerEl = container
		const buttonEl = document.createElement("button")
		buttonEl.innerText = "Scroll to top"
		buttonEl.addEventListener("click", (e) => {
			e.preventDefault()
			window.scrollTo({ top: 0, behavior: "smooth" })
		})

		this.containerEl.appendChild(buttonEl)
	}
}
