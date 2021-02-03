<script>
import { query, getClient } from 'svelte-apollo';
import Queries from './Query/index.js'
const GET_USERS= Queries.getAllUsers;
const client=getClient();
const listofUsers= query(client,{query:GET_USERS})
</script>

{#await $listofUsers}
<p>Loading Users</p>
{:then result}
    <p>List Of The Users</p>
    {#each result.data.getAllUsers as user, i}
    <li>{user.id} {user.username} {user.email}  </li>
    {:else}
    No Users exists in the database
    {/each}
{/await}