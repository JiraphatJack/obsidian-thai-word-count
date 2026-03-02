import { App, MarkdownView, Plugin, debounce, Editor } from 'obsidian';
import { DEFAULT_SETTINGS, MyPluginSettings, SampleSettingTab } from "./settings";

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;
	statusBarItemEl: HTMLElement;
	segmenter: Intl.Segmenter;

	async onload() {
		await this.loadSettings();

		// 1. Initialize the Thai word segmenter
		this.segmenter = new Intl.Segmenter('th', { granularity: 'word' });

		// 2. Setup status bar
		this.statusBarItemEl = this.addStatusBarItem();

		// 3. Register events for typing and selection
		// This catches text changes (typing, deleting)
		this.registerEvent(
			this.app.workspace.on("editor-change", debounce(this.updateWordCount.bind(this), 300, true))
		);

		// This catches cursor movement and selection changes (Mouse and Keyboard)
		this.registerEvent(
			this.app.workspace.on("active-leaf-change", () => this.updateWordCount())
		);

		// Global listener for clicking/selection changes
		this.registerDomEvent(document, "selectionchange", () => {
			this.updateWordCount();
		});

		this.addSettingTab(new SampleSettingTab(this.app, this));
		
		this.updateWordCount();
	}

	updateWordCount() {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		
		if (!view || !this.segmenter) {
			this.statusBarItemEl.setText("");
			return;
		}

		const editor = view.editor;
		const fullText = editor.getValue();
		const selection = editor.getSelection();

		const totalCount = this.getThaiWordCount(fullText);

		// If selection exists and isn't just whitespace
		if (selection && selection.trim().length > 0) {
			const selectedCount = this.getThaiWordCount(selection);
			this.statusBarItemEl.setText(`Thai Words: ${selectedCount} / ${totalCount}`);
		} else {
			this.statusBarItemEl.setText(`Thai Words: ${totalCount}`);
		}
	}

	getThaiWordCount(text: string): number {
		if (!text || !text.trim()) return 0;
		
		const segments = this.segmenter.segment(text);
		// Type casting to 'any' for isWordLike to bypass older TS definitions if necessary
		return Array.from(segments).filter((s: any) => s.isWordLike).length;
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
