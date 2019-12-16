<script context="module">
  export async function preload() {
    const lists = await this.fetch("edit/idLists.json").then(el => el.json());
    return { lists };
  }
</script>

<script>
  import { fadeIn, fadeOut  } from '../../animations/fade.js';
  import { flashPopup } from '../../stores.js';
  import { goto } from '@sapper/app';

  export let lists;

  function onDelete(id) {
    console.log(id);
    fetch(`events/${id}.json`, { method: "DELETE" }).then(el => el.json())
      .then((result) => {
        if (result.success) {
          flashPopup.next("Event gelöscht");
          // delete the deleted event from the list of shown items
          lists.events.splice(lists.events.findIndex(el => el._id === id), 1);
          lists = lists;
          return;
        }
        flashPopup.next("Event konnte nicht gelöscht werden");
      })
      .catch(() => flashPopup.next("Fehler!"));
  }
</script>

<style>
  .wrapper {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  ul {
    list-style: none;
    padding: 2rem;
    background-color: var(--primary);
    margin: 1rem;
    border-radius: 1rem;
    border: 1px solid var(--background);
    min-width: 10rem;
    max-width: 15vw;
  }

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  li.header {
    font-weight: bold;
    font-size: 1.5rem;
    margin-block-end: .5rem;
  }
  
  a {
    text-decoration: none;
    outline:none;
    color: inherit;
    border-bottom: 1px solid transparent;
    transition: border-color .2s ease-out;
  }

  button {
    font-size: 1.5rem;
    font-weight: bold;
    background-color: transparent;
    color: var(--on-primary);
    border: .2rem solid var(--on-primary);
    width: 1.5rem;
    height: 1.5rem;
    line-height: .5rem;
    padding: 0;
    margin: .2rem;
    text-align: center;
    border-radius: .4rem;
    outline: none;
  transition: .2s ease-out all;
  }

  button:hover,
  button:focus {
    cursor: pointer;
    background-color: var(--on-primary);
    color: var(--primary);
    border-color: var(--on-primary);
  }

  a:hover,
  a:focus {
    border-bottom: 1px solid var(--on-primary);
  }
</style>

<svelte:head>
<title>RöSeNa Daten Bearbeiten</title>
</svelte:head>

<div in:fadeIn out:fadeOut class="wrapper">
  <ul>
    <li class="header">Events</li>
    {#each lists.events as event}
      <li><a href="edit/events/{event._id}">{event.title}</a><button on:click={() => onDelete(event._id)}>-</button></li>
    {/each}
    <li><button on:click={() => goto('/edit/events') }>+</button></li>
  </ul>
  <ul>
    <li class="header">Gruppen</li>
    {#each lists.groups as group}
      <li>{group.name}</li>
    {/each}
  </ul>
  <ul>
    <li class="header">Artikel</li>
    {#each lists.articles as article}
      <li>{article.title}</li>
    {/each}
  </ul>
  <ul>
    <li class="header">Bilder</li>
    {#each lists.images as image}
      <li>{image.title}</li>
    {/each}
  </ul>
  <ul>
    <li class="header">Personen</li>
    {#each lists.persons as person}
      <li>{person.name}</li>
    {/each}
  </ul>
</div>
