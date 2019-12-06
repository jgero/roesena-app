<script>

</script>

<style>
  footer {
    width: 100%;
    background-color: var(--secondary);
    padding: 2rem;
    margin-block-start: 4rem;
    padding-block-start: 6rem;
    clip-path: polygon(100% 100%, 0% 100%, 0% 30%, 50% 0%, 100% 30%);
    display: flex;
    align-items: center;
    justify-content: space-around;
  }

  nav {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }

  p {
    color: var(--on-secondary);
    text-align: center;
  }

  a {
    text-decoration: none;
    color: var(--on-secondary);
    margin: .2rem;
    font-weight: bold;
    border-bottom: 1px solid transparent;
    transition: border-bottom .2s ease-out;
  }

  a:hover,
  a:focus {
    border-bottom: 1px solid var(--on-secondary);
    outline: none;
  }
</style>

<footer>
  <nav>
    <a href="http://www.daswildeheer.de">Das Wilde Heer</a>
    <a href="http://www.roehling-stones.de">Röhling Stones</a>
    <a href="http://brandjoggala.de">Brandjoggala</a>
  </nav>
  <p>
    Faschingsgesellschaft Röhlinger Sechtanarren e.V. <br>
    Max Mustermann <br>
    Musterstraße 12 <br>
    12345 Musterstadt <br>
    E-Mail: info@mustermail.com
  </p>
  <nav>
    <a href="about">Impressum</a>
    <a href="references">Links</a>
    <a href="press">Presse</a>
    <a href="help">Hilfe</a>
  </nav>
</footer>