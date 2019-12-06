<script>
	import Logo from "./Logo.svelte";
	export let segment;

	let isNavVisible = false;

	function toggleVisibility() {
		isNavVisible = !isNavVisible;
	}
</script>

<style>
	@media screen and (max-width: 900px) {
		nav {
			position: fixed;
			width: 70%;
			height: 100%;
			display: flex;
			align-items: flex-start;
			transform: translateX(-100%);
			box-shadow: none;
			transition: transform .2s ease-out, box-shadow .2s ease-out;
		}

		nav.visible {
			box-shadow: -0.4rem 0 0.9rem 0.2rem var(--box-border);
			transform: translateX(0);
		}

		ul {
			flex-direction: column;
			padding: 0;
			width: 100%;
			position: relative;
		}

		.burger {
			position: absolute;
			top: 1rem;
			right: -3rem;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			width: 2rem;
			height: 2rem;
		}

		.line {
			width: 100%;
			height: calc(100% / 5);
			background-color: var(--secondary);
			transition: transform .2s ease-out, opacity .2s ease-out;
		}

		nav.visible .line.upper {
			transform: translateY(200%) rotate(45deg);
		}

		nav.visible .line.middle {
			opacity: 0;
		}

		nav.visible .line.lower {
			transform: translateY(-200%) rotate(-45deg);
		}

		li {
			margin: 1rem 0;
		}
	}

	@media screen and (min-width: 901px) {
		nav {
			box-shadow: 0 -0.4rem 0.9rem 0.2rem var(--box-border);
			padding: .5rem;
		}
		
		ul {
			padding: 0 3rem;
			width: fit-content;
		}

		.burger {
			display: none;
		}

		li {
			margin: 0 2rem;
		}
	}

	nav {
		background-color: var(--background);
		z-index: 1;
	}

	ul, a {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	ul {
		margin: 0;
		list-style-type: none;
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

<nav class:visible="{isNavVisible}">
	<ul>
		<div class="burger" on:click={toggleVisibility}>
			<span class="line upper"></span>
			<span class="line middle"></span>
			<span class="line lower"></span>
		</div>
		<li><a href='.'><Logo /></a></li>
		<li><a class="textElem" href="events" rel=prefetch class:selected='{segment === "events"}'>Events</a></li>
		<li><a class="textElem" href="calendar" class:selected='{segment === "calendar"}'>Kalender</a></li>
		<li><a class="textElem" href="edit" class:selected='{segment === 'edit'}'>Bearbeiten</a></li>
	</ul>
</nav>
