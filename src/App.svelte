<script>
	import Wallet from './components/Wallet.svelte';
	import Transaction from './components/Transaction.svelte';
	import Dashboard from './components/Dashboard.svelte';

	const data = {
		name: 'Eddy',
		lastName: 'Arellanes',
		age: 26
	}
	let other = 'Food';
</script>

<main>
	<h1>Hyper Wallet</h1>
	<Dashboard {...data} />
  <Wallet />
	<Transaction/>

</main>

<style>
	:global(:root){
		--theme-color: purple;
	}
	:global(body){
		background-color: #fafafa;
		color: #0084f6;
	}
	:global(body.dark-mode){
		background-color: #000000; 
		color: #bfc2c7;
	}

	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {

		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}
	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>