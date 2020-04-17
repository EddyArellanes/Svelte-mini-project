<script>
import { onMount } from 'svelte';
import api from '../lib/fetch.js';
import { wallets, transactions } from '../store/store.js';

let disabled = false;

onMount( async() =>{
  //Note that in store writable object you need to denote with a $ variable to access to it content, otherwise you are
  //accesing to methods set, udpate, suscribe
  const data = await getTransactions();
  transactions.update( w => data );
  console.log('Transactions', $transactions);
});

const getTransactions = async () => {
  const data = await api("/transactions", 'GET');
  return data.data;
} 
const getWallets = async () => {
  const data = await api("/wallets", 'GET');
  return data.data;
} 
const revertTransaction = async (i) => {
  disabled = true;
  transactions.update( w => {
    w[i].reverted = !w[i].reverted;
    return w;
  });
  const data = await api(`/transactions/${$transactions[i].id}`, 'PUT', $transactions[i]);
  console.log('Update', data);
  
  const walletsUpdate = await getWallets();
  console.log(walletsUpdate);
  wallets.update( w => walletsUpdate );

  const transactionsUpdate = await getTransactions();
  transactions.update( w => transactionsUpdate );

  disabled = false;
}

</script>

<style>
	li{
    font-weight: bold;
  }
  button{
    display: inline;
    background-color: #3578E5;
    color: white;
    border-radius: 2%;
  }
</style>

<div id="Transaction">
  <p style="font-size:28px;">Transactions</p>
  {#each $transactions as {name, quantity_money, type, reverted}, i } <!--Destructuring props, you can do transactions as w and thats fine as object-->
    <li>
      {name} - {quantity_money} 
      <b>{ type == 'Income' ? 'Ingreso' : 'Gasto'  }</b>
      <button disabled="{disabled}" on:click="{() => revertTransaction(i)}">{reverted == false ? 'Revertir' : 'Aplicar'}</button>
    </li>
   
  {/each}
</div>