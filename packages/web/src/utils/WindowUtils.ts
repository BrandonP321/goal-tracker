export class WindowUtils {
	/* Locks window scroll bar while retaining width of scroll bar */
	public static lockScroll = () => {
		const htmlEle = document.querySelector("html");
		const scrollTop = document.documentElement.scrollTop;

		document.body.style.top = `-${scrollTop}px`

		htmlEle?.setAttribute("data-scroll-locked", "true");
		/* Save scroll top value in data attr of <html> */
		htmlEle?.setAttribute("data-scroll-top", `${scrollTop}`)
	}
	
	/** Unlocks window scroll bar while retaining position user scrolled to */
	public static unlockScroll = () => {
		const htmlEle = document.querySelector("html");
		const scrollTop = htmlEle?.getAttribute("data-scroll-top");

		if (!htmlEle) {
			return;
		}

		// temporarily remove smooth scrolling so scroll position is instantly retained
		htmlEle.style.scrollBehavior = "initial";

		htmlEle?.setAttribute("data-scroll-locked", "false");

		/* If scroll top value is stored in data attr of <html>, use that 
		value to scroll to back to the exact spot the user last scrolled to */
		scrollTop && htmlEle?.scrollTo({ top: parseInt(scrollTop) });

		// revert back to smooth scroll behavior
		htmlEle.style.scrollBehavior = "smooth"
	}

	public static toggleScrollLock = () => {
		const scrollDataAttrValue = document.querySelector("html")?.getAttribute("data-scroll-locked");

		if (!scrollDataAttrValue || scrollDataAttrValue === "false") {
			this.lockScroll();
		} else {
			this.unlockScroll();
		}
	}
}