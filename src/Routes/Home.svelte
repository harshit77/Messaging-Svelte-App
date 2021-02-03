<script>
export let name='';
import Users from '../Users.svelte';
import { Link } from 'svelte-routing';
</script>
<main>
        <h1>Hello {name}!</h1>
        <p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
    </main>
<Users />
<Link  to="/register">Register</Link>