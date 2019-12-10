<script>
  import { flashPopup } from '../stores.js';
  import { fly } from 'svelte/transition';

  let message = "";
  let visible = false;

  flashPopup.subscribe(msg => {
    if (!msg) {
      return;
    }
    message = msg;
    visible = true;
    setTimeout(() => visible = false, 3000);
  });
</script>

<style>

  .wrapper {
    position: fixed;
    z-index: 1;
    height: 25%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    left: 0;
    top: 10%;
  }

  .messageBox {
    background-color: var(--secondary);
    color: var(--on-secondary);
    border-radius: 1rem;
    padding: 3rem;
  }

</style>

{#if visible}
  <div transition:fly="{{ y: -200, duration: 200 }}" class="wrapper">
    <div class="messageBox">
      {message} 
    </div>
  </div>
{/if}
