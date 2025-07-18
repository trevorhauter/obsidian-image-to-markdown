import { EditorTransaction, Plugin, MarkdownView } from 'obsidian';
import { createWorker } from 'tesseract.js';

export default class ObsidianImageToMarkdown extends Plugin {

	async clipboardImageToMarkdown() {
		const clipBoardItems = await navigator.clipboard.read();

		let filePresent = false;

		clipBoardItems.forEach(item => {
			// TODO: Add better, more flexible validation
			if (item.types.indexOf('image/png') > -1) {
				filePresent = true;
			}
		});


		let output = '' as string;
		if( filePresent ) {
			const blob = await clipBoardItems[0].getType('image/png');
			const file = new File([blob], "obsidian-img.png");

			const worker = await createWorker('eng');
			const ret = await worker.recognize(file);
			console.log(ret.data.text);
			output = output.concat(ret.data.text);
			await worker.terminate();


		} else {
			output = output.concat('file is not present');
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
