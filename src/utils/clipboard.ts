/**
 * If the browser supports the Clipboard API, use it. Otherwise, fall back to the legacy
 * document.execCommand('copy') method
 * @param text - The text to copy to the clipboard.
 * @returns The return value is a Promise that resolves when the text has been written to the
 * clipboard.
 */
export async function copyTextToClipboard(text: string) {
	if ('clipboard' in navigator) {
		return await navigator.clipboard.writeText(text)
	} else {
		return document.execCommand('copy', true, text)
	}
}
