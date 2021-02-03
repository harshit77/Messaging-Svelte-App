<script>
import {Router, Route } from 'svelte-routing';
import Register from './Register.svelte';
import Home from './Home.svelte';
import Login from './Login.svelte';
import AppLayout from './AppLayout.svelte';
import { isLoggedIn } from '../utlis';
export let url="/login";
console.log(isLoggedIn());
</script>
<Router url={url} basepath="/">
    <Route path="/register">
        {#if isLoggedIn()!=undefined}
            <AppLayout/>
        {:else}
            <Register/>
        {/if}
    </Route>
    <Route path="/login">
        {#if isLoggedIn()!=undefined}
        <AppLayout/>
    {:else}
        <Login/>
    {/if}
    </Route>
    <Route path="user/">
        {#if isLoggedIn()!=undefined}
        <AppLayout userId={0}/>
        {:else}
            <Login/>
        {/if}
        </Route>
    <Route path="user/:userId" let:params>
        {#if isLoggedIn()!=undefined}
        <AppLayout {...params}/>
        {:else}
            <Login/>
        {/if}
        </Route>
    <Route path="view-team/:teamId/*channelId" let:params>
        {#if isLoggedIn()!=undefined}
        <AppLayout {...params}/>
        {:else}
            <Login/>
        {/if}
        </Route>
    <Route path="/" component={AppLayout} />
</Router>