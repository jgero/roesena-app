<script>
  export let navigate;
  export let route;
  let crumbs = [];

  $: {
    crumbs = route
      // split route at the questionmark to remove parameters
      .split("?")[0]
      // then split the path at its slashes
      .split("/")
      // and map this array to something readable for the user
      .map((crumb, ind) => {
        if (ind === 0 && crumb === "") {
          return "Startseite";
        }
        return crumb;
      })
      // if crumb is still an empty string filter it out
      .filter(crumb => crumb !== "");
  }
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
  .breadcrumbs > div {
    background-color: lightskyblue;
    height: max-content;
    padding: 0.2rem;
    margin: 0 0.5rem;
  }
  /* .breadcrumbs > div:first-child {
    margin-left: 0;
  } */
</style>

<div class="root">
  <div class="breadcrumbs">
    {#each crumbs as crumb}
      <div>{crumb}</div>
    {/each}
  </div>
  <div>
    <span on:click={() => navigate('/about')}>Impressum</span>
    <span on:click={() => navigate('/references')}>Links</span>
  </div>
</div>
