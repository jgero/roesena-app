<script context="module">
	export async function preload({ params, query }) {
    const event = await this.fetch(`events/${params.id}.json`).then(el => el.json());
    return { event };
	}
</script>

<script>
  import EditEvent from '../../../components/events/EditEvent.svelte';

  export let event;
</script>

<style>

</style>

<EditEvent event="{event}" />
