<script>
  import DayDetails from "./DayDetails.svelte";
  import {
    getMonthName,
    makeMondayFirst,
    getEvents,
    toDBDateString,
    fromDBDateString
  } from "../libs/calendarLib.js";

  import { fly } from "svelte/transition";

  export let ROUTER_ANIMATION_DURATION;
  export let navigate;

  const weekdayStrings = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

  let date = getDateFromParams(new URL(location.href).searchParams.get("date"));
  let days = [];
  let events = [];

  $: {
    // this all gets updated when the date changes
    getEvents(date)
      .then(evs => {
        events = evs;
        updateDays();
      })
      .catch(err => {
        events = [];
        updateDays();
      });
    // update the url so it works on reload
    navigate(`/calendar?date=${date.year}-${date.month}`);
  }

  // try to set the calendar month to the date in the URL params, if not just use the current month
  function getDateFromParams(param) {
    if (param) {
      let parts = param.split("/");
      if (parts.length == 2) {
        return {
          year: param.split("/")[0],
          month: param.split("/")[1]
        };
      }
    }
    return {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1
    };
  }

  function goNextMonth() {
    if (date.month < 12) {
      date.month += 1;
    } else {
      date.year += 1;
      date.month = 1;
    }
  }

  function goPreviousMonth() {
    if (date.month > 1) {
      date.month -= 1;
    } else {
      date.year -= 1;
      date.month = 12;
    }
  }

  function updateDays() {
    days = new Array(new Date(date.year, date.month, 0).getDate())
      .fill(undefined)
      .map((day, ind) => ({
        gridArea: getGridArea(ind),
        events: getEventsForDay(ind + 1),
        date: ind + 1
      }));
  }

  function getEventsForDay(day) {
    return events
      .filter(ev => {
        return (
          ev.startDate <=
            toDBDateString({ year: date.year, month: date.month, day: day }) &&
          ev.endDate >=
            toDBDateString({ year: date.year, month: date.month, day: day })
        );
      })
      .map(ev => ev.title);
  }

  function getGridArea(ind) {
    const row =
      Math.floor(
        (makeMondayFirst(new Date(date.year, date.month, 1).getDay()) + ind) / 7
      ) + 3;
    const column = new Date(date.year, date.month, ind).getDay() + 2;
    return `${row} / ${column} / ${row} / ${column}`;
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
  <h1>{getMonthName(date.month)} {date.year}</h1>
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
