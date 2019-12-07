<script context="module">
	export async function preload({ params, query }) {
    const events = await this.fetch("events.json").then(el => el.json());
    return { events };
	}
</script>

<script>
  import { fadeIn, fadeOut } from '../../animations/fade.js';
  import EventCard from "../../components/events/EventCard.svelte";

  export let events;
</script>

<style>
  div {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    width: 70%;
  }
</style>

<div in:fadeIn out:fadeOut>
  {#each events as ev}
    <EventCard event={ev}/>
  {/each}
</div>