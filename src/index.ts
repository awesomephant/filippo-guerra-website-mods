import Cursor from "./Cursor"
import LandingPage from "./LandingPage"
import ScrollUp from "./Scrollup"
import SwipeNav from "./SwipeNav"

document.addEventListener("DOMContentLoaded", () => {
	const footerEl = document.querySelector(`[page-url="footer"] .page-layout bodycopy`)

	if (footerEl) {
		new ScrollUp(footerEl)
	} else {
		console.log("no container found")
	}
})
