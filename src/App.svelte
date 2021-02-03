<script>
	import { ApolloClient } from 'apollo-client';
	import { InMemoryCache } from 'apollo-cache-inmemory'
	import { HttpLink } from 'apollo-link-http';
	import { setContext } from 'apollo-link-context';
	import { setClient } from 'svelte-apollo';
	import Textfield from '@smui/textfield';
  import HelperText from '@smui/textfield/helper-text';
  import { createUploadLink } from 'apollo-upload-client';
  import Routes from './Routes/Routes.svelte';
  import {WebSocketLink } from 'apollo-link-ws';
  import {split} from 'apollo-link';
  import { getMainDefinition } from 'apollo-utilities';
  import Notification from "./Components/Notification.svelte";



	const httplink= new HttpLink({
  uri:'http://localhost:4000'
});

const uploadLink= new createUploadLink({
  uri: 'http://localhost:4000/graphql',
  headers: {
    "keep-alive": "true"
  }
})
const authLink=setContext((_,{headers})=>{
  const token=localStorage.getItem('token');

  return {
    headers:Object.assign({},headers,{authorization: token ? `${token}`:''})
  }

});

const wsLink= new WebSocketLink({
    uri:`ws://localhost:4000/graphql`,
    options:{
      reconnect:true,
      lazy: true,
      connectionParams: {
        authToken: localStorage.getItem('token')
    },
    }
  });

const isFile=(value)=>(
  (typeof File !== 'undefined' && value instanceof File) ||
  (typeof Blob !== 'undefined' && value instanceof Blob)
)


const isUpload=({variables})=>{
  return Object.values(variables).some(isFile)
}


const middleWareHTTPLink=authLink.concat(httplink);
const isSubscriptionOperation=({query})=>{
  const { kind , operation }= getMainDefinition(query);
  return (
      kind === 'OperationDefinition' &&
     operation === 'subscription'
  )
};

const requestLink= split(isSubscriptionOperation,wsLink,middleWareHTTPLink);

const terminatingLink= split(isUpload,uploadLink,requestLink);

// const link=split(({ query }) => {
//     const definition = getMainDefinition(query);
//     return (
//       definition.kind === 'OperationDefinition' &&
//       definition.operation === 'subscription'
//     );
//   },
//   wsLink,
//   middleWareHTTPLink,
//   );


const defaulOptions={
  query: {
    fetchPolicy:'cache-and-network',
    errorPolicy:'all'
  }
}

const client=new ApolloClient({
  link:terminatingLink,
  cache:new InMemoryCache(),
  defaulOptions
})
	setClient(client);
</script>
<Notification/>
<Routes	/>