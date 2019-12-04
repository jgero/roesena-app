<script>
	import Logo from "./Logo.svelte";
	export let segment;
</script>

<style>
	nav {
		box-shadow: 0 -0.4rem 0.9rem 0.2rem var(--box-border);
		padding: .5rem;
		background-color: var(--background);
	}

	ul, a {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	ul {
		margin: 0;
		padding: 0 3rem;
		list-style-type: none;
		display: flex;
		width: fit-content;
	}

	li {
		margin-inline-start: 2rem;
		margin-inline-end: 2rem;
	}

	a {
		text-decoration: none;
		color: var(--on-background);
		border-bottom: 1px solid transparent;
		transition: color 0.2s ease-out, border-bottom 0.2s ease-out;
	}

	a.textElem:hover,
	a.textElem:focus {
		color: var(--primary);
		outline: none;
	}

	a.selected {
		color: var(--on-background);
		border-bottom: 1px solid var(--primary);
	}

</style>

<nav>
	<ul>
		<li><a href='.'><Logo /></a></li>
		<li><a class="textElem" href="events" class:selected='{segment === "events"}'>Events</a></li>
		<li><a class="textElem" href="calendar" class:selected='{segment === "calendar"}'>Kalender</a></li>
	</ul>
</nav>
