<script>
  // your script goes here
</script>

<style>
  div {
    width: 100%;
    display: flex;
    flex: 0 0 40vh;
    padding: 1rem;
    justify-content: space-evenly;
    align-items: center;
  }
  .title {
    font-size: 8rem;
    border-bottom: 3px solid lightskyblue;
  }
  .subTitle {
    font-size: 2rem;
  }
  span {
    z-index: 2;
    color: darkslategrey;
  }
  svg {
    z-index: 1;
    width: 50%;
    height: 100%;
    opacity: 0.5;
    transform: rotate(-10deg) scale(1.5) translateY(-2rem);
  }
</style>

<div>
  <span>
    <span class="title">RöSeNa</span>
    <br />
    <span class="subTitle">Röhlinger Sechtanarren e.V. 1970</span>
  </span>
  <svg>
    <use href="svg/RöSeNa.svg#roesena" />
  </svg>
</div>
