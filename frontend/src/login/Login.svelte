<script>
  import Logout from "./Logout.svelte";
  import { post } from "../libs/http.js";

  import { fly } from "svelte/transition";

  export let ROUTER_ANIMATION_DURATION;
  export let navigate;
  export let getUsername;
  export let setUsername;
  export let onUsernameChange;

  let username = getUsername() ? getUsername() : "";
  let usernameInput = "";
  let password = "";

  onUsernameChange("login", function(el) {
    username = el;
  });

  function tryLogin() {
    // post login details to the backend
    let details = {
      username: usernameInput,
      password: password
    };
    post(
      "/api/login",
      { "Content-Type": "application/json" },
      JSON.stringify(details)
    )
      .then(res => {
        // save the name of the currently logged-in user by setting it in the global injectable
        setUsername(usernameInput);
      })
      .catch(err => {
        // diplay that login details were wrong or that server failed
        console.log(err);
      });
  }
</script>

<style>
  .wrapper {
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
  }
  .loginBox {
    color: darkslategray;
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
    padding: 2rem;
  }
  input[type="text"],
  input[type="password"] {
    margin: 1rem;
    outline: none;
    border: none;
    border-bottom: 1px solid lightcoral;
  }
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
  p > span {
    color: lightskyblue;
    text-decoration-line: underline;
    cursor: pointer;
  }
</style>

<div
  in:fly={{ x: -100, delay: ROUTER_ANIMATION_DURATION, duration: ROUTER_ANIMATION_DURATION }}
  out:fly={{ x: 100, duration: ROUTER_ANIMATION_DURATION }}
  class="wrapper">

  {#if username}
    <Logout {username} {setUsername} />
  {:else}
    <div class="loginBox">
      <h1>Anmeldung</h1>
      <input
        bind:value={usernameInput}
        type="text"
        placeholder="Benutzername"
        spellcheck="false" />
      <input
        bind:value={password}
        type="password"
        placeholder="Passwort"
        spellcheck="false" />
      <input on:click={() => tryLogin()} type="button" value="Anmelden" />
      <p>
        Sie haben kein Konto oder Ihr Passwort vergessen?
        <span on:click={() => navigate('/')}>hier klicken</span>
      </p>
    </div>
  {/if}
</div>
