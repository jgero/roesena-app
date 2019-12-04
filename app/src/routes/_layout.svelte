<script>
	import Nav from '../components/Nav.svelte';
	import Footer from '../components/Footer.svelte';

	export let segment;
</script>

<style>
	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		padding-block-start: 1rem;
		overflow-y: auto;
		overflow-x: hidden;
	}
</style>

<Nav {segment}/>

<main>
	<slot></slot>
	<Footer />
</main>