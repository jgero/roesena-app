<script>
  export let day;
  // export let events;
  // let evs;

  // $: evs = getEvents(day, events);
</script>

<style>
  .wrapper {
    display: flex;
    height: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }
  .events {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .event {
    background-color: lightskyblue;
    display: block;
    margin: 2px 0;
    width: 100%;
    text-align: center;
  }
</style>

<div class="wrapper">
  <span class="date">{day.date}</span>
  <div class="events">
    {#each day.events as event}
      <span class="event">{event}</span>
    {/each}
  </div>
</div>
