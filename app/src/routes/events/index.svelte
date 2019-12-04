<script context="module">
	export function preload({ params, query }) {
		return this.fetch(`events.json`).then(el => el.json()).then(el => {
      console.log(el);
    });
	}
</script>

<script>
  import { fadeIn, fadeOut } from '../../animations/fade.js';

</script>

<style>

</style>

<div in:fadeIn out:fadeOut>event works!</div>