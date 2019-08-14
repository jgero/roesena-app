<script>
  export let article;
  export let navigate;
</script>

<style>
  .infoCard {
    width: 50rem;
    height: 17rem;
    border: 2px solid lightgray;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 10px;
    margin: 10px;
    transition: transform ease-out 0.2s;
    cursor: pointer;
    z-index: 2;
    background-color: white;
  }

  .infoCard:hover {
    transform: scale(1.05);
  }
  img {
    height: 100%;
    margin-right: 10px;
  }
  .textContent {
    overflow: hidden;
    height: 100%;
    position: relative;
  }
  .textContent::after {
    content: "";
    position: absolute;
    height: 2rem;
    width: 100%;
    top: calc(100% - 2rem);
    background: linear-gradient(
      0deg,
      rgba(255, 255, 255, 1) 0%,
      rgba(255, 0, 0, 0) 100%
    );
  }
</style>

<div class="infoCard" on:click={() => navigate('/article?id=' + article._id)}>
  <img src={article.imagePaths[0]} alt="IMAGE" />
  <div class="textContent">
    <h3>{article.title}</h3>
    <p>{article.content}</p>
  </div>
</div>
