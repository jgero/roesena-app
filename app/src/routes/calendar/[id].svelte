<script context="module">
        export async function preload({ params }) {
  const events = await this.fetch(`calendar/${params.id}.json`).then(el => el.json());
  return { events };
}
</script>

<script>
  import Calendar from "../../components/calendar/calendar.svelte";
  import { stores } from '@sapper/app';
  import { onDestroy } from 'svelte';

  let selectedDate;
  const { page } = stores();
  const unsub = page.subscribe(snapshot => {
    if (snapshot.path.includes("/calendar")) {
      const selectedDateObj = new Date(snapshot.params.id);
      selectedDate = {
        year: selectedDateObj.getFullYear(),
        month: selectedDateObj.getMonth() + 1
      }
    }
  });

  onDestroy(unsub);
</script>

<style>

</style>

<Calendar year={selectedDate.year} month={selectedDate.month} />
