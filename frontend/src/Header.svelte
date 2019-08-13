<script>
  export let navigate;
</script>

<style>
  /* your styles go here */
</style>

<nav>
  <div on:click={() => navigate('/')}>RöSeNa</div>
  <span on:click={() => navigate('/groups')}>Gruppen</span>
  <span>Events</span>
  <span>Bilder</span>
</nav>
