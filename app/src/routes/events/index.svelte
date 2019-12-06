<script context="module">
	export async function preload({ params, query }) {
    const events = await this.fetch("events.json").then(el => el.json());
    return { events };
	}
</script>

<script>
  import { fadeIn, fadeOut } from '../../animations/fade.js';

  export let events;
</script>

<style>

</style>

<div in:fadeIn out:fadeOut>
  {#each events as ev}
    <div>{ev.title}</div>
  {/each}
</div>