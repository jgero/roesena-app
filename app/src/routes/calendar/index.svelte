<script>
  import Calendar from "../../components/calendar/calendar.svelte";
  import { fadeIn, fadeOut } from "../../animations/fade.js";

  let selectedDate = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  }
</script>

<style>
  .wrapper {
    width: 100%;
    height: 100%;
    min-height: 100%;
    display: grid;
    grid-template-columns: 1fr 7fr 1fr;
    grid-template-rows: minmax(0, 1fr);
    grid-template-areas: 'leftArrow calendar rightArrow';
  }

  .arrow {

  }

  .left {
    grid-area: leftArrow;
  }

  .right {
    grid-area: rightArrow;
  }
</style>

<svelte:head>
	<title>RöSeNa Event-Kalender</title>
</svelte:head>

<div in:fadeIn out:fadeOut class="wrapper">
  <div class="arrow left">left</div>
  <div style="grid-area: calendar;">
    <Calendar year={selectedDate.year} month={selectedDate.month} />
  </div>
  <div class="arrow right">right</div>
</div>
