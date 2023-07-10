<script>
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';
	let tabSet = 0;
</script>

<main
	class="md:w-screen md:h-screen flex flex-col justify-center items-center snap-y scroll-py-4 snap-center snap-mandatory"
>
	<TabGroup>
		<Tab bind:group={tabSet} name="tab1" value={0}>How Markdown Works?</Tab>
		<Tab bind:group={tabSet} name="tab2" value={1}>Examples</Tab>
		<Tab bind:group={tabSet} name="tab3" value={2}>Learn More!</Tab>

		<!-- Tab Panels --->
		<svelte:fragment slot="panel">
			{#if tabSet === 0}
				<p
					class="card py-5 h-44 text-center max-w-sm md:max-w-md md:py-8 md:px-2 mx-1.5 px-2 md:mx-0"
				>
					<a href="https://www.markdownguide.org/basic-syntax" class="anchor">Markdown</a> is a lightweight
					language for text formatting, widely used for documentation and online posts. With its intuitive
					syntax, it's easy to add bold text, create headings, and make lists, making text formatting
					a simple and accessible task.
				</p>
			{:else if tabSet === 1}
				<p
					class="card flex flex-col justify-center items-center h-44 text-center max-w-sm md:max-w-md md:px-2 mx-1.5 md:mx-0"
				>
					<span># This is how you make a Heading</span>
					<strong>**This is how you make a bold text**</strong>
					<em>_This is how you make a italic text_</em>
					<span>This is how you make a Link <strong>[LinkName](url)</strong></span>
					<span class="text-md"
						>This is how you put a image <strong>![alttext](imageurl)</strong></span
					>
				</p>
			{:else if tabSet === 2}
				<p
					class="card flex items-center justify-center flex-col h-44 text-center max-w-sm md:max-w-md mx-1.5 md:mx-0"
				>
					Here you can learn more about how to use Markdown to write better markdown!
					<a
						href="https://www.markdownguide.org/basic-syntax"
						target="_blank"
						class="text-lg anchor">Markdown Guide</a
					>
				</p>
			{/if}
		</svelte:fragment>
	</TabGroup>
</main>
