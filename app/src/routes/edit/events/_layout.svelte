<script>
  import { fadeIn, fadeOut } from '../../../animations/fade.js';
</script>

<style>

</style>

<svelte:head>
<title>RöSeNa Event Bearbeiten</title>
</svelte:head>

<div in:fadeIn out:fadeOut>
  <slot></slot>
</div>
