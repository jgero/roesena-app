<script context="module">
  export async function preload() {
    this.redirect(200, `calendar/${new Date().toISOString()}`);
  }
</script>
