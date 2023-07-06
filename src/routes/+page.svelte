<script lang="ts">
	import markdownColorscheme from '$lib/stores/markdownColorscheme';
	import { onMount, afterUpdate } from 'svelte';
	import { marked } from 'marked';
	import {
		IconCategory,
		IconCode,
		IconCopy,
		IconDownload,
		IconPhoto,
		IconSquareCheck
	} from '@tabler/icons-svelte';
	import { sanitize } from 'isomorphic-dompurify';
	import hljs from 'highlight.js';
	import md from '$lib/stores/md';
	import { clipboard, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	let editorContentHTML: HTMLParagraphElement;
	let previewHTML: HTMLElement;
	let mdValue = '';

	//  TODO: make ul and ol
	const buttonData = [
		{ value: 'B', type: 'bold' },
		{ value: 'I', type: 'italic' },
		{ value: 'S', type: 'strike' },
		{ value: 'H', type: 'heading' },
		{ value: 'Q', type: 'blockquote' },
		{ value: '', type: 'image' },
		{ value: '', type: 'checkbox' },
		{ value: '', type: 'codeblock' }
	];

	function renderMarkdown(markdown: string) {
		const renderer = new marked.Renderer();
		renderer.code = (code, language = '') => {
			const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
			const highlightedCode = hljs.highlight(validLanguage, code).value;
			return `<pre><code class="hljs ${validLanguage}">${highlightedCode}</code></pre>`;
		};

		renderer.blockquote = (quote) => {
			return `<blockquote class="blockquote">${quote}</blockquote>`;
		};

		return marked(markdown, { renderer, mangle: false, headerIds: false });
	}

	function findTitle(element: HTMLParagraphElement) {
		const matches = element.innerText.match(/^(?!.*#.*#)(#[^\n]*)/m);
		const firstHashtagLine = matches ? matches[1].replace('#', '').trim() : '';
		return firstHashtagLine;
	}

	function handleSelection(type: string, heading?: number) {
		const selection = window.getSelection();
		const isInsideEditor = selection?.anchorNode?.parentElement?.id || selection?.anchorNode?.id;
		if (isInsideEditor !== 'editor') return;
		let headingString = '';
		let modifiedText = '';
		let modifiedLines: string[];
		const selectedText = selection!.toString();
		const lines = selectedText.split('\n');

		if (lines.length === 1) {
			switch (type) {
				case 'bold':
					modifiedText = `**${selectedText.trim()}**`;
					break;
				case 'italic':
					modifiedText = `_${selectedText.trim()}_`;
					break;
				case 'strike':
					modifiedText = `~${selectedText.trim()}~`;
					break;
				case 'heading':
					Array(heading)
						.fill(0)
						.map(() => {
							headingString += '#';
						});
					modifiedText += `${headingString} ${selectedText}`;
					break;
				case 'image':
					modifiedText = ` ![altname](IMAGEURL) ${selectedText.trim()}`;
					break;
				case 'checkbox':
					modifiedText = `- [ ] ${selectedText.trim()}`;
					break;

				case 'codeblock':
					modifiedText = `\`\`\`language 
${selectedText.trim()}
\`\`\`
`;
					break;
				case 'blockquote':
					modifiedText = `> ${selectedText.trim()}`;
					break;
				default:
					break;
			}
		} else {
			modifiedLines = lines.map((line) => {
				if (line.trim() !== '') {
					switch (type) {
						case 'bold':
							return `**${line.trim()}**`;
						case 'italic':
							return `_${line.trim()}_`;
						case 'strike':
							return `~${line.trim()}~`;
						case 'heading':
							console.log(heading);
							Array(heading)
								.fill(0)
								.map(() => {
									if (headingString.length === heading) return;
									headingString += '#';
								});
							return `${headingString} ${line.trim()}`;
						case 'image':
							return `![altname](IMAGEURL) ${line.trim()}`;
						case 'checkbox':
							return `- [ ] ${line.trim()}`;

						case 'codeblock':
							return `\`\`\`language
${line.trim()}
\`\`\`
`;
						case 'blockquote':
							return `> ${line.trim()}`;
						default:
							break;
					}
				}
				return line;
			});
			modifiedText = modifiedLines.join('\n');
		}
		document.execCommand('insertText', undefined, modifiedText);
		// mdContentHTML.innerHTML += modifiedText;
		mdValue = modifiedText;
	}

	function downloadMarkdown() {
		const blob = new Blob([editorContentHTML.innerText], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const link = window.document.createElement('a');
		const title = findTitle(editorContentHTML);
		link.href = url;
		if (title) {
			link.download = `markright-${title}.md`;
		} else {
			link.download = 'markright.md';
		}
		window.document.body.appendChild(link);
		link.click();
		window.document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}

	onMount(async () => {
		editorContentHTML.focus();
		console.log($md.html);
		if ($md.html !== '' || $md.html !== 'undefined') {
			editorContentHTML.innerHTML = $md.html;
			previewHTML.innerHTML = renderMarkdown($md.text);
		}
		await import(`../../node_modules/highlight.js/styles/${$markdownColorscheme.theme}.css`).catch(
			(err) => {
				console.error(`CSS can not be imported ${err}`);
			}
		);
	});

	// TODO: maybe transform this into reactive block, idk
	afterUpdate(() => {
		md.set({ text: editorContentHTML.innerText, html: editorContentHTML.innerHTML });
		const title = findTitle(editorContentHTML);
		if (title) {
			window.document.title = `Markright - ${title}`;
		} else {
			window.document.title = 'Markright';
		}
	});
	const popupFeatured: PopupSettings = {
		event: 'click',
		target: 'popupFeatured',
		placement: 'top'
	};
</script>

<main class="grid-cols-2 grid w-screen h-screen place-items-center relative z-10">
	<ul
		class="breadcrumb-nonresponsive fixed bottom-[84.8%] lg:bottom-[86.8%] z-10 variant-glass-primary w-2/4 left-0"
	>
		{#each buttonData as { value, type }}
			<li class="crumb" title={`${type.toUpperCase()}`}>
				{#if type === 'heading'}
					<select
						class="btn bg-transparent border-none lg:hover:variant-soft-primary transition-all duration-300"
						role="listbox"
						on:change={(e) => {
							handleSelection('heading', e.target.selectedIndex + 1);
						}}
					>
						{#each { length: 6 } as _, index}
							<option value={`h${index + 1}`}>{`h${index + 1}`}</option>
						{/each}
					</select>
				{:else}
					<button
						type="button"
						class="btn btn-icon lg:hover:variant-soft-primary transition-all duration-300"
						on:click={() => handleSelection(type)}
					>
						{value}
						{#if type === 'image'}
							<IconPhoto size={22} />
						{/if}
						{#if type === 'checkbox'}
							<IconSquareCheck size={22} />
						{/if}

						{#if type === 'codeblock'}
							<IconCode size={22} />
						{/if}
					</button>
				{/if}
			</li>
		{/each}
	</ul>

	<div class="shadow-xl z-20" data-popup="popupFeatured">
		<span class="flex flex-col gap-3">
			<button
				type="button"
				class="btn btn-icon variant-filled"
				on:click={downloadMarkdown}
				title="Download your markdown file!"
				aria-label="Download Markdown Content"
			>
				<IconDownload size={22} />
			</button>

			<button
				type="button"
				class="btn btn-icon variant-filled"
				use:clipboard={$md.text}
				title="Copy to clipboard your markdown content"
				aria-label="Copy to device clipboard your markdown content"
			>
				<IconCopy size={22} />
			</button>
		</span>
	</div>

	<button
		class="fixed bottom-2 right-0 mr-3 z-10 btn-icon variant-filled"
		type="button"
		title="Menu for actions"
		use:popup={popupFeatured}
	>
		<IconCategory size={22} />
	</button>

	<section class="w-full min-h-screen h-screen variant-filled-surface-200 text-justify">
		<p
			contenteditable="true"
			id="editor"
			on:keyup={(e) => (mdValue = e.target.innerText)}
			class="p-2 min-w-full w-full min-h-screen h-max variant-filled-surface-200 lg:text-xl break-all text-md mt-9"
			bind:this={editorContentHTML}
		/>
	</section>
	<section
		id="preview"
		class="w-[100%] min-h-screen h-max variant-glass-surface text-center"
		bind:this={previewHTML}
	>
		{@html sanitize(renderMarkdown($md.text))}
	</section>
</main>
