<script>
  import { flashPopup } from '../../stores.js';

  export let event;
  const isNewEvent = !event;

  const dateRegEx = String.raw`^[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{4}$`;
  const authRegEx = String.raw`^[12345]{1}$`;

  function onSubmit(submitEvent) {
    const data = {
      title: submitEvent.target.title.value,
      description: submitEvent.target.description.value,
      start_date: dateInputToJsDate(submitEvent.target.start_date.value).toISOString(),
      end_date: dateInputToJsDate(submitEvent.target.end_date.value).toISOString(),
      auth_lvl: parseInt(submitEvent.target.auth_lvl.value, 10)
    };
    if (isNewEvent) {
      // insert new event to database -> post
      fetch("events.json", {method: "POST", headers: { "Content-Type": "application/json"}, body: JSON.stringify(data)})
        .then((result) => {
          if (result) {
            flashPopup.next("Event erfolgreich erstellt");
          } else {
            flashPopup.next("Fehler!");
          }
        })
       .catch(() => flashPopup.next("Fehler!"));
    } else {
      // update event in database -> put
      // set the id of the event that should be updated
      data._id = event._id;
      fetch("events.json", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
        .then(() => {
          if (result) {
            flashPopup.next("Event erfolgreich erstellt");
          } else {
            flashPopup.next("Fehler!");
          }
        })
        .catch(() => flashPopup.next("Fehler!"));
    }
  }

  function dateInputToJsDate(dateString) {
    // split string into array in year month day format
    let segments = dateString.split(".").reverse();
    // subtract 1 from month, because january is 0. month in js
    segments[1] = segments[1] - 1;
    // return date object of these segments
    return new Date(...segments);
  }

  function UTCDateStringToInputString(UTCString) {
    // create a date object and transform it into a readable format
    const dateObj = new Date(UTCString);
    return `${dateObj.getDate()}.${dateObj.getMonth() + 1}.${dateObj.getFullYear()}`
  }
</script>

<style>
  form,
  div {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  div {
    width: 100%;
    margin: .5rem;
  }

  label {
    font-size: 0.8rem;
    padding: 0 .4rem;
    transform: translateY(.5rem);
    background-color: var(--background);
    color: var(--on-background);
  }

  input, textarea {
    font-size: 2rem;
    outline: none;
    border: 1px solid var(--secondary);
    border-radius: .5rem;
    padding: .5rem;
    transition: border-color .2s ease-out, box-shadow .2s ease-out;
  }

  textarea {
    font-family: inherit;
    font-size: 1rem;
    width: 100%;
    resize: none;
  }

  input:hover,
  input:focus,
  textarea:hover,
  textarea:focus {
    box-shadow: .2rem .2rem .2rem 0px var(--box-border);
  }

  input:invalid {
    border-color: var(--primary);
  }

  button {
    background-color: var(--background);
    color: var(--on-background);
    transition: background-color .2s ease-out;
    font-size: 1.5rem;
    border: 2px solid var(--primary);
    padding: .5rem;
    border-radius: .5rem;
    margin: 1rem;
    cursor: pointer;
    outline: none;
  }

  button:hover,
  button:active {
    background-color: var(--primary);
  }
</style>

<form on:submit|preventDefault="{onSubmit}">
  <div>
    <label for="title">Titel</label>
    <input type="text" id="title" value={event ? event.title : ''} required>
  </div>

  <div>
    <label for="description">Beschreibung</label>
    <textarea id="description" rows="10" value={event ? event.description : ''} ></textarea>
  </div>

  <div>
    <label for="start_date">Beginn</label>
    <input type="text" id="start_date" pattern="{dateRegEx}" value={event ? UTCDateStringToInputString(event.start_date) : ''} required>
  </div>

  <div>
    <label for="end_date">Ende</label>
    <input type="text" id="end_date" pattern="{dateRegEx}" value={event ? UTCDateStringToInputString(event.end_date) : ''} required>
  </div>

  <div>
    <label for="auth_lvl">Berechtigungsgruppe</label>
    <input type="text" id="auth_lvl" pattern="{authRegEx}" value={event ? event.auth_lvl : ''} required>
  </div>

  <button type="submit">{ isNewEvent ? 'Event erstellen' : 'Event bearbeiten' }</button>
</form>
