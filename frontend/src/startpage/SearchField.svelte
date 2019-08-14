<script>
  // your script goes here
</script>

<style>
  input {
    outline: none;
    font-size: 3rem;
    border: solid lightgray 2px;
    padding: 5px 4rem 5px 2rem;
    border-radius: 3rem;
    transition: border-color ease-out 0.2s;
    color: lightgray;
  }
  input:focus {
    border-color: lightcoral;
    color: darkslategray;
  }
  .searchContainer {
    position: relative;
    margin: 5rem;
  }
  input:focus + svg {
    color: lightcoral;
  }
  svg {
    position: absolute;
    top: 10px;
    right: 1rem;
    width: 3rem;
    height: 3rem;
    color: lightgray;
    transition: color ease-out 0.2s;
  }
</style>

<span class="searchContainer">
  <input spellcheck="false" />
  <svg>
    <use href="svg/search-solid.svg#search" />
  </svg>
</span>
