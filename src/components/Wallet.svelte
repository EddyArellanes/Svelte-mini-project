<script>
import { onMount } from 'svelte';
import api from '../lib/fetch.js';
import { wallets as walletsStore } from '../store/store.js';
console.log('WalletsStore', walletsStore)
let count = 0;
let wallets;
let styles = {
  darkMode: false
}

walletsStore.subscribe(value => {
  console.log('It has changed', value);
  wallets = value;
});
  
onMount( async() =>{
  //Note that in store writable object you need to denote with a $ variable to access to it content, otherwise you are
  //accesing to methods set, udpate, suscribe
  const data = await getWallets();
  walletsStore.update( w => data );
  console.log('Wallets', wallets)
});

const handleClick =  () => count++;
const toggle =  () => {
  styles.darkMode = !styles.darkMode;
  window.document.body.classList.toggle("dark-mode");
};
const getWallets = async () => {
  const data = await api("/wallets", 'GET');
  return data.data;
} 
const addWallet = async (event) => {
  const name = event.target[0].value;
  const quantity = event.target[1].value;

  if(name.length > 2 && quantity > 0){
    const payload = {
      name,
      quantity
    }
    const data = await api('/wallets', 'POST', payload);
    console.log('Wallet POST', data);
    const walletsUpdate = await getWallets();    
    walletsStore.update( w => walletsUpdate );
  }
  
} 
</script>

<style>
  .wallet{
    position: relative;
    display: block;
  }
  li{
    font-weight: bold;
  }
</style>

<div id="Wallet" class="wallet">

  <h2>Dark Mode</h2>
  <button on:click="{toggle}">Switch</button>

  {#if !styles.darkMode}
    <p></p>
  {:else}
    <p></p>
  {/if}

  <p style="font-size:28px;">Wallets</p>

  <form on:submit|preventDefault="{addWallet}" >
    <input type="text" placeholder="Nombre" required>
    <input type="number" placeholder="Cantidad" required step="0.01">
    <button type="submit">Agregar</button>
  </form>

  {#each $walletsStore as {name, quantity_money}, i } <!--Destructuring props, you can do wallets as w and thats fine as object-->
    <li>{name} - {quantity_money}</li>

  {:else}
    <p>Cargando ...</p>
  {/each}


</div>