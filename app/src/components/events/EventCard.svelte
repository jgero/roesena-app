<script>
  export let event;

  function getDateStringFromUTCFormat(date) {
    const dateObj = new Date(date);
    return `${dateObj.getDate()}.${dateObj.getMonth() + 1}.${dateObj.getFullYear()}`;
  }
</script>

<style>
  a {
    width: 35%;
    min-width: 200px;
    max-height: 25vh;
    text-decoration: none;
    color: var(--on-primary);
    background-color: var(--primary);
    padding: 1rem;
    margin: 1rem;
    border-radius: .5rem;
    overflow: hidden;
    transition: box-shadow .2s ease-out;
  }

  a:hover,
  a:focus {
    box-shadow: .2rem .2rem .2rem 0px var(--box-border);
  }

  p {
    white-space: pre-wrap;
  }
</style>

<a href="events/{event._id}">
  <h3>{event.title}</h3>
  <span>{getDateStringFromUTCFormat(event.start_date)}</span> - <span>{getDateStringFromUTCFormat(event.end_date)}</span>
  <p>{event.description}</p>
</a>