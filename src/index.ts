import Cursor from "./Cursor"
import LandingPage from "./LandingPage"
import ScrollUp from "./Scrollup"

const footerEl = document.querySelector(`[page-url="footer"] .page-layout bodycopy`)
footerEl
	? new ScrollUp(footerEl)
	: console.warn("Could not initialise scroll to top (container not found)")

if (!document.body.classList.contains("editing")) {
	const cursorEl = document.body
	cursorEl
		? new Cursor(cursorEl)
		: console.warn("Could not initialise cursor (container not found)")

	const logoEl = document.querySelector("body")
	logoEl
		? new LandingPage(logoEl)
		: console.warn("Could not initialise landing page (container not found)")
}
