import { EditorTransaction, Plugin, MarkdownView, Notice } from 'obsidian';
import { createWorker } from 'tesseract.js';

const VALID_MIME_TYPES = [
	'image/heic',
	'image/jpeg',
	'image/png',
	'image/webp',
]

export default class ObsidianImageToMarkdown extends Plugin {

	// Retrieve the mime type of the image copied to clipboard if it exists
	// If not, return null
	getImageMimeType(clipboardItems: ClipboardItems): string | null {
		for (const item of clipboardItems) {
			for (const validMimeType of VALID_MIME_TYPES) {
				if (item.types.indexOf(validMimeType) > -1) {
					return validMimeType;
				}
			}
		}
		return null
	}

	async clipboardImageToMarkdown() {
		const clipboardItems = await navigator.clipboard.read();
		const imageMimeType = this.getImageMimeType(clipboardItems)
		let output  = '';

		if( imageMimeType ) {
			new Notice('Converting copied image to markdown...');

			const blob = await clipboardItems[0].getType(imageMimeType);
			const file = new File([blob], 'obsidian-img');

			const worker = await createWorker('eng');
			const ret = await worker.recognize(file);
			output = output.concat(ret.data.text);
			await worker.terminate();

		} else {
			// no valid image is currently copied to the users keyboard
			new Notice('No valid image is currently copied to clipboard!');
		}
		
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		
		// Make sure the user is editing a Markdown file.
		if (view) {
			const transaction: EditorTransaction = {
				replaceSelection: output,
			};
			view.editor.transaction(transaction);
		}
	}

	onload() {

		this.addCommand(
			{
				id: 'image-to-markdown',
				name: 'Convert an image from the clipboard into markdown',
				hotkeys: [{ modifiers: ['Ctrl', 'Mod'], key: 'v'}],
				callback: () => {
					this.clipboardImageToMarkdown();
				}
			}
		)
	}

	onunload() {

	}
}
