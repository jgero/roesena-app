<script>
  // year and month have to be passed as numbers
  export let year;
  export let month;

  // make header string of passed month and year
  let headerString;
  switch(month) {
    case 1: headerString = "Januar"; break;
    case 2: headerString = "Februar"; break;
    case 3: headerString = "März"; break;
    case 4: headerString = "April"; break;
    case 5: headerString = "Mai"; break;
    case 6: headerString = "Juni"; break;
    case 7: headerString = "Juli"; break;
    case 8: headerString = "August"; break;
    case 9: headerString = "September"; break;
    case 10: headerString = "Oktober"; break;
    case 11: headerString = "November"; break;
    case 12: headerString = "Dezember"; break;
    default: throw new Error("unknown month number: " + month);
  }
  // append year to the header
  headerString = headerString + " " + year;

  // set weekdays
  const weekdayStrings = [
    { area: "mon", text: "Mo" },
    { area: "tue", text: "Di" },
    { area: "wed", text: "Mi" },
    { area: "thu", text: "Do" },
    { area: "fri", text: "Fr" },
    { area: "sat", text: "Sa" },
    { area: "sun", text: "So" }
  ];

  // gather day information
  // important infos: Date.date is base 1, Date.month is base 0, Date.day is base 0 and begins with sunday
  let mondayFirstOffset = new Date(year, month - 1, 1).getDay();
  mondayFirstOffset = mondayFirstOffset > 0 ? mondayFirstOffset - 1 : 6;
  const dayTemplate = new Array(new Date(year, month, 0).getDate()).fill(undefined).map((_, index) => {
    const column = new Date(year, month - 1, mondayFirstOffset + index + 1).getDay() + 2;
    const row = Math.floor((mondayFirstOffset + index) / 7) + 3;
    const events = ["test1", "test2"];
    return {
      templateArea: `${row} / ${column} / ${row} / ${column}`,
      date: index + 1,
      events
    }
  });
</script>

<style>
  .calendarWrapper {
    min-height: 100%;
    width: 100%;
    padding: 1rem;
    display: grid;
    grid-template-rows: 1fr .5fr    1fr 1fr 1fr 1fr 1fr 1fr;
    row-gap: .5rem;
    grid-template-columns: 2fr   1fr 1fr 1fr 1fr 1fr 1fr 1fr    2fr;
    column-gap: .5rem;
    grid-template-areas:
      ". . . header header header . . ."
      ". mon tue wed thu fri sat sun ."
      ". . . . . . . . ."
      "arrow-left . . . . . . . arrow-right"
      "arrow-left . . . . . . . arrow-right"
      ". . . . . . . . ."
      ". . . . . . . . ."
      ". . . . . . . . ."
  }

  h1, h2 {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--background);
    color: var(--on-background);
    border-radius: .5rem;
  }

  .dayField {
    background-color: var(--primary);
    border-radius: .5rem;
    padding: .2rem;
  }

  .dayField > span {
    width: 100%;
    display: flex;
    justify-content: center;
    font-weight: bold;
    border-bottom: 1px solid var(--background);
  }
</style>

<div class="calendarWrapper">
  <h1 style="grid-area: header">{headerString}</h1>
  {#each weekdayStrings as wkd}
    <h2 style="grid-area: {wkd.area};">{wkd.text}</h2>
  {/each}
  {#each dayTemplate as dayTemplateItem}
    <div style="grid-area: {dayTemplateItem.templateArea}" class="dayField">
      <span>{dayTemplateItem.date}</span>
      {#each dayTemplateItem.events as ev}
        <div>{ev}</div>
      {/each}
    </div>
  {/each}
</div>