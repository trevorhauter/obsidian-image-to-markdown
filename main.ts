import { Notice, Plugin } from 'obsidian';

// Remember to rename these classes and interfaces!

export default class MyPlugin extends Plugin {

	clipboardImageToMarkdown() {
		new Notice('This is a notice!');
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
