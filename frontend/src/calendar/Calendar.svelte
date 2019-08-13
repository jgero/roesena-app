<script>
  const weekdayStrings = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

  export let date = new Date();
  // save date as ISO string

  let month;
  let year;
  $: {
    month = date.getMonth();
    year = date.getFullYear();
  }

  function daysInMonth() {
    return new Date(year, month, 0).getDate();
  }

  function getGridArea(ind) {
    const row = Math.round((new Date(month, year, 0).getDay() + ind) / 7) + 3;
    const column = new Date(year, month, ind).getDay() + 2;
    return `${row} / ${column} / ${row} / ${column}`;
  }

  function getMonthName() {
    switch (month) {
      case 0:
        return "Januar";
      case 1:
        return "Februar";
      case 2:
        return "März";
      case 3:
        return "April";
      case 4:
        return "Mai";
      case 5:
        return "Juni";
      case 6:
        return "Juli";
      case 7:
        return "August";
      case 8:
        return "September";
      case 9:
        return "Oktober";
      case 10:
        return "November";
      case 11:
        return "Dezember";
    }
  }
</script>

<style>
  main {
    height: 100%;
    width: 100%;
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
  h1,
  h2 {
    margin: auto;
  }
</style>

<main>
  <h1>{getMonthName()} {year}</h1>
  {#each weekdayStrings as weekday}
    <h2 style="grid-area: {weekday};">{weekday}</h2>
  {/each}

  {#each new Array(daysInMonth()) as _, i}
    <span style="grid-area: {getGridArea(i)};">{i + 1}</span>
  {/each}
</main>
