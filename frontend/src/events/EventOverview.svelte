<script>
  import { get, post } from "../libs/http.js";

  let persons = [];
  let name = "";

  // get all the persons from the database
  get("/api/person/")
    // if request works display the persons
    .then(el => (persons = JSON.parse(el)))
    // if not just log the error for now
    .catch(err => {
      console.log(err.code);
    });

  function addPerson() {
    if (!name) {
      return;
    }
    let person = {
      name: name
    };
    post(
      "/api/person/",
      { "Content-Type": "application/json" },
      JSON.stringify(person)
    )
      .then(el => {
        // add new person to the array
        persons = [...persons, JSON.parse(el)];
        // reset the value of the input field
        name = "";
      })
      .catch(el => console.log(el));
  }
</script>

<style>
  .wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    padding: 5%;
  }
  .personBox {
    height: min-content;
    width: 12rem;
    border: 2px solid lightgray;
    padding: 4px;
  }
  .personBox div,
  .personBox input {
    font-size: 1rem;
    padding: 2px;
    outline: none;
    border: none;
    border-bottom: 1px solid lightgray;
    width: 100%;
    transition: border-color ease-out 0.2s;
  }
  .personBox input:focus {
    border-color: lightcoral;
  }
  .personBox .inputContainer {
    position: relative;
  }
  .personBox .plus {
    cursor: pointer;
  }
  .personBox .plus::after,
  .personBox .plus::before {
    position: absolute;
    content: "";
    width: 2rem;
    height: 0.5rem;
    background-color: lightcoral;
    top: calc(100% + 1.5rem);
    right: calc(50% - 1rem);
    opacity: 0;
    transition: all ease-out 0.2s;
    transform: translateY(-20px);
    pointer-events: none;
  }
  .personBox .plus::before {
    transform: translateY(-20px) rotate(90deg);
  }
  .personBox input:focus + .plus::before,
  .personBox input + .plus:hover::before,
  .personBox input:focus + .plus::after,
  .personBox input + .plus:hover::after {
    opacity: 1;
    pointer-events: all;
    transform: translateY(0);
    pointer-events: all;
  }
  .personBox input:focus + .plus::before,
  .personBox input + .plus:hover::before {
    transform: rotate(90deg);
  }
</style>

<div class="wrapper">
  <div class="personBox">
    {#each persons as person}
      <div>{person.name}</div>
    {/each}
    <span class="inputContainer">
      <input bind:value={name} spellcheck="false" />
      <span class="plus" on:click={() => addPerson()} />
    </span>
  </div>
</div>
