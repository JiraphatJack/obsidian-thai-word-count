import { App, PluginSettingTab, Setting } from 'obsidian';
import MyPlugin from './main';

export interface ThaiWordCountSettings {
	displayTotal: boolean; // Added a real property so it's not an empty interface
}

export const DEFAULT_SETTINGS: ThaiWordCountSettings = {
	displayTotal: true
}

export class ThaiWordCountSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName('Display total word count')
			.setDesc('Show the total word count even when text is selected')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.displayTotal)
				.onChange(async (value) => {
					this.plugin.settings.displayTotal = value;
					await this.plugin.saveSettings();
				}));
	}
}
