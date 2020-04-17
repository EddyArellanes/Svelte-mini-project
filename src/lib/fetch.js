
const base_url = (process.env.api == 'local') ? process.env.api_local
: (process.env.api == 'dev') ? process.env.api_dev
: (process.env.api == 'qa') ? process.env.api_qa
: process.env.api_prod;

export default async (endpoint, method, payload)  =>{
  const options = {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  };
  if(payload) options.body = JSON.stringify(payload);
  console.log('Fetch Options', options);
  const data = await fetch(base_url + endpoint, options)
  .then( async (response) => {
    const text = await response.json();
    return { status: response.status, data: text};
  })  
  .then( (response) => {
    const success = (response.status == 200 || response.status == 201) ? '✔️' : '❌';
    return response.data;
  })
  .catch( (err) => {
    console.log('Jira Unable to get Issue metadata ❌ ', err);
    return err;
  })
  return data
}