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
		position: relative;
	}

	img {
		z-index: -1;
		height: 90vh;
    opacity: .4;
    position: absolute;
		transform: translateX(50%);
		transition: opacity .4 ease-out;
	}

	.startpage {
		opacity: 1;
	}
</style>

<Nav {segment}/>

<main>
	<img src="svg/wappen.svg" alt="background image" class:startpage="{!segment}">
	<slot></slot>
	<Footer />
</main>