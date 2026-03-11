import { MarkdownView, Plugin, debounce, Notice } from 'obsidian';
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

		if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
			// @ts-ignore
			this.segmenter = new Intl.Segmenter('th', { granularity: 'word' });
		} else {
			return;
		}

		// FIX: Sentence case for ribbon tooltips
		this.addRibbonIcon('type', 'Thai word count', () => {
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

	showCountNotice() {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view) return;

		const editor = view.editor;
		const selection = editor.getSelection();
		const fullText = editor.getValue();

		if (selection && selection.trim().length > 0) {
			const selCount = this.getThaiWordCount(selection);
			const total = this.getThaiWordCount(fullText);
			// FIX: Sentence case in notices
			new Notice(`Thai words: ${selCount} (selection) / ${total} (total)`);
		} else {
			const total = this.getThaiWordCount(fullText);
			// FIX: Sentence case in notices
			new Notice(`Total Thai words: ${total}`);
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
			// FIX: Sentence case for status bar
			this.statusBarItemEl.setText(`Thai words: ${selectedCount} / ${totalCount}`);
		} else {
			// FIX: Sentence case for status bar
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
