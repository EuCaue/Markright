<script lang="ts">
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import '../theme.postcss';
	import '../app.post.css';
	import {
		AppShell,
		AppBar,
		Avatar,
		Drawer,
		drawerStore,
		setInitialClassState,
		storePopup
	} from '@skeletonlabs/skeleton';
	import { IconMenu2 } from '@tabler/icons-svelte';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import Navigation from '$lib/Components/Navigation.svelte';
	import { onMount } from 'svelte';
	function openDrawer() {
		drawerStore.open();
	}
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
	onMount(() => {
		setInitialClassState().toString();
	});
</script>

<Drawer width="md:w-1/4" shadow="shadow-sm" bgDrawer="variant-filled-surface">
	<Navigation />
</Drawer>

<AppShell slotSidebarLeft="w-52 bg-surface-900">
	<svelte:fragment slot="header">
		<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
			<svelte:fragment slot="lead">
				<button class="..." on:click={openDrawer}>
					<IconMenu2 size={32} />
				</button>
			</svelte:fragment>
			<a href="/">
				<h1 class="...">Markright</h1>
			</a>
			<svelte:fragment slot="trail">
				<Avatar initials="JD" background="bg-primary-500" width="w-12" />
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft" />
	<slot />
</AppShell>
