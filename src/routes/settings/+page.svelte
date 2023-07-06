<script lang="ts">
	import markdownColorscheme from '$lib/stores/markdownColorscheme';
	import { marked } from 'marked';
	import { sanitize } from 'isomorphic-dompurify';
	import hljs from 'highlight.js';
	import { ListBox, ListBoxItem, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { IconChevronDown, IconQuestionMark } from '@tabler/icons-svelte';
	let comboboxValue: string;

	const popupCombobox: PopupSettings = {
		event: 'focus-click',
		target: 'popupCombobox',
		placement: 'bottom',
		closeQuery: '.listbox-item'
	};

	const popupMarkdownColorscheme: PopupSettings = {
		event: 'click',
		target: 'popupFeatured',
		placement: 'top-start'
	};

	function renderMarkdown(markdown: string) {
		const renderer = new marked.Renderer();
		renderer.code = (code, language = '') => {
			const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
			const highlightedCode = hljs.highlight(validLanguage, code).value;
			return `<pre><code class="hljs ${validLanguage}">${highlightedCode}</code></pre>`;
		};
		return marked(markdown, { renderer, mangle: false, headerIds: false });
	}

	const markdownPreviewColorscheme = `\`\`\`js 
console.log("Have a nice day!")
\`\`\`
`;

	//  TODO: make a api route for this (maybe)
	const markdownThemes = [
		{ value: 'Github Dark', theme: 'github-dark' },
		{ value: 'Github Light', theme: 'github' },
		{ value: 'Xcode', theme: 'xcode' },
		{ value: 'Visual Studio', theme: 'vs2015' }
	];

	async function previewColorscheme(theme: string) {
		const themeLink = document.querySelector(`link[href*="${theme}.css"]`);
		if (themeLink) {
			console.count();
			themeLink.remove();
		}
		const newThemeLink = document.createElement('link');
		newThemeLink.rel = 'stylesheet';
		newThemeLink.href = `../../../node_modules/highlight.js/styles/${theme}.css`;
		document.head.appendChild(newThemeLink);
	}
</script>

<section class="w-full h-full flex items-center justitfy-center flex-wrap">
	<ul class="flex flex-col items-center justify-start w-full h-full mt-5">
		<li class="flex flex-col">
			<span class="text-xl font-medium p-2">Markdown Colorscheme</span>
			<button class="btn variant-filled w-48 justify-between self-center" use:popup={popupCombobox}>
				<span class="capitalize">{$markdownColorscheme.value ?? 'Github Dark'}</span>
				<span><IconChevronDown size={24} /></span>
			</button>

			<div class="card w-48 shadow-xl py-2 text-center" data-popup="popupCombobox">
				<ListBox rounded="rounded-none">
					{#each markdownThemes as markdownTheme}
						<span class="flex flex-row items-center justify-between">
							<ListBoxItem
								bind:group={comboboxValue}
								name="medium"
								value={markdownTheme.theme}
								on:change={() =>
									markdownColorscheme.set({
										value: markdownTheme.value,
										theme: markdownTheme.theme
									})}>{markdownTheme.value}</ListBoxItem
							>
							<button
								type="button"
								title="Preview your colorscheme"
								class="btn btn-icon flex-shrink-0"
								use:popup={popupMarkdownColorscheme}
								on:click={() => previewColorscheme(markdownTheme.theme)}
							>
								<IconQuestionMark size={24} />
							</button>
						</span>
					{/each}
				</ListBox>

				<div class="w-fit h-10 absolute top-0 right-0" data-popup="popupFeatured">
					{@html sanitize(renderMarkdown(markdownPreviewColorscheme))}
				</div>
			</div>
		</li>
	</ul>
</section>
