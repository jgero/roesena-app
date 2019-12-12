<script context="module">
	export async function preload({ params, query }) {
    const events = await this.fetch("nextEvent.json").then(el => el.json());
    return { event: events[0] };
	}
</script>

<script>
  import { fadeIn, fadeOut } from '../animations/fade.js';

  export let event;
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

  a {
    width: 100%;
    height:100%;
    text-decoration: none;
    color:inherit;
  }

	aside div {
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
		<h3>e.V. 1970</h3>
	</header>

  {#if event}
    <aside>
		  <div>
        <a href="events/{event._id}">
          <h3>{event.title}</h3>
          <p>{event.description}</p>
        </a>
		  </div>
	  </aside>
  {/if}

</div>
