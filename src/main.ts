import { MarkdownView, Plugin, debounce, Notice } from 'obsidian'; // Added Notice
import { DEFAULT_SETTINGS, ThaiWordCountSettings, ThaiWordCountSettingTab } from "./settings";

interface IntlSegmenter {
	segment(text: string): Iterable<{ isWordLike: boolean }>;
}

export default class ThaiWordCountPlugin extends Plugin {
	settings: ThaiWordCountSettings;
	statusBarItemEl: HTMLElement;
	segmenter: IntlSegmenter;

	async onload() {
		await this.loadSettings();

		// 1. MOBILE SAFETY CHECK: Ensure Intl.Segmenter exists before initializing
		if (typeof Intl !== 'undefined' && (Intl as any).Segmenter) {
			// @ts-ignore
			this.segmenter = new Intl.Segmenter('th', { granularity: 'word' });
		} else {
			// If not supported, show a notice and stop loading to prevent crashes
			new Notice("Thai Word Count: This device does not support modern Thai segmentation.");
			return;
		}

		// 2. RIBBON ICON: Useful for mobile users where status bar is hidden
		this.addRibbonIcon('type', 'Thai Word Count', () => {
			this.showCountNotice();
		});

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

	// 3. HELPER FOR MOBILE: Pops up a notice with the word count
	showCountNotice() {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view) return;

		const editor = view.editor;
		const selection = editor.getSelection();
		const fullText = editor.getValue();

		if (selection && selection.trim().length > 0) {
			const selCount = this.getThaiWordCount(selection);
			const total = this.getThaiWordCount(fullText);
			new Notice(`Thai Words: ${selCount} (Selection) / ${total} (Total)`);
		} else {
			const total = this.getThaiWordCount(fullText);
			new Notice(`Total Thai Words: ${total}`);
		}
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
