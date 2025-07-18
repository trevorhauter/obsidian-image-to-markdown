import { EditorTransaction, Plugin, MarkdownView } from 'obsidian';

// Remember to rename these classes and interfaces!

export default class MyPlugin extends Plugin {

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
			output = output.concat('file is present');
		} else {
			output = output.concat('file is not present');
		}
		
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		// const clipboardText: ClipboardItems = await navigator.clipboard.read();
		//
		// clipboardText.forEach(
		// 	(item) => {
		// 		item.forEach(singleItem => {
		// 			output.concat(singleItem);	
		// 		});
		// 	}
		// )
		//
		// // Make sure the user is editing a Markdown file.
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
