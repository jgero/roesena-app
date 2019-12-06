<script>
  import Calendar from "../../components/calendar/calendar.svelte";
  import { stores } from '@sapper/app';

  const { page } = stores();
  const selectedDateObj = new Date($page.params.id);
  const selectedDate = {
    year: selectedDateObj.getFullYear(),
    month: selectedDateObj.getMonth() + 1
  }
</script>

<style>

</style>

<Calendar year={selectedDate.year} month={selectedDate.month} />