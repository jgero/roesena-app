<script context="module">
	export async function preload({ params, query }) {
    const event = await this.fetch(`events/${params.id}.json`).then(el => el.json());
    return { event };
	}
</script>

<script>
  import { fadeIn, fadeOut } from '../../animations/fade.js';
  export let event;

  function getDateStringFromUTCFormat(date) {
    const dateObj = new Date(date);
    return `${dateObj.getDate()}.${dateObj.getMonth() + 1}.${dateObj.getFullYear()}`;
  }
</script>

<style>
  article {
    max-width: 70%;
    border-radius: .5rem;
    margin-top: 4rem;
    padding: 1rem;
    border: 1px solid var(--box-border);
    color: var(--on-background);
    background-color: var(--background);
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  h1 {
    font-size: 3rem;
    margin-bottom: 0;
  }

  p {
    margin: 2rem 0;
    white-space: pre-wrap;
    width: 100%;
  }
</style>

<article in:fadeIn out:fadeOut>
  <h1><span>{event.title}</span></h1>
  <span class="dateWrapper">
    <span>{getDateStringFromUTCFormat(event.start_date)}</span> - <span>{getDateStringFromUTCFormat(event.end_date)}</span>
  </span>
  <p>{event.description}</p>
</article>
