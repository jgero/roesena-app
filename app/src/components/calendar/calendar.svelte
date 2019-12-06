<script>
  // year and month have to be passed as numbers
  export let year;
  export let month;

  $: headerString = makeHeaderString(month, year);
  $: mondayFirstOffset = new Date(year, month - 1, 1).getDay() ? new Date(year, month - 1, 1).getDay() - 1 : 6;
  // gather day information
  // important infos: Date.date is base 1, Date.month is base 0, Date.day is base 0 and begins with sunday
  $: dayTemplate = new Array(new Date(year, month, 0).getDate()).fill(undefined).map((_, index) => {
    const column = new Date(year, month - 1, index).getDay() + 1;
    const row = Math.floor((mondayFirstOffset + index) / 7) + 3;
    const events = [
      {_id: "aöslkdfuß0asdß0f", title: "event with a long name"},
      {_id: "testsetyva0", title: "event 03"},
      {_id: "ß097as0d8fa0ß8df", title: "Saisoneröffnung"},
      {_id: "asd089faß0df", title: "Umzug in Röhlingen"},
      {_id: "asßdf8asdfß", title: "22 Jahre wildes Heer party"}
    ];
    return {
      templateArea: `${row} / ${column} / ${row} / ${column}`,
      date: index + 1,
      events
    }
  });

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

  // make header string of passed month and year
  function makeHeaderString(month, year) {
    let newHeaderString = (() => {
      switch(month) {
        case 1: return "Januar";
        case 2: return "Februar";
        case 3: return "März";
        case 4: return "April";
        case 5: return "Mai";
        case 6: return "Juni";
        case 7: return "Juli";
        case 8: return "August";
        case 9: return "September";
        case 10: return "Oktober";
        case 11: return "November";
        case 12: return "Dezember";
        default: throw new Error("unknown month number: " + month);
      }
    })();
    // append year to the header
    return newHeaderString + " " + year;
  }


</script>

<style>
  .calendarWrapper {
    height: 100%;
    width: 100%;
    padding: 1rem;
    display: grid;
    grid-template-rows: 1fr .5fr    1fr 1fr 1fr 1fr 1fr 1fr;
    row-gap: .5rem;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    column-gap: .5rem;
    grid-template-areas:
      ". . header header header . ."
      "mon tue wed thu fri sat sun"
      ". . . . . . ."
      ". . . . . . ."
      ". . . . . . ."
      ". . . . . . ."
      ". . . . . . ."
      ". . . . . . ."
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
    min-height: 0;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  .dayField > span {
    width: 100%;
    display: flex;
    justify-content: center;
    font-weight: bold;
    border-bottom: 1px solid var(--background);
  }

  .eventWrapper {
    overflow-y: auto;
  }

  .eventWrapper > a {
    display: block;
    text-decoration: none;
    padding: .1rem;
    margin: .1rem;
    border-radius: .3rem;
    color: var(--on-primar);
    background-color: var(--primary);
  }

  .eventWrapper > a:hover,
  .eventWrapper > a:focus {
    background-color: var(--background);
    color: var(--on-background);
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
      {#if dayTemplateItem.events.length > 0}
        <div class="eventWrapper">
          {#each dayTemplateItem.events as ev}
            <a href="events/{ev._id}">{ev.title}</a>
          {/each}
        </div>
      {/if}
    </div>
  {/each}
</div>