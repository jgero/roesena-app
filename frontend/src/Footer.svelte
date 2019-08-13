<script>
  // your script goes here
</script>

<style>
  nav {
    color: purple;
    position: relative;
  }
  nav::after {
    content: "";
    display: block;
    position: absolute;
    top: 100%;
    left: 50%;
    height: 2px;
    width: 0;
    background-color: red;
    transition: all ease-out 0.2s;
  }
  nav:hover::after {
    width: 100%;
    left: 0;
  }
</style>

<!-- <footer> -->
<div>breadcrumbs</div>
<nav>Impressum</nav>
<nav>Links</nav>
<!-- </footer> -->
