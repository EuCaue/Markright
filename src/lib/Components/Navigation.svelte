<script lang="ts">
	import { drawerStore, LightSwitch } from '@skeletonlabs/skeleton';

	function closeDrower(): void {
		drawerStore.close();
	}
</script>

<nav class="list-nav p-4 md:mt-4">
	<ul class="w-30">
		<li class="list-option">
			<a href="/" on:click={closeDrower}>Home</a>
		</li>
		<li class="list-option"><a href="/settings" on:click={closeDrower}>Settings</a></li>
		<li class="list-option"><a href="/how-it-works" on:click={closeDrower}>How To Use</a></li>
		<li class="list-option ml-5 lg:ml-9 scale-110">
			<LightSwitch />
		</li>
	</ul>
</nav>
