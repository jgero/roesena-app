<script>
  export let navigate;
</script>

<style>
  * {
    user-select: none;
  }
  .root {
    border-top: 3px solid lightcoral;
  }
  div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
  }
  span {
    color: darkslategray;
    position: relative;
    height: min-content;
    margin: 0 1rem;
    cursor: pointer;
  }
  span::after {
    content: "";
    display: block;
    position: absolute;
    top: 100%;
    left: 50%;
    height: 2px;
    width: 0;
    background-color: lightcoral;
    transition: all ease-out 0.2s;
  }
  span:hover::after {
    width: 100%;
    left: 0;
  }
</style>

<div class="root">
  <div>breadcrumbs</div>
  <div>
    <span on:click={() => navigate('/about')}>Impressum</span>
    <span on:click={() => navigate('/references')}>Links</span>
  </div>
</div>
