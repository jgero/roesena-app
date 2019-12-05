<script>
  import Calendar from "../../components/calendar/calendar.svelte";

  let selectedDate = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  }
</script>

<style>
  /* your styles go here */
</style>

<Calendar year={selectedDate.year} month={selectedDate.month} />