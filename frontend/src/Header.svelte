<script>
  export let navigate;
  export let onUsernameChange;
  let username;

  onUsernameChange("header", function(el) {
    username = el;
  });
</script>

<style>
  * {
    user-select: none;
  }
  nav {
    display: flex;
    height: 100%;
    overflow: hidden;
    align-content: center;
    justify-content: space-between;
    border-bottom: 3px solid lightcoral;
  }
  .navElem {
    position: relative;
    height: min-content;
    cursor: pointer;
  }
  .navElem::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    height: 2px;
    width: 0;
    background-color: lightcoral;
    transition: all ease-out 0.2s;
  }
  .navElem:hover::after {
    width: 100%;
    left: 0;
  }
  .logo {
    font-size: 4rem;
    cursor: pointer;
    color: darkslategray;
  }
  .linkBox svg {
    height: 2rem;
    width: 2rem;
    cursor: pointer;
    transition: color ease-out 0.2s;
  }
  .linkBox svg:hover {
    color: lightcoral;
  }
  .linkBox {
    display: flex;
    align-items: center;
    color: darkslategray;
  }
  .linkBox span,
  .linkBox svg {
    margin: 1rem;
  }
  .profile {
    font-size: 2rem;
    width: 3rem;
    height: 3rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    background: lightskyblue;
    margin: 0 1rem;
    border-radius: 1.5rem;
  }
</style>

<nav>
  <div class="logo" on:click={() => navigate('/')}>
    <span>RöSeNa</span>
  </div>
  <div class="linkBox">
    <span class="navElem" on:click={() => navigate('/groups')}>Gruppen</span>
    <span class="navElem" on:click={() => navigate('/events')}>Events</span>
    <span class="navElem" on:click={() => navigate('/archive')}>Archiv</span>
    <svg on:click={() => navigate('/calendar')}>
      <use href="svg/calendar-alt-regular.svg#calendar" />
    </svg>
    <svg on:click={() => navigate('/images')}>
      <use href="svg/images-regular.svg#images" />
    </svg>
    <svg on:click={() => navigate('/events')}>
      <use href="svg/tasks-solid.svg#tasks" />
    </svg>
    {#if username}
      <div class="profile" on:click={() => navigate('/login')}>
        <span>{username.charAt(0)}</span>
      </div>
    {:else}
      <svg on:click={() => navigate('/login')}>
        <use href="svg/sign-in-alt-solid.svg#sign-in" />
      </svg>
    {/if}
  </div>
</nav>
