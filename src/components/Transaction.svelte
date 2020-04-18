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
const addTransaction = async (event) => {
  disabled = true;
  const name = event.target[0].value;
  const quantity = event.target[1].value;
  const walletId = event.target[2].value;
  const type = event.target[3].value;
  //Validations from Scratch hahaha 
  if(name.length > 2 && quantity > 0 && walletId.length > 0 && type.length > 0){
    const payload = {
      name,
      quantity,
      walletId,
      type,
      reverted: false,
    }
    console.log('Payload', payload);
    const data = await api('/transactions', 'POST', payload);
    const walletsStore = await getWallets();    
    wallets.update( w => walletsStore );

    const transactionsUpdate = await getTransactions();
    transactions.update( w => transactionsUpdate );

    disabled = false;
  }
  
} 

const revertTransaction = async (i) => {
  disabled = true;
  transactions.update( w => {
    w[i].reverted = !w[i].reverted;
    return w;
  });
  const data = await api(`/transactions/${$transactions[i].id}`, 'PUT', $transactions[i]);
  
  const walletsUpdate = await getWallets();
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

  .addNew{
    background-color: #1a3379;
    color: white;
  }
</style>

<div id="Transaction">
  <p style="font-size:28px;">Transactions</p>

  <form on:submit|preventDefault="{addTransaction}" >
    <input type="text" placeholder="Nombre" required>
    <input type="number" placeholder="Cantidad" required step="0.01">
    <select>
      <option label="Selecciona el Wallet" disabled></option>
      {#each $wallets as {name, quantity, id}, i }
        <option value="{id}">{name}</option>
      {:else}
        <option disabled>Hijole joven no hay Wallets</option>
      {/each}
    </select>
    <select>
      <option label="Selecciona el tipo de transacción" disabled></option>
      <option value="Income">Ingreso</option>
      <option value="Expense">Gasto</option>
    </select>
    <button  disabled="{disabled}" class="addNew" type="submit">Agregar</button>
  </form>


  {#each $transactions as {name, quantity_money, type, reverted}, i } <!--Destructuring props, you can do transactions as w and thats fine as object-->
    <li>
      {name} - {quantity_money} 
      <b>{ type == 'Income' ? 'Ingreso' : 'Gasto'  }</b>
      <button disabled="{disabled}" on:click="{() => revertTransaction(i)}">{reverted == false ? 'Revertir' : 'Aplicar'}</button>
    </li>
  {:else}
    <p>Cargando ...</p>
  {/each}
</div>