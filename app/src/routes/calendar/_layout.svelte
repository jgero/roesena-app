<script>
  import { onDestroy } from 'svelte';
  import { fadeIn, fadeOut } from "../../animations/fade.js";
  import { goto, stores } from '@sapper/app';

  let nextMonth;
  let previousMonth;

  const { page } = stores();
  const unsub = page.subscribe(snapshot => {
    if (snapshot.path.includes("/calendar")) {
      if (!snapshot.params.id) {
        // when no parameter is given navigate to the calendar of the current month
        goto(`calendar/${new Date().toISOString()}`);
      } else {
      const currentDate = new Date(snapshot.params.id);
      // set the previous month
      if (currentDate.getMonth() > 0) {
        // month is later than jan -> just subtract month
        previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1).toISOString();
      } else {
        // month is jan -> dec of previous year
        previousMonth = new Date(currentDate.getFullYear() - 1, 11).toISOString();
      }
      // set the next month
      if (currentDate.getMonth() > 10) {
        // month is dec -> jan of next year
        nextMonth = new Date(currentDate.getFullYear() + 1, 0).toISOString();
      } else {
        // month is before dec -> next month of same year
        nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1).toISOString();
      }
      }
    }
  })

  onDestroy(unsub);
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

.arrowWrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.right {
  grid-area: rightArrow;
  transform: rotate(180deg);
}

.left {
  grid-area: leftArrow;
}

.arrow {
  width: 50%;
  height: 20%;
  color: var(--secondary);
  background-color: var(--secondary);
  clip-path: polygon(80% 0, 100% 0, 20% 50%, 100% 100%, 80% 100%, 0 50%);
  opacity: .6;
  transition: opacity .2s ease-out;
}

.arrow:hover,
.arrow:focus {
  opacity: 1;
}
</style>

<svelte:head>
<title>RöSeNa Event-Kalender</title>
</svelte:head>

<div in:fadeIn out:fadeOut class="wrapper">
<div class="arrowWrapper left">
  <a class="arrow" href="calendar/{previousMonth}">.</a>
</div>
<div style="grid-area: calendar;">
  <slot></slot>
</div>
<div class="arrowWrapper right">
  <a class="arrow" href="calendar/{nextMonth}">.</a>
</div>
</div>
