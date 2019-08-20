<script>
  import DayDetails from "./DayDetails.svelte";
  import {
    getMonthName,
    makeMondayFirst,
    getEvents
  } from "../libs/calendarLib.js";

  import { fly } from "svelte/transition";

  export let ROUTER_ANIMATION_DURATION;
  export let navigate;

  const weekdayStrings = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

  let date;
  let month;
  let year;
  let days = [];
  let events = [];

  try {
    // try to set the calendar month to the date in the URL params, if not just use the current month
    let param = new URL(location.href).searchParams.get("date");
    date = param ? new Date(param) : new Date();
    // update the url so it works on reload
    navigate("/calendar?date=" + date.toISOString());
  } catch (e) {
    // just use "today" as selected date on error
    date = new Date();
    navigate("/calendar?date=" + date.toISOString());
  }

  $: {
    // this all gets updated when the date changes
    month = date.getMonth();
    year = date.getFullYear();
    getEvents(date)
      .then(evs => {
        // take the events and map them to date objects
        events = [...evs].map(el => {
          el["startDate"] = new Date(el["startDate"]);
          el["endDate"] = new Date(el["endDate"]);
          return el;
        });
        updateDays();
      })
      .catch(err => {
        events = [];
        updateDays();
      });
  }

  function updateDays() {
    days = new Array(new Date(year, month, 0).getDate())
      .fill(undefined)
      .map((day, ind) => ({
        gridArea: getGridArea(ind),
        events: getEventsForDay(ind + 1),
        date: ind + 1
      }));
  }

  function getEventsForDay(day) {
    if (events) {
      return events
        .filter(
          ev => ev.startDate.getDay() >= day || ev.endDate.getDay() <= day
        )
        .map(ev => ev.title);
    } else {
      return [];
    }
  }

  function getGridArea(ind) {
    const row =
      Math.floor(
        (makeMondayFirst(new Date(year, month, 1).getDay()) + ind) / 7
      ) + 3;
    const column = new Date(year, month, ind).getDay() + 2;
    return `${row} / ${column} / ${row} / ${column}`;
  }

  function goNextMonth() {
    if (date.getMonth() < 11) {
      var newMonth = date.getMonth() + 1;
      date = new Date(date.getFullYear(), newMonth);
    } else {
      let newYear = date.getFullYear() + 1;
      date = new Date(newYear, 0);
    }
    navigate("/calendar?date=" + date.toISOString());
  }

  function goPreviousMonth() {
    if (date.getMonth() > 0) {
      var newMonth = date.getMonth() - 1;
      date = new Date(date.getFullYear(), newMonth);
    } else {
      let newYear = date.getFullYear() - 1;
      date = new Date(newYear, 11);
    }
    navigate("/calendar?date=" + date.toISOString());
  }
</script>

<style>
  main {
    height: 100%;
    width: 100%;
    color: darkslategray;
    display: grid;
    grid-row-gap: 10px;
    grid-column-gap: 10px;
    grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 2fr;
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    grid-template-areas:
      ". . . month-header month-header month-header . . ."
      ". Mo Di Mi Do Fr Sa So ."
      ". . . . . . . . ."
      "arrow-left . . . . . . . arrow-right"
      "arrow-left . . . . . . . arrow-right"
      ". . . . . . . . ."
      ". . . . . . . . ."
      ". . . . . . . . .";
  }
  h1 {
    grid-area: month-header;
  }
  h2 {
    color: lightcoral;
    font-size: 2rem;
  }
  h1,
  h2 {
    margin: auto;
  }
  .arrow {
    display: block;
    height: 100%;
    width: 100%;
    background-color: lightgray;
    clip-path: polygon(50% 0, 30% 50%, 50% 100%, 60% 100%, 40% 50%, 60% 0);
    transition: all ease-out 0.2s;
    cursor: pointer;
  }
  .arrow:hover {
    transform: scale(1.05);
    background-color: lightcoral;
  }
  .left {
    grid-area: arrow-left;
  }
  .arrow:hover.right {
    transform: rotate(180deg) scale(1.05);
  }
  .right {
    grid-area: arrow-right;
    transform: rotate(180deg);
  }
  .day {
    border: 2px solid lightgray;
    padding: 2px;
    min-height: 0;
  }
</style>

<main
  in:fly={{ x: -100, delay: ROUTER_ANIMATION_DURATION, duration: ROUTER_ANIMATION_DURATION }}
  out:fly={{ x: 100, duration: ROUTER_ANIMATION_DURATION }}>
  <h1>{getMonthName(month)} {year}</h1>
  {#each weekdayStrings as weekday}
    <h2 style="grid-area: {weekday};">{weekday}</h2>
  {/each}

  {#each days as day}
    <div class="day" style="grid-area: {day.gridArea};">
      <DayDetails {day} />
    </div>
  {/each}

  <span on:click={() => goPreviousMonth()} class="arrow left" />
  <span on:click={() => goNextMonth()} class="arrow right" />
</main>
