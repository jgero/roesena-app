<script>
  const dateRegEx = String.raw`^[0-9]{2}\.[0-9]{2}\.[0-9]{4}$`;
  const authRegEx = String.raw`^[12345]{1}$`;

  function onSubmit(event) {
    const data = {
      title: event.target.title.value,
      description: event.target.description.value,
      start_date: dateInputToJsDate(event.target.start_date.value).toISOString(),
      end_date: dateInputToJsDate(event.target.end_date.value).toISOString(),
      auth_lvl: parseInt(event.target.auth_lvl.value, 10)
    };
    console.log(data);
    fetch("events.json", {method: "POST", headers: { "Content-Type": "application/json"}, body: JSON.stringify(data)});
  }

  function dateInputToJsDate(dateString) {
    // split string into array in year month day format
    let segments = dateString.split(".").reverse();
    // subtract 1 from month, because january is 0. month in js
    segments[1] = segments[1] - 1;
    // return date object of these segments
    return new Date(...segments);
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
    <input type="text" id="title" required>
  </div>

  <div>
    <label for="description">Beschreibung</label>
    <textarea id="description" rows="10"></textarea>
  </div>

  <div>
    <label for="start_date">Beginn</label>
    <input type="text" id="start_date" pattern="{dateRegEx}" required>
  </div>

  <div>
    <label for="end_date">Ende</label>
    <input type="text" id="end_date" pattern="{dateRegEx}" required>
  </div>

  <div>
    <label for="auth_lvl">Berechtigungsgruppe</label>
    <input type="text" id="auth_lvl" pattern="{authRegEx}" required>
  </div>

  <button type="submit">Event erstellen</button>
</form>