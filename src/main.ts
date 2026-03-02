import { MarkdownView, Plugin, debounce } from 'obsidian';
import { DEFAULT_SETTINGS, ThaiWordCountSettings, ThaiWordCountSettingTab } from "./settings";

// Define the interface to satisfy TypeScript without using 'any'
interface IntlSegmenter {
	segment(text: string): Iterable<{ isWordLike: boolean }>;
}

export default class ThaiWordCountPlugin extends Plugin {
	settings: ThaiWordCountSettings;
	statusBarItemEl: HTMLElement;
	segmenter: IntlSegmenter;

	async onload() {
		await this.loadSettings();

		// Create segmenter using the global Intl object
		// @ts-ignore
		this.segmenter = new Intl.Segmenter('th', { granularity: 'word' });

		this.statusBarItemEl = this.addStatusBarItem();

		const debouncedUpdate = debounce(this.updateWordCount.bind(this), 300, true);

		this.registerEvent(this.app.workspace.on("editor-change", debouncedUpdate));
		this.registerEvent(this.app.workspace.on("active-leaf-change", () => this.updateWordCount()));
		
		this.registerDomEvent(document, "selectionchange", () => {
			this.updateWordCount();
		});

		this.addSettingTab(new ThaiWordCountSettingTab(this.app, this));
		
		this.updateWordCount();
	}

	updateWordCount() {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		
		if (!view || !this.statusBarItemEl) return;

		const editor = view.editor;
		const fullText = editor.getValue();
		const selection = editor.getSelection();
		const totalCount = this.getThaiWordCount(fullText);

		if (selection && selection.trim().length > 0) {
			const selectedCount = this.getThaiWordCount(selection);
			this.statusBarItemEl.setText(`Thai words: ${selectedCount} / ${totalCount}`);
		} else {
			this.statusBarItemEl.setText(`Thai words: ${totalCount}`);
		}
	}

	getThaiWordCount(text: string): number {
		if (!text || !text.trim() || !this.segmenter) return 0;
		const segments = this.segmenter.segment(text);
		return Array.from(segments).filter((s) => s.isWordLike).length;
	}

	async loadSettings() {
		const data = await this.loadData() as ThaiWordCountSettings | null;
		this.settings = Object.assign({}, DEFAULT_SETTINGS, data);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
