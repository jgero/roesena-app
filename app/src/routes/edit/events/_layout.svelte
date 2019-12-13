<script>
  import { fadeIn, fadeOut } from '../../../animations/fade.js';
</script>

<style>

</style>

<div in:fadeIn out:fadeOut>
  <slot></slot>
</div>
