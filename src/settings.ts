import {App, PluginSettingTab} from "obsidian";
import MyPlugin from "./main";

export interface MyPluginSettings {
	// Currently no user-configurable settings
}

export const DEFAULT_SETTINGS: MyPluginSettings = {
}

export class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		// Thai Word Count plugin has no user-configurable settings yet
		containerEl.createEl('p', {
			text: 'Thai Word Count - No settings available'
		});
	}
}
