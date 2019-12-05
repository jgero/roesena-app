<script>
	import { fadeIn, fadeOut } from '../animations/fade.js';
</script>

<style>
	.wrapper {
		display: grid;
    grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr 1fr;
		row-gap: 1rem;
    grid-template-areas: 'header .' 'aside .';
    height: 100%;
    width: 100%;
	}

	header {
		grid-area: header;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
	}

	header > h1 {
		font-size: 5rem;
	}

	header > h1,
	header > h3 {
		margin: 0;
		color: var(--on-background);
	}

	aside {
		grid-area: aside;
		display: flex;
    justify-content: center;
    align-items: center;
	}

	aside > div {
		width: 50%;
    padding: 1rem;
    background-color: var(--primary);
    color: var(--on-primary);
    border-radius: .5rem;
	}
</style>

<svelte:head>
	<title>RöSeNa</title>
</svelte:head>

<div class="wrapper" in:fadeIn out:fadeOut>
	<header>
		<h1>Röhlinger</h1>
		<h1>Sechtanarren</h1>
		<h3>e.V.1970</h3>
	</header>

	<aside>
		<div>
			<h3>fancy!</h3>
			<p>Hier wird dann mal das aktuellste Event angezeigt!!</p>
		</div>
	</aside>
</div>