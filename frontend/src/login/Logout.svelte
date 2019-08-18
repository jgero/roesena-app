<script>
  import { post } from "../libs/http.js";

  export let username;
  export let setUsername;

  function tryLogOut() {
    post("/api/logout/" + username, { "content-type": "application/json" }, "")
      .then(el => setUsername(""))
      .catch(err => {
        console.log(err);
        setUsername("");
      });
  }
</script>

<style>
  input[type="button"] {
    margin: 1rem;
    background-color: lightcoral;
    border: none;
    outline: none;
    box-shadow: none;
    font-size: 1.1rem;
    padding: 1rem;
    font-weight: bold;
    border-radius: 0.5rem;
    transition: all ease-out 0.1s;
    cursor: pointer;
  }
  input[type="button"]:active {
    transform: scale(1.1);
  }
</style>

<h1>Hello, {username}!</h1>
<br />
<input type="button" value="Abmelden" on:click={tryLogOut} />
